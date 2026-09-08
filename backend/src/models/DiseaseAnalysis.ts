import mongoose, { Document, Schema } from 'mongoose';

export interface IDiseaseAnalysis extends Document {
  userId: mongoose.Types.ObjectId;
  imageUrl: string;
  crop?: string;
  possibleDisease?: string;
  confidence?: number;
  affectedAreaPercentage?: number;
  symptoms?: string[];
  actions?: string[];
  prevention?: string[];
  language: string;
  disclaimer: string;
  status: 'pending' | 'completed' | 'failed';
  errorMessage?: string;
  createdAt: Date;
}

const DiseaseAnalysisSchema = new Schema<IDiseaseAnalysis>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    imageUrl: { type: String, required: true },
    crop: String,
    possibleDisease: String,
    confidence: { type: Number, min: 0, max: 1 },
    affectedAreaPercentage: { type: Number, min: 0, max: 100 },
    symptoms: [String],
    actions: [String],
    prevention: [String],
    language: { type: String, default: 'en' },
    disclaimer: {
      type: String,
      default: 'This is a preliminary AI-based result. Please consult an agricultural expert before taking action.',
    },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    errorMessage: String,
  },
  { timestamps: true }
);

export default mongoose.model<IDiseaseAnalysis>('DiseaseAnalysis', DiseaseAnalysisSchema);
