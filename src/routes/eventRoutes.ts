import express, { Request, Response, NextFunction } from 'express';
import * as eventController from '../controllers/eventController';

const router = express.Router();

// Wrapper para tratar erros de funções assíncronas
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.post('/', asyncHandler(eventController.createEvent));
router.get('/', asyncHandler(eventController.getEvents));
router.get('/:id', asyncHandler(eventController.getEventById));
router.put('/:id', asyncHandler(eventController.updateEvent));
router.delete('/:id', asyncHandler(eventController.deleteEvent));

export default router;
