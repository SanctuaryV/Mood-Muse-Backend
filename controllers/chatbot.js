import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getChatResponse = async (message) => {
  try {
    const prompt = `คุณคือ Mood Muse ผู้ช่วยด้านสุขภาพจิต  
    บทบาทของคุณคือการรับฟังและเป็นที่ปรึกษาสำหรับผู้ใช้งานที่มีความกังวลหรือความขังใจ 
    ข้อความจากผู้ใช้: ${message}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    return response.text || "ขออภัย ไม่สามารถสร้างคำตอบได้ในขณะนี้";
  } catch (error) {
    console.error("Error in chatbot:", error);
    return "ขออภัย เกิดข้อผิดพลาดในการประมวลผล กรุณาลองใหม่อีกครั้ง";
  }
};
