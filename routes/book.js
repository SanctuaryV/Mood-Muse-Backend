import express from 'express'
import { books } from '../data/mockData.js'
import { getBookRecommendations } from '../controllers/bookbot.js'

const router = express.Router()

// เส้นทางสำหรับรับคำแนะนำหนังสือ
router.get('/:mood/:genre', async (req, res) => {
  try {
    const { mood, genre } = req.params
    console.log(`รับคำขอสำหรับ mood: ${mood}, genre: ${genre}`)

    // ตรวจสอบว่าต้องการใช้ข้อมูลจำลองหรือไม่
    const useMockData = req.query.mock === 'true'

    let bookData

    if (useMockData) {
      // ใช้ข้อมูลจำลองเดิม
      bookData = books.filter(b => b.mood === mood && b.genre === genre)

      // ถ้าไม่มีข้อมูลในข้อมูลจำลอง ให้ตอบกลับว่าไม่พบข้อมูล
      if (bookData.length === 0) {
        return res
          .status(404)
          .json({ message: 'ไม่พบหนังสือที่ตรงกับอารมณ์และประเภทที่ระบุ' })
      }
    } else {
      // ใช้ Gemini API จาก bookbot.js
      try {
        bookData = await getBookRecommendations(mood, genre)
        
        // ตรวจสอบว่า bookData เป็น Array หรือไม่
        if (!Array.isArray(bookData)) {
          // ถ้าไม่ใช่ Array ให้แปลงเป็น Array
          bookData = [bookData];
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการเรียกใช้ Gemini API:', error)
        // ถ้า Gemini API ล้มเหลว ลองใช้ข้อมูลจำลองแทน
        bookData = books.filter(b => b.mood === mood && b.genre === genre)

        // ถ้าใช้ข้อมูลจำลองแล้วยังไม่มีข้อมูล ให้ตอบกลับว่าไม่พบข้อมูล
        if (bookData.length === 0) {
          return res
            .status(404)
            .json({ message: 'ไม่พบหนังสือที่ตรงกับอารมณ์และประเภทที่ระบุ' })
        }
      }
    }

    // ตรวจสอบและแสดงข้อมูลเพื่อการ debug
    console.log('ส่งข้อมูลกลับ:', JSON.stringify(bookData))
    console.log('ข้อมูลที่จะส่งกลับ:', bookData)
    console.log('ประเภทข้อมูล:', typeof bookData)

    // เพิ่มบรรทัดนี้เพื่อกำหนด content-type เป็น application/json อย่างชัดเจน
    res.setHeader('Content-Type', 'application/json')
    res.json(bookData)
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือ:', error)
    res.status(500).json({ message: error.message })
  }
})

// Create new book (ส่วนนี้คงเดิม)
router.post('/', async (req, res) => {
  try {
    const book = new Book(req.body) // <-- make sure Book model is imported
    const savedBook = await book.save()
    res.status(201).json(savedBook)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

export default router
