import serverless from 'serverless-http';
import express from 'express';
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import fs from 'fs';

import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan('combined', {
    stream: fs.createWriteStream('./logs/access.log', {flags: 'a'})
}));
// Connect the routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

// Error handling
app.use(errorHandler);

export const handler = serverless(app);