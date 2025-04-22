// controllers/horoscopebot.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getHoroscope = async (req, res) => {
  try {
    const { mood, zodiac } = req.body;

    if (!mood || !zodiac) {
      return res.status(400).json({ success: false, error: 'Missing required data: mood or zodiac' });
    }

    const prompt = `
วันนี้ฉันรู้สึก "${mood.label}" และฉันเกิดราศี "${zodiac.name}"
กรุณาทำนายดวงวันนี้ให้หน่อยค่ะ โดยให้คำทำนายออกมาในโทนภาษาไทยที่อ่อนโยน น่ารัก และเป็นกำลังใจ

กรุณาแสดงผลในรูปแบบ JSON ดังนี้:
{
  "love": "คำทำนายเกี่ยวกับความรัก",
  "career": "คำทำนายเกี่ยวกับการงาน",
  "health": "คำทำนายเกี่ยวกับสุขภาพ",
  "message": "ข้อความให้กำลังใจโดยรวม"
}

กรุณาส่งผลลัพธ์กลับมาเป็น JSON เพียว ๆ โดยไม่ต้องใส่เครื่องหมาย \`\`\` 😊`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text();

    if (!text) {
      return res.status(500).json({ success: false, error: 'No response text from Gemini API' });
    }

    // ล้าง code block markdown (เช่น ```json ... ```)
    text = text.replace(/^```json\s*([\s\S]*?)\s*```$/, '$1').trim();

    try {
      const prediction = JSON.parse(text);

      return res.status(200).json({
        success: true,
        data: {
          love: prediction.love,
          career: prediction.career,
          health: prediction.health,
          message: prediction.message
        }
      });
    } catch (error) {
      console.error("❌ JSON parse error:", error, "\n🔍 Gemini response:", text);
      return res.status(500).json({ success: false, error: 'Invalid response format from Gemini' });
    }

  } catch (error) {
    console.error("❌ Gemini API error:", error);
    return res.status(500).json({
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
};
