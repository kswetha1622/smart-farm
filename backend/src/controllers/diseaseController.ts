import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import DiseaseAnalysis from '../models/DiseaseAnalysis';
import { analyzeImage } from '../services/diseaseService';
import { successResponse, errorResponse } from '../utils/response';
import { getLangFromRequest } from '../utils/i18n';

// POST /api/disease/analyze
export const analyzeDiseaseImage = async (req: AuthRequest, res: Response): Promise<void> => {
  const lang = getLangFromRequest(req as Parameters<typeof getLangFromRequest>[0]);
  try {
    if (!req.file) {
      errorResponse(res, 'NO_FILE', 'Please upload a crop image (JPG, PNG, or WEBP).'); return;
    }

    // With memory storage, file lives in req.file.buffer — no disk path needed.
    const imageBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    // If authenticated, find user to save history
    let mongoUser = null;
    let analysisId = null;
    
    if (req.user) {
      mongoUser = await User.findOne({ firebaseUid: req.user.uid });
      if (mongoUser) {
        const analysis = await DiseaseAnalysis.create({
          userId: mongoUser._id,
          imageUrl: `data:${mimeType};base64,[in-memory]`,
          language: lang,
          status: 'pending',
        });
        analysisId = analysis._id;
      }
    }

    // Analyze the image
    try {
      const requestLang = req.body.language || lang;
      const lat = req.body.lat ? parseFloat(req.body.lat) : undefined;
      const lon = req.body.lon ? parseFloat(req.body.lon) : undefined;
      
      const result = await analyzeImage(imageBuffer, mimeType, requestLang, lat, lon);

      if (analysisId) {
        await DiseaseAnalysis.findByIdAndUpdate(analysisId, {
          ...result,
          status: 'completed',
        });
      }

      successResponse(res, {
        analysisId,
        ...result,
      });
    } catch (analysisErr) {
      if (analysisId) {
        await DiseaseAnalysis.findByIdAndUpdate(analysisId, {
          status: 'failed',
          errorMessage: analysisErr instanceof Error ? analysisErr.message : 'Analysis failed.',
        });
      }
      errorResponse(res, 'ANALYSIS_FAILED', 'Disease analysis could not be completed. Please try again.', 500);
    }
  } catch (err) {
    console.error('[Disease] analyzeDiseaseImage error:', err);
    errorResponse(res, 'SERVER_ERROR', 'Could not process image.', 500);
  }
};

// GET /api/disease/history
export const getDiseaseHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { errorResponse(res, 'UNAUTHORIZED', 'Not authenticated.', 401); return; }
    const mongoUser = await User.findOne({ firebaseUid: req.user.uid });
    if (!mongoUser) { errorResponse(res, 'USER_NOT_FOUND', 'User not found.', 404); return; }
    const history = await DiseaseAnalysis.find({ userId: mongoUser._id })
      .select('-__v')
      .sort({ createdAt: -1 });
    successResponse(res, { count: history.length, history });
  } catch (err) {
    errorResponse(res, 'SERVER_ERROR', 'Could not retrieve disease history.', 500);
  }
};
