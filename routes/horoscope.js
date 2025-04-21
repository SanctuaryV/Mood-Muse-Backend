// routes/horoscope.js
import express from 'express';
import { horoscopes } from '../data/mockData.js';
// ถ้าใช้ database จริงให้ import model ด้วย
// import Horoscope from '../models/horoscope.js';

const router = express.Router();

// GET /api/horoscope/:mood/:zodiac
router.get('/:mood/:zodiac', (req, res) => {
  try {
    const { mood, zodiac } = req.params;
    const horoscope = horoscopes.find(h => h.mood === mood && h.zodiac === zodiac);

    if (!horoscope) {
      return res.status(404).json({ message: 'Horoscope not found' });
    }

    res.json(horoscope);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/horoscope
router.post('/', async (req, res) => {
  try {
    const horoscope = new Horoscope(req.body); // ต้องมี model Horoscope
    const savedHoroscope = await horoscope.save();
    res.status(201).json(savedHoroscope);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
