import { Router } from 'express';
import { register, login, listUsers } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register)
router.post('/login', login)
router.get('/list-users', authMiddleware, listUsers)

export default router;