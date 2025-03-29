import express, { Request, Response, NextFunction } from 'express';
import * as reservationController from '../controllers/reservationController';

const router = express.Router();

// Wrapper para lidar com funções assíncronas
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post('/', asyncHandler(reservationController.createReservation));
router.get('/', asyncHandler(reservationController.getReservations));
router.get('/:id', asyncHandler(reservationController.getReservationById));
router.delete('/:id', asyncHandler(reservationController.cancelReservation));

export default router;
