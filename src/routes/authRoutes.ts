import { Router } from 'express';
import { Request, Response } from 'express';
import { register, login, listUsers } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register)
router.post('/login', login)
router.get('/list-users', listUsers)

export default router;