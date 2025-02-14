import { Router } from 'express';
const router = Router();
import { register, login, getUser } from '../controllers/userController';

// Rota para registrar usuário
router.post('/register', register);

// Rota para login
router.post('/login', login);

// Rota para obter detalhes do usuário (rota protegida)
router.get('/:id', getUser);

export default router;
