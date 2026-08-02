import express from 'express';

import { envConfig } from './config/index.js';
import { connectDB } from './config/db.js';

import usersRoutes from './routes/users.routes.js';
import productsRoutes from './routes/products.routes.js';
import mocksRoutes from './mocks/routes/mock.routes.js';

const app = express();

app.use(express.json());
app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);

if (envConfig.NODE_ENV !== 'production') {
  app.use('/api/mocks', mocksRoutes);
}

app.get('/health', (req, res) => {
  res.send(`ShipNow API - corriendo en ${envConfig.NODE_ENV}`);
});

connectDB();

app.listen(envConfig.PORT, () => {
  console.log(`Server is running on port ${envConfig.PORT}`);
});
