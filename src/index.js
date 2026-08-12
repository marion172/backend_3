import express from 'express';

import { envConfig } from './config/index.js';
import { connectDB } from './config/db.js';
import logger from './config/logger.js';

import usersRoutes from './routes/users.routes.js';
import productsRoutes from './routes/products.routes.js';
import ordersRoutes from './routes/orders.routes.js';
import deliveriesRoutes from './routes/deliveries.routes.js';
import mocksRoutes from './mocks/routes/mock.routes.js';
import { errorHandler, notFoundHandler } from './middlewares/error-handle.middleware.js';

const app = express();

app.use(express.json());
app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/deliveries', deliveriesRoutes);

if (envConfig.NODE_ENV !== 'production') {
  app.use('/api/mocks', mocksRoutes);
}

app.get('/health', (req, res) => {
  res.send(`ShipNow API - corriendo en ${envConfig.NODE_ENV}`);
});

app.use(notFoundHandler);
app.use(errorHandler);

connectDB();

app.listen(envConfig.PORT, () => {
  logger.info(`Server ShipNow is running on port ${envConfig.PORT}`);
});
