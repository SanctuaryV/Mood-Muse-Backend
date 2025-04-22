// controllers/horoscopebot.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// โหลดค่า ENV (.env)
dotenv.config();

// สร้าง instance ของ Gemini ด้วย API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getHoroscope = async (req, res) => {
  try {
    const { prompt } = req.body;

    // ตรวจสอบว่า prompt ถูกส่งมาจาก frontend ไหม
    if (!prompt) {
      return res.status(400).json({ message: 'ขาดข้อมูล prompt' });
    }

    console.log("📩 ได้รับ prompt จาก frontend:", prompt);

    // เรียกใช้งานโมเดล Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // ส่ง prompt ไปที่ Gemini
    const result = await model.generateContent(prompt);

    // ดึงข้อความจาก response
    const response = await result.response;
    const text = response.text();

    console.log("✅ คำตอบจาก Gemini:", text);

    // ส่งข้อความกลับไปยัง frontend
    res.json({ response: text });

  } catch (error) {
    console.error("❌ Gemini API error:", error);

    // ส่ง error response กลับไปยัง frontend
    res.status(500).json({
      message: 'เกิดข้อผิดพลาดจาก Gemini API',
      error: error.message
    });
  }
};
