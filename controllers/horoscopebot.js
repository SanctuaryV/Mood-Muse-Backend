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
      throw new Error('Missing prompt in request body');
    }

    // เรียกใช้งานโมเดล Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // ส่ง prompt ไปที่ Gemini
    const result = await model.generateContent(prompt);

    // ดึงข้อความจาก response
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('No response text from Gemini API');
    }

    // แยกข้อความตามหัวข้อ
    const sections = {
      love: extractSection(text, 'ความรัก'),
      career: extractSection(text, 'การงาน'),
      health: extractSection(text, 'สุขภาพ'),
      message: extractSection(text, 'ข้อความรวม')
    };

    return sections;

  } catch (error) {
    console.error("❌ Gemini API error:", error);
    throw error;
  }
};

// ฟังก์ชันช่วยแยกแต่ละหัวข้อจากข้อความทำนาย
const extractSection = (text, title) => {

  // ปรับ regex ให้รองรับรูปแบบต่างๆ ของ Gemini
  const patterns = [
    // รูปแบบที่มี emoji และขึ้นบรรทัดใหม่
    new RegExp(`${title}\\s*[💖💼🍎💌]?\\s*\\n([\\s\\S]*?)(?=\\n\\*\\*|\\n$|$)`),
    // รูปแบบที่มีเครื่องหมายดอกจัน
    new RegExp(`\\*\\*${title}\\*\\*\\s*[💖💼🍎💌]?\\s*\\n([\\s\\S]*?)(?=\\n\\*\\*|\\n$|$)`),
    // รูปแบบที่มีเครื่องหมายทวิภาค
    new RegExp(`${title}\\s*[:：]\\s*([\\s\\S]*?)(?=\\n\\*\\*|\\n$|$)`),
    // รูปแบบทั่วไป
    new RegExp(`${title}\\s*\\n([\\s\\S]*?)(?=\\n\\*\\*|\\n$|$)`)
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const content = match[1].trim();
      return content;
    }
  }

  console.log(`❌ No match found for ${title}`);
  return 'ไม่พบคำทำนายจ้า';
};
