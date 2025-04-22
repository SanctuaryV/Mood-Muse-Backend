import { GoogleGenerativeAI } from '@google/generative-ai'

// เซ็ตอัพ API key
const API_KEY = 'AIzaSyBNB_1W3HqU0Fbnid3PghFAf58DS-orEU8'
const genAI = new GoogleGenerativeAI(API_KEY)

// ฟังก์ชันสำหรับสร้างคำขอไปยัง Gemini
async function getFoodRecommendations (mood, cuisine) {
  try {
    // สร้าง model instance
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

    // สร้างคำขอให้ Gemini แนะนำอาหาร
    const prompt = `แนะนำอาหาร 3 รายการที่เหมาะกับคนที่มีอารมณ์ "${mood}" และชอบอาหารประเภท "${cuisine}"
    
    กรุณาแสดงผลในรูปแบบ JSON ดังนี้:
    [
      {
        "name": "ชื่ออาหาร",
        "restaurant": "ชื่อร้านอาหารที่แนะนำ",
        "description": "คำอธิบายสั้นๆ เกี่ยวกับอาหารจานนี้",
        "rating": "คะแนนความนิยม (เช่น ⭐️⭐️⭐️⭐️⭐️)"
        "keywords": "คำค้นสำหรับค้นหารูปภาพ (เช่น 'pad thai noodle', 'green curry thai')"
      },
      ...
    ]
    
    ให้ตัวอย่างอาหารที่มีอยู่จริงและเหมาะสมกับอารมณ์และประเภทอาหารที่กำหนด โดยเลือกอาหารที่มีรสชาติและคุณสมบัติที่ช่วยส่งเสริมหรือเหมาะกับอารมณ์นั้นๆ เช่น อาหารที่มีรสเผ็ดเพื่อกระตุ้นความรู้สึก หรืออาหารที่มีคาร์โบไฮเดรตสูงเพื่อความสุขและความรู้สึกผ่อนคลาย`
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

export { getFoodRecommendations }