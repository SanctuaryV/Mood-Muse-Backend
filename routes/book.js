import express from 'express';
import { books } from '../data/mockData.js';

const router = express.Router();

// Get books by mood and genre
router.get('/:mood/:genre', (req, res) => {
  try {
    const { mood, genre } = req.params;
    const filteredBooks = books.filter(b => b.mood === mood && b.genre === genre);
    res.json(filteredBooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new book (assuming you're using Mongoose or similar ORM)
router.post('/', async (req, res) => {
  try {
    const book = new Book(req.body); // <-- make sure Book model is imported
    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
