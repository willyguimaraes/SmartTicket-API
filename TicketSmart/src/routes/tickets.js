import { Router } from 'express';
const router = Router();
import { createTicket, getTickets, getTicketById, updateTicket, deleteTicket } from '../controllers/ticketController';
import auth from '../middlewares/auth';

router.post('/', auth, createTicket);
router.get('/', getTickets);
router.get('/:id', getTicketById);
router.put('/:id', auth, updateTicket);
router.delete('/:id', auth, deleteTicket);

export default router;