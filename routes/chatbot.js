// routes/chatbot.js
import express from 'express';
import { getChatResponse } from '../controllers/chatbot.js';

const router = express.Router();

// POST /api/chatbot/chat
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await getChatResponse(message);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
