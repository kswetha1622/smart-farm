import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartfarmerai';
  try {
    await mongoose.connect(uri);
    console.log('[DB] MongoDB connected successfully');
  } catch (err) {
    console.error('[DB] MongoDB connection error:', err instanceof Error ? err.message : err);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.warn('[DB] Running without MongoDB. Database features will be unavailable.');
    }
  }
};

export default connectDB;
