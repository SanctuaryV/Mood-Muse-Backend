import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

// เซ็ตอัพ API key จาก .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// ฟังก์ชันสำหรับสร้างคำขอไปยัง Gemini
async function getBookRecommendations (mood, genre) {
  try {
    // สร้าง model instance
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    // สร้างคำขอให้ Gemini แนะนำหนังสือ
    const prompt = `แนะนำหนังสือ 3 เล่มที่เหมาะกับคนที่มีอารมณ์ "${mood}" และชอบหนังสือประเภท "${genre}"
    
    กรุณาแสดงผลในรูปแบบ JSON ดังนี้:
    [
      {
        "title": "ชื่อหนังสือ",
        "author": "ชื่อผู้แต่ง",
        "description": "คำอธิบายสั้นๆ เกี่ยวกับหนังสือ",
        "rating": "คะแนนความนิยม (เช่น ⭐️⭐️⭐️⭐️⭐️)"
      },
      ...
    ]
    
    ให้ตัวอย่างหนังสือที่มีอยู่จริงและเหมาะสมกับอารมณ์และประเภทที่กำหนด`

    // ส่งคำขอไปยัง Gemini
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // แปลงข้อความตอบกลับเป็น JSON
    try {
      // ค้นหาส่วนที่เป็น JSON ในข้อความตอบกลับ (บางครั้ง Gemini อาจส่งคืนข้อความเพิ่มเติม)
      const jsonMatch = text.match(/\[\s*\{.*?\}\s*\]/s)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      } else {
        try {
          // ลองแปลงทั้งข้อความเป็น JSON
          return JSON.parse(text)
        } catch (parseError) {
          console.error('ไม่สามารถแปลงข้อความตอบกลับเป็น JSON ได้:', parseError)
          throw new Error('รูปแบบการตอบกลับไม่ถูกต้อง')
        }
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการแปลงข้อความตอบกลับ:', error)
      throw new Error('ไม่สามารถแปลงข้อความตอบกลับเป็น JSON ได้')
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการเรียกใช้ Gemini API:', error)
    throw error
  }
}

export { getBookRecommendations }
