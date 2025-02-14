import { Router } from 'express';
const router = Router();
import { createPurchase, getPurchases, getPurchaseById } from '../controllers/purchaseController';
import auth from '../middlewares/auth';

router.post('/', auth, createPurchase);
router.get('/', auth, getPurchases);
router.get('/:id', auth, getPurchaseById);

export default router;