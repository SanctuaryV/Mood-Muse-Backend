// routes/horoscope.js
import express from 'express';
import { getHoroscope } from '../controllers/horoscopebot.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const result = await getHoroscope(req, res);
    if (result) {
      res.json({
        success: true,
        data: {
          love: result.love,
          career: result.career,
          health: result.health,
          message: result.message
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'เกิดข้อผิดพลาดในการทำนายดวง',
      data: {
        love: 'ไม่สามารถโหลดคำทำนายความรักได้',
        career: 'ไม่สามารถโหลดคำทำนายการงานได้',
        health: 'ไม่สามารถโหลดคำทำนายสุขภาพได้',
        message: 'ขอโทษค่ะ ดวงยังไม่มา ลองใหม่อีกครั้งนะคะ 😊'
      }
    });
  }
});

export default router;
