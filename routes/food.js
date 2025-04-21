// routes/food.js
import express from 'express';
import { foods } from '../data/mockData.js';
// ถ้ามี model Food จาก MongoDB หรืออื่น ๆ ให้ import ด้วย
// import Food from '../models/food.js';

const router = express.Router();

// GET /api/food/:mood/:type
router.get('/:mood/:type', (req, res) => {
  try {
    const { mood, type } = req.params;
    const filteredFoods = foods.filter(f => f.mood === mood && f.type === type);
    res.json(filteredFoods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/food
router.post('/', async (req, res) => {
  try {
    // ถ้าไม่มี database model จริง อาจลบส่วนนี้ออกหรือส่งกลับ mock ได้
    const food = new Food(req.body); // ต้องมี model Food
    const savedFood = await food.save();
    res.status(201).json(savedFood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
