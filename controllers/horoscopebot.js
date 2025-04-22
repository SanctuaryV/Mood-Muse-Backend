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
    const response = await result.response;
    const text = response.text();

    // แปลงข้อความตอบกลับเป็น JSON
    try {
      // ค้นหาส่วนที่เป็น JSON ในข้อความตอบกลับ
      const jsonMatch = text.match(/\{\s*.*?\s*\}/s);
      if (jsonMatch) {
        const prediction = JSON.parse(jsonMatch[0]);
        return res.status(200).json({
          success: true,
          data: {
            love: prediction.love,
            career: prediction.career,
            health: prediction.health,
            message: prediction.message
          }
        });
      } else {
        try {
          // ลองแปลงทั้งข้อความเป็น JSON
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
        } catch (parseError) {
          console.error('ไม่สามารถแปลงข้อความตอบกลับเป็น JSON ได้:', parseError);
          throw new Error('รูปแบบการตอบกลับไม่ถูกต้อง');
        }
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการแปลงข้อความตอบกลับ:', error);
      throw new Error('ไม่สามารถแปลงข้อความตอบกลับเป็น JSON ได้');
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
