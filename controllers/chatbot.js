import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getChatResponse = async (message) => {
  try {
    const prompt = `คุณเป็นผู้ช่วยด้านสุขภาพจิต ชื่อ Mood Muse 
    คุณควรตอบสนองด้วยความเข้าใจและเห็นอกเห็นใจ
    ข้อความของผู้ใช้: ${message}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt
    });
    
    return response.text || 'ขออภัย ไม่สามารถสร้างคำตอบได้ในขณะนี้';
  } catch (error) {
    console.error('Error in chatbot:', error);
    return 'ขออภัย เกิดข้อผิดพลาดในการประมวลผล กรุณาลองใหม่อีกครั้ง';
  }
};
