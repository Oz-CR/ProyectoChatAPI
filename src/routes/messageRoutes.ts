import { Router } from 'express';
import { sendMessage, markAsRead, getConversations, getMessages } from '../controllers/messageController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware)

router.post('/send', authMiddleware, sendMessage)
router.patch('/:messageId/read', authMiddleware, markAsRead)
router.get('/get-messages', getMessages),
router.get('/get-conversations', getConversations)

export default router;