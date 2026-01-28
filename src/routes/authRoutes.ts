import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

// Temporal - implementaremos después
router.post('/register', (req, res) => {
  res.json({ message: 'Register endpoint' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint' });
});

export default router;