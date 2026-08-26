import app from './app.js';
import { envConfig } from './config/index.js';
import { connectDB } from './config/db.js';
import logger from './config/logger.js';

await connectDB();

const server = app.listen(envConfig.PORT, () => {
  logger.info(`Server ShipNow is running on port ${envConfig.PORT}`);
});

export { app, server };
