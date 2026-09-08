import mongoose, { Document, Schema } from 'mongoose';

export interface IWeatherCache extends Document {
  locationKey: string; // "lat:lng" rounded to 2 decimal places
  currentWeather: Record<string, unknown>;
  forecast: Record<string, unknown>;
  fetchedAt: Date;
  expiresAt: Date;
}

const WeatherCacheSchema = new Schema<IWeatherCache>(
  {
    locationKey: { type: String, required: true, index: true, unique: true },
    currentWeather: { type: Schema.Types.Mixed, required: true },
    forecast: { type: Schema.Types.Mixed, required: true },
    fetchedAt: { type: Date, required: true, default: Date.now },
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
  },
  { timestamps: false }
);

export default mongoose.model<IWeatherCache>('WeatherCache', WeatherCacheSchema);
