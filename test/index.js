import mongoose from 'mongoose';
import { envConfig } from '../src/config/index.js';
import logger from '../src/config/logger.js';

const testMongoUri = envConfig.MONGODB_TEST_URI;

export async function clearDatabase() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
}

before(async function () {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(testMongoUri);
      logger.info(`MongoDB connected for testing: ${testMongoUri}`);
    }
    await clearDatabase();
  } catch (error) {
    logger.fatal('Error connecting to MongoDB in test setup:', error.message);
    throw error;
  }
});

after(async function () {
  try {
    if (mongoose.connection.readyState !== 0) {
      await clearDatabase();
      await mongoose.connection.close();
      logger.info('MongoDB disconnected after tests');
    }
  } catch (error) {
    logger.error('Error closing MongoDB in test teardown:', error.message);
  }
});
