import mongoose from 'mongoose';

import { envConfig } from './index.js';

export async function connectDB() {
  try {
    await mongoose.connect(envConfig.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
}

