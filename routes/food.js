import express from 'express'
import { getFoodRecommendations } from '../controllers/foodbot.js'

const router = express.Router()

// เส้นทางสำหรับรับคำแนะนำอาหาร
router.get('/:mood/:cuisine', async (req, res) => {
  try {
    const { mood, cuisine } = req.params
    console.log(`รับคำขอสำหรับ mood: ${mood}, cuisine: ${cuisine}`)

    // ตรวจสอบว่าต้องการใช้ข้อมูลจำลองหรือไม่
    const useMockData = req.query.mock === 'true'

    let foodData

    if (useMockData) {
      // ใช้ข้อมูลจำลองเดิม
      foodData = foods.filter(f => f.mood === mood && f.type === cuisine)

      // ถ้าไม่มีข้อมูลในข้อมูลจำลอง ให้ตอบกลับว่าไม่พบข้อมูล
      if (foodData.length === 0) {
        return res
          .status(404)
          .json({ message: 'ไม่พบอาหารที่ตรงกับอารมณ์และประเภทที่ระบุ' })
      }
    } else {
      // ใช้ Gemini API จาก foodbot.js
      try {
        foodData = await getFoodRecommendations(mood, cuisine)

        // ตรวจสอบว่า foodData เป็น Array หรือไม่
        if (!Array.isArray(foodData)) {
          // ถ้าไม่ใช่ Array ให้แปลงเป็น Array
          foodData = [foodData]
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการเรียกใช้ Gemini API:', error)
        // ถ้า Gemini API ล้มเหลว ลองใช้ข้อมูลจำลองแทน
        foodData = foods.filter(f => f.mood === mood && f.type === cuisine)

        // ถ้าใช้ข้อมูลจำลองแล้วยังไม่มีข้อมูล ให้ตอบกลับว่าไม่พบข้อมูล
        if (foodData.length === 0) {
          return res
            .status(404)
            .json({ message: 'ไม่พบอาหารที่ตรงกับอารมณ์และประเภทที่ระบุ' })
        }
      }
    }

    // ตรวจสอบและแสดงข้อมูลเพื่อการ debug
    console.log('ส่งข้อมูลกลับ:', JSON.stringify(foodData))
    console.log('ข้อมูลที่จะส่งกลับ:', foodData)
    console.log('ประเภทข้อมูล:', typeof foodData)

    // เพิ่มบรรทัดนี้เพื่อกำหนด content-type เป็น application/json อย่างชัดเจน
    res.setHeader('Content-Type', 'application/json')
    res.json(foodData)
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลอาหาร:', error)
    res.status(500).json({ message: error.message })
  }
})

// Create new food item (ถ้ามีการใช้ฐานข้อมูล)
router.post('/', async (req, res) => {
  try {
    const food = new Food(req.body) // <-- ต้องแน่ใจว่ามีการ import Food model
    const savedFood = await food.save()
    res.status(201).json(savedFood)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

export default router
