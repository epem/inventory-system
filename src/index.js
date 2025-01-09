import serverless from 'serverless-http';
import express from 'express';

import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
app.use(express.json());

// Connect the routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// Error handling
app.use(errorHandler);

export const handler = serverless(app);