import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get or Create Session (for guest/client)
router.post('/session', async (req, res) => {
  try {
    const { email, guestName } = req.body;
    // For simplicity, just create a new session
    // Or if logged in client, find an OPEN one
    let session;
    if (email) {
      session = await prisma.chatSession.findFirst({
        where: { email, status: 'OPEN' },
        include: { messages: true },
      });
    }

    if (!session) {
      session = await prisma.chatSession.create({
        data: { email, guestName, status: 'OPEN' },
        include: { messages: true },
      });

      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const greeting = await prisma.chatMessage.create({
        data: {
          sessionId: session.id,
          content: 'Welcome! Please wait a moment while a support representative joins the chat.',
          senderType: 'OPS_AGENT',
          timestamp,
        },
      });

      session.messages.push(greeting);

      // Notify ops room about new chat
      const io = req.app.get('io');
      if (io)
        io.to('operations_room').emit('new_chat_message', {
          sessionId: session.id,
          message: greeting,
        });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create chat session' });
  }
});

// Operations Team: List active and closed sessions
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await prisma.chatSession.findMany({
      where: { status: { not: 'DELETED' } },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Operations Team: Get specific session history
router.get('/:id/messages', async (req, res) => {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { sessionId: req.params.id },
      orderBy: { createdAt: 'asc' },
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Operations Team: Issue Ticket from Chat
router.post('/:id/ticket', async (req, res) => {
  try {
    const { title, description } = req.body;

    const session = await prisma.chatSession.findUnique({
      where: { id: req.params.id },
      include: { messages: true },
    });

    if (!session) return res.status(404).json({ error: 'Session not found' });

    const dateStr = new Date().toISOString().split('T')[0];

    const ticket = await prisma.supportCase.create({
      data: {
        title: title || `Chat Request from ${session.guestName || session.email || 'Guest'}`,
        orgName: session.email ? session.email : 'Guest',
        severity: 'Medium',
        status: 'Open',
        description: description || 'No description provided.',
        assignedTo: 'Unassigned',
        category: 'Live Support',
        createdDate: dateStr,
        updatedDate: dateStr,
      },
    });

    // Emit the ticket ID to the chat room
    const io = req.app.get('io');
    if (io) {
      io.to(req.params.id).emit('ticket_issued', ticket.id);
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to convert to ticket' });
  }
});

// Close chat and submit rating
router.post('/:id/rate', async (req, res) => {
  try {
    const { rating } = req.body;
    const session = await prisma.chatSession.update({
      where: { id: req.params.id },
      data: { status: 'CLOSED', rating: Number(rating) },
    });

    const io = req.app.get('io');
    if (io) {
      io.to('operations_room').emit('chat_closed', {
        sessionId: session.id,
        rating: session.rating,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});

// Operations Team: Delete/Archive chat
router.delete('/:id', async (req, res) => {
  try {
    await prisma.chatSession.update({
      where: { id: req.params.id },
      data: { status: 'DELETED' },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

// Public Ticket Tracking
router.get('/ticket/:id', async (req, res) => {
  try {
    const ticket = await prisma.supportCase.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        title: true,
        status: true,
        severity: true,
        updatedDate: true,
      },
    });
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ticket status' });
  }
});

export default router;
