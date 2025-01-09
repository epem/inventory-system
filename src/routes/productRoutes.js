import { Router } from 'express';
import {
  getProductsHandler,
  createProductHandler,
  restockHandler,
  sellHandler,
} from '../controllers/productController.js';
import { validateUUID } from '../middleware/validateParams.js';

const router = Router();

router.get('/', getProductsHandler);
router.post('/', createProductHandler);
router.post('/:id/restock', validateUUID, restockHandler);
router.post('/:id/sell', validateUUID, sellHandler);

export default router;