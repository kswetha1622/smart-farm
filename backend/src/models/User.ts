import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  firebaseUid: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  preferredLanguage: string;
  village?: string;
  district?: string;
  state?: string;
  totalLandAcres?: number;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String },
    profileImage: { type: String },
    preferredLanguage: { type: String, default: 'en', enum: ['en', 'te', 'hi', 'kn', 'ta', 'mr'] },
    village: { type: String },
    district: { type: String },
    state: { type: String },
    totalLandAcres: { type: Number, min: 0 },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
