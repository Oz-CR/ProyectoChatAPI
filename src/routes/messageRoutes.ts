import { Router } from 'express';
import { sendMessage, markAsRead, getConversations, getMessages } from '../controllers/messageController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware)

router.post('/send', sendMessage)
router.patch('/:messageId/read', markAsRead)
router.get('/get-messages', getMessages),
router.get('/get-conversations', getConversations)

export default router;