import { Router } from 'express';

const router = Router();

// Temporal - implementaremos después
router.get('/:userId', (req, res) => {
  res.json({ message: 'Get messages endpoint' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Send message endpoint' });
});

export default router;