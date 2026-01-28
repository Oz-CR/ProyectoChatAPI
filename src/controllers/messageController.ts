import { Request, Response } from 'express';
import { Message } from '../models/Message';
import mongoose from 'mongoose';

// Enviar mensaje
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { toUserId, encryptedContent } = req.body;
    const fromUserId = req.userId; // Del middleware de auth

    // Validar datos
    if (!toUserId || !encryptedContent) {
      res.status(400).json({ 
        error: 'toUserId y encryptedContent son requeridos' 
      });
      return;
    }

    // Validar que toUserId sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(toUserId)) {
      res.status(400).json({ 
        error: 'toUserId inválido' 
      });
      return;
    }

    // Crear mensaje
    const message = await Message.create({
      fromUserId,
      toUserId,
      encryptedContent
    });

    // Poblar información de usuarios
    await message.populate([
      { path: 'fromUser', select: 'username' },
      { path: 'toUser', select: 'username' }
    ]);

    res.status(201).json({
      message: 'Mensaje enviado exitosamente',
      data: {
        id: message._id,
        from: {
          id: message.fromUserId,
          username: (message as any).fromUser?.username
        },
        to: {
          id: message.toUserId,
          username: (message as any).toUser?.username
        },
        encryptedContent: message.encryptedContent,
        timestamp: message.timestamp,
        read: message.read
      }
    });
  } catch (error) {
    console.error('Error en sendMessage:', error);
    res.status(500).json({ 
      error: 'Error al enviar mensaje' 
    });
  }
};

export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { otherUserId } = req.query;

    let query: any = {
      $or: [
        { toUserId: userId },
        { fromUserId: userId }
      ]
    };

    if (otherUserId && mongoose.Types.ObjectId.isValid(otherUserId as string)) {
      query = {
        $or: [
          { fromUserId: userId, toUserId: otherUserId },
          { fromUserId: otherUserId, toUserId: userId }
        ]
      };
    }

    const messages = await Message.find(query)
      .populate('fromUserId', 'username')
      .populate('toUserId', 'username')
      .sort({ timestamp: -1 })
      .limit(100);

    res.json({
      messages: messages.map(msg => ({
        id: msg._id,
        from: {
          id: msg.fromUserId,
          username: (msg as any).fromUserId?.username
        },
        to: {
          id: msg.toUserId,
          username: (msg as any).toUserId?.username
        },
        encryptedContent: msg.encryptedContent,
        timestamp: msg.timestamp,
        read: msg.read
      }))
    });
  } catch (error) {
    console.error('Error en getMessages:', error);
    res.status(500).json({ 
      error: 'Error al obtener mensajes' 
    });
  }
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { messageId } = req.params;
    const userId = req.userId;

    // Validar messageId
    if (!mongoose.Types.ObjectId.isValid(messageId as string)) {
      res.status(400).json({ 
        error: 'messageId inválido' 
      });
      return;
    }

    // Buscar mensaje y verificar que el usuario es el destinatario
    const message = await Message.findOne({
      _id: messageId,
      toUserId: userId
    });

    if (!message) {
      res.status(404).json({ 
        error: 'Mensaje no encontrado o no autorizado' 
      });
      return;
    }

    // Marcar como leído
    message.read = true;
    await message.save();

    res.json({
      message: 'Mensaje marcado como leído',
      data: {
        id: message._id,
        read: message.read
      }
    });
  } catch (error) {
    console.error('Error en markAsRead:', error);
    res.status(500).json({ 
      error: 'Error al marcar mensaje como leído' 
    });
  }
};

// Obtener conversaciones (lista de usuarios con los que has chateado)
export const getConversations = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    // Obtener todos los mensajes del usuario
    const messages = await Message.find({
      $or: [
        { fromUserId: userId },
        { toUserId: userId }
      ]
    })
    .populate('fromUserId', 'username')
    .populate('toUserId', 'username')
    .sort({ timestamp: -1 });

    // Agrupar por usuario
    const conversationsMap = new Map();

    messages.forEach(msg => {
      const otherUserId = msg.fromUserId._id.toString() === userId 
        ? msg.toUserId._id.toString() 
        : msg.fromUserId._id.toString();

      if (!conversationsMap.has(otherUserId)) {
        const otherUser = msg.fromUserId._id.toString() === userId 
          ? msg.toUserId 
          : msg.fromUserId;

        conversationsMap.set(otherUserId, {
          userId: otherUserId,
          username: (otherUser as any).username,
          lastMessage: {
            content: msg.encryptedContent,
            timestamp: msg.timestamp,
            fromMe: msg.fromUserId._id.toString() === userId
          },
          unreadCount: 0
        });
      }
    });

    for (const [otherUserId, conversation] of conversationsMap.entries()) {
      const unreadCount = await Message.countDocuments({
        fromUserId: otherUserId,
        toUserId: userId,
        read: false
      });
      conversation.unreadCount = unreadCount;
    }

    res.json({
      conversations: Array.from(conversationsMap.values())
    });
  } catch (error) {
    console.error('Error en getConversations:', error);
    res.status(500).json({ 
      error: 'Error al obtener conversaciones' 
    });
  }
};