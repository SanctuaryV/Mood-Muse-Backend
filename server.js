import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import horoscopeRoutes from './routes/horoscope.js';
import bookRoutes from './routes/book.js';
import songRoutes from './routes/song.js';
import foodRoutes from './routes/food.js';
import chatbotRoutes from './routes/chatbot.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/horoscope', horoscopeRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 