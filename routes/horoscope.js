// routes/horoscope.js
import express from 'express';
import { getHoroscope } from '../controllers/horoscopebot.js';

const router = express.Router();

router.post('/', getHoroscope); // ✅ ไม่ต้อง async ไม่ต้อง res.json

export default router;
