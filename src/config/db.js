import mongoose from 'mongoose';

import { envConfig } from './index.js';
import logger from './logger.js';

export async function connectDB() {
  try {
    await mongoose.connect(envConfig.MONGODB_URI);
    logger.info('MongoDB connected');
  } catch (error) {
    logger.fatal('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
}

