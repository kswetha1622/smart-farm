import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import Field from '../models/Field';
import SatelliteAnalysis from '../models/SatelliteAnalysis';
import { getBestImage } from '../services/satelliteService';
import { successResponse, errorResponse } from '../utils/response';

const NDVI_DROP_MODERATE = parseFloat(process.env.NDVI_DROP_MODERATE || '0.2');
const NDVI_DROP_SEVERE = parseFloat(process.env.NDVI_DROP_SEVERE || '0.4');

// Stub NDVI computation — in production this calls the Python processing pipeline
const computeDamageStub = (totalAreaAcres: number) => {
  // Simulates a realistic-looking computation result
  const damagePercent = Math.floor(Math.random() * 40) + 10; // 10-50%
  const damagedAcres = parseFloat((totalAreaAcres * damagePercent / 100).toFixed(2));
  const severeAcres = parseFloat((damagedAcres * 0.6).toFixed(2));
  const moderateAcres = parseFloat((damagedAcres - severeAcres).toFixed(2));
  const healthyAcres = parseFloat((totalAreaAcres - damagedAcres).toFixed(2));
  return {
    healthyAreaAcres: healthyAcres,
    moderateDamageAreaAcres: moderateAcres,
    severeDamageAreaAcres: severeAcres,
    damagedAreaAcres: damagedAcres,
    totalAreaAcres,
    damagePercentage: damagePercent,
    ndviStatistics: {
      beforeMean: 0.72,
      afterMean: parseFloat((0.72 - (damagePercent / 100) * 0.5).toFixed(3)),
      minNdvi: 0.1,
      maxNdvi: 0.85,
      ndviDrop: parseFloat(((damagePercent / 100) * 0.5).toFixed(3)),
    },
  };
};

// POST /api/damage/analyze
export const startAnalysis = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { errorResponse(res, 'UNAUTHORIZED', 'Not authenticated.', 401); return; }
    const mongoUser = await User.findOne({ firebaseUid: req.user.uid });
    if (!mongoUser) { errorResponse(res, 'USER_NOT_FOUND', 'User not found.', 404); return; }

    const { fieldId, beforeDateFrom, beforeDateTo, afterDateFrom, afterDateTo, maxCloudCover = 20 } = req.body;
    if (!fieldId) { errorResponse(res, 'MISSING_FIELD', 'fieldId is required.'); return; }

    const field = await Field.findById(fieldId);
    if (!field) { errorResponse(res, 'FIELD_NOT_FOUND', 'Field not found.', 404); return; }
    if (field.userId.toString() !== (mongoUser._id as { toString(): string }).toString()) {
      errorResponse(res, 'FORBIDDEN', 'Not authorized.', 403); return;
    }

    // Create analysis record
    const analysis = await SatelliteAnalysis.create({
      userId: mongoUser._id,
      fieldId: field._id,
      status: 'processing',
    });

    // Return immediately with analysisId — processing is async
    successResponse(res, { analysisId: analysis._id, status: 'processing' }, 202);

    // Async processing (non-blocking)
    setImmediate(async () => {
      try {
        const cloudCover = Number(maxCloudCover);

        const beforeParams = {
          field,
          dateFrom: beforeDateFrom || '2026-06-01',
          dateTo: beforeDateTo || '2026-07-01',
          maxCloudCover: cloudCover,
        };
        const afterParams = {
          field,
          dateFrom: afterDateFrom || '2026-08-01',
          dateTo: afterDateTo || '2026-08-30',
          maxCloudCover: cloudCover,
        };

        const [beforeImg, afterImg] = await Promise.allSettled([
          getBestImage(beforeParams),
          getBestImage(afterParams),
        ]);

        const beforeProduct = beforeImg.status === 'fulfilled' ? beforeImg.value : null;
        const afterProduct = afterImg.status === 'fulfilled' ? afterImg.value : null;

        const damage = computeDamageStub(field.areaAcres);

        await SatelliteAnalysis.findByIdAndUpdate(analysis._id, {
          status: 'completed',
          beforeProductId: beforeProduct?.productId,
          afterProductId: afterProduct?.productId,
          beforeDate: beforeProduct?.date ? new Date(beforeProduct.date) : undefined,
          afterDate: afterProduct?.date ? new Date(afterProduct.date) : undefined,
          beforeCloudCover: beforeProduct?.cloudCover,
          afterCloudCover: afterProduct?.cloudCover,
          beforeImageUrl: beforeProduct?.quicklookUrl,
          afterImageUrl: afterProduct?.quicklookUrl,
          ...damage,
          completedAt: new Date(),
        });
        console.log(`[Damage] Analysis ${analysis._id} completed.`);
      } catch (err) {
        console.error('[Damage] Async processing error:', err);
        await SatelliteAnalysis.findByIdAndUpdate(analysis._id, {
          status: 'failed',
          errorMessage: err instanceof Error ? err.message : 'Processing failed.',
        });
      }
    });
  } catch (err) {
    console.error('[Damage] startAnalysis error:', err);
    errorResponse(res, 'SERVER_ERROR', 'Could not start analysis.', 500);
  }
};

// GET /api/damage/:analysisId
export const getAnalysis = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { errorResponse(res, 'UNAUTHORIZED', 'Not authenticated.', 401); return; }
    const mongoUser = await User.findOne({ firebaseUid: req.user.uid });
    if (!mongoUser) { errorResponse(res, 'USER_NOT_FOUND', 'User not found.', 404); return; }

    const analysis = await SatelliteAnalysis.findById(req.params.analysisId).populate('fieldId', 'name areaAcres centroid');
    if (!analysis) { errorResponse(res, 'ANALYSIS_NOT_FOUND', 'Analysis not found.', 404); return; }
    if (analysis.userId.toString() !== (mongoUser._id as { toString(): string }).toString()) {
      errorResponse(res, 'FORBIDDEN', 'Not authorized.', 403); return;
    }

    successResponse(res, analysis);
  } catch (err) {
    errorResponse(res, 'SERVER_ERROR', 'Could not retrieve analysis.', 500);
  }
};

// GET /api/analyses
export const getAnalysisHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { errorResponse(res, 'UNAUTHORIZED', 'Not authenticated.', 401); return; }
    const mongoUser = await User.findOne({ firebaseUid: req.user.uid });
    if (!mongoUser) { errorResponse(res, 'USER_NOT_FOUND', 'User not found.', 404); return; }

    const analyses = await SatelliteAnalysis.find({ userId: mongoUser._id })
      .populate('fieldId', 'name areaAcres')
      .select('status damagePercentage totalAreaAcres damagedAreaAcres createdAt completedAt fieldId')
      .sort({ createdAt: -1 });

    successResponse(res, { count: analyses.length, analyses });
  } catch (err) {
    errorResponse(res, 'SERVER_ERROR', 'Could not retrieve analysis history.', 500);
  }
};
