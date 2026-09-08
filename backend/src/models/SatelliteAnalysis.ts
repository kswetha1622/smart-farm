import mongoose, { Document, Schema } from 'mongoose';

export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface INdviStats {
  beforeMean: number;
  afterMean: number;
  minNdvi: number;
  maxNdvi: number;
  ndviDrop: number;
}

export interface ISatelliteAnalysis extends Document {
  userId: mongoose.Types.ObjectId;
  fieldId: mongoose.Types.ObjectId;
  beforeProductId?: string;
  afterProductId?: string;
  beforeDate?: Date;
  afterDate?: Date;
  beforeCloudCover?: number;
  afterCloudCover?: number;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  damageMapUrl?: string;
  ndviStatistics?: INdviStats;
  healthyAreaAcres?: number;
  moderateDamageAreaAcres?: number;
  severeDamageAreaAcres?: number;
  damagedAreaAcres?: number;
  totalAreaAcres?: number;
  damagePercentage?: number;
  status: AnalysisStatus;
  errorMessage?: string;
  createdAt: Date;
  completedAt?: Date;
}

const SatelliteAnalysisSchema = new Schema<ISatelliteAnalysis>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fieldId: { type: Schema.Types.ObjectId, ref: 'Field', required: true, index: true },
    beforeProductId: String,
    afterProductId: String,
    beforeDate: Date,
    afterDate: Date,
    beforeCloudCover: Number,
    afterCloudCover: Number,
    beforeImageUrl: String,
    afterImageUrl: String,
    damageMapUrl: String,
    ndviStatistics: {
      beforeMean: Number,
      afterMean: Number,
      minNdvi: Number,
      maxNdvi: Number,
      ndviDrop: Number,
    },
    healthyAreaAcres: Number,
    moderateDamageAreaAcres: Number,
    severeDamageAreaAcres: Number,
    damagedAreaAcres: Number,
    totalAreaAcres: Number,
    damagePercentage: Number,
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    errorMessage: String,
    completedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model<ISatelliteAnalysis>('SatelliteAnalysis', SatelliteAnalysisSchema);
