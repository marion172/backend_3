import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { envConfig } from './config/index.js';
import swaggerSpecs from './config/swagger.js';
import usersRoutes from './routes/users.routes.js';
import productsRoutes from './routes/products.routes.js';
import ordersRoutes from './routes/orders.routes.js';
import deliveriesRoutes from './routes/deliveries.routes.js';
import mocksRoutes from './mocks/routes/mock.routes.js';
import { errorHandler, notFoundHandler } from './middlewares/error-handle.middleware.js';

export const app = express();

app.use(express.json({ limit: '1mb' }));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/deliveries', deliveriesRoutes);

if (envConfig.NODE_ENV !== 'production') {
  app.use('/api/mocks', mocksRoutes);
}

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'ShipNow API',
    environment: envConfig.NODE_ENV,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
