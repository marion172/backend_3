import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['PORT', 'MONGODB_URI', 'NODE_ENV'];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Falta configurar la variable de entorno crítica: ${envVar}`);
  }
});

export const envConfig = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_TEST_URI: process.env.MONGODB_TEST_URI,
  JWT_SECRET: process.env.JWT_SECRET || 'jwt_secret_dev',
  LOG_LEVEL: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'development' ? 'debug' : 'info'),
  EXTERNAL_SERVICE_URL: process.env.EXTERNAL_SERVICE_URL || 'http://localhost:4000',
};