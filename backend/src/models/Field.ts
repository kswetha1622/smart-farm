import mongoose, { Document, Schema } from 'mongoose';

export interface ICoordinate {
  lat: number;
  lng: number;
}

export interface IField extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  geoJsonPolygon: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  centroid: ICoordinate;
  areaSquareMeters: number;
  areaAcres: number;
  village?: string;
  district?: string;
  state?: string;
  country: string;
  soilType?: string;
  previousCrop?: string;
  currentCrop?: string;
  irrigationAvailable?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FieldSchema = new Schema<IField>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    geoJsonPolygon: {
      type: { type: String, enum: ['Polygon'], required: true },
      coordinates: { type: [[[Number]]], required: true },
    },
    centroid: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    areaSquareMeters: { type: Number, required: true, min: 0 },
    areaAcres: { type: Number, required: true, min: 0 },
    village: { type: String },
    district: { type: String },
    state: { type: String },
    country: { type: String, default: 'India' },
    soilType: { type: String, enum: ['black', 'red', 'loamy', 'clay', 'sandy', 'alluvial', 'laterite'] },
    previousCrop: { type: String },
    currentCrop: { type: String },
    irrigationAvailable: { type: Boolean },
  },
  { timestamps: true }
);

FieldSchema.index({ geoJsonPolygon: '2dsphere' });

export default mongoose.model<IField>('Field', FieldSchema);
