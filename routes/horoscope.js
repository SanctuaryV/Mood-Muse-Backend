// routes/horoscope.js
import express from 'express';
import { getHoroscope } from '../controllers/horoscopebot.js';

const router = express.Router();

router.post('/horoscope', getHoroscope);

export default router;
