import mongoose, { Document, Schema } from 'mongoose';

export interface IUserSettings extends Document {
  userId: mongoose.Types.ObjectId;
  voiceOutput: boolean;
  autoRead: boolean;
  speechSpeed: 'slow' | 'normal' | 'fast';
  weatherAlerts: boolean;
  cropAlerts: boolean;
  diseaseAlerts: boolean;
  largeText: boolean;
  highContrast: boolean;
  simpleMode: boolean;
  preferredLanguage: string;
}

const UserSettingsSchema = new Schema<IUserSettings>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    voiceOutput: { type: Boolean, default: true },
    autoRead: { type: Boolean, default: false },
    speechSpeed: { type: String, enum: ['slow', 'normal', 'fast'], default: 'normal' },
    weatherAlerts: { type: Boolean, default: true },
    cropAlerts: { type: Boolean, default: true },
    diseaseAlerts: { type: Boolean, default: true },
    largeText: { type: Boolean, default: false },
    highContrast: { type: Boolean, default: false },
    simpleMode: { type: Boolean, default: false },
    preferredLanguage: { type: String, default: 'en', enum: ['en', 'te', 'hi', 'kn', 'ta', 'mr'] },
  },
  { timestamps: true }
);

export default mongoose.model<IUserSettings>('UserSettings', UserSettingsSchema);
