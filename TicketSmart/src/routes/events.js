import { Router } from 'express';
const router = Router();
import { createEvent, getEvents, getEventById, updateEvent, deleteEvent } from '../controllers/eventController';
import auth from '../middlewares/auth';

router.post('/', auth, createEvent);
router.get('/', getEvents);
router.get('/:id', getEventById);
router.put('/:id', auth, updateEvent);
router.delete('/:id', auth, deleteEvent);

export default router;