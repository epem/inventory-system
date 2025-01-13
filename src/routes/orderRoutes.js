import { Router } from 'express';
import { createOrderHandler } from '../controllers/orderController.js';

const router = Router();

router.post('/', createOrderHandler);

export default router;