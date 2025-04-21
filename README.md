# Mood Muse Backend

Backend service for Mood Muse - แพลตฟอร์มที่จะช่วยให้คุณจัดการอารมณ์และความรู้สึกได้ดีขึ้น

## การติดตั้ง

1. ติดตั้ง dependencies:
```bash
npm install
```

2. สร้างไฟล์ `.env` ในโฟลเดอร์หลักและเพิ่มค่าต่อไปนี้:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

3. รันเซิร์ฟเวอร์:
```bash
npm run dev
```

## API Endpoints

### Chatbot
- **POST** `/api/chatbot/chat`
  - รับข้อความจากผู้ใช้และส่งคำตอบกลับ
  - Body: `{ "message": "ข้อความจากผู้ใช้" }`
  - Response: `{ "response": "คำตอบจาก AI" }`

### Songs/Playlists
- **GET** `/api/songs/:mood/:genre`
  - ดึงรายการเพลย์ลิสต์ตามอารมณ์และประเภทเพลง
  - Parameters:
    - `mood`: อารมณ์ (happy, sad, angry, anxious, tired, relaxed)
    - `genre`: ประเภทเพลง (pop, rock, jazz, classical, hip-hop, electronic)
  - Response: Array of playlist objects

### Horoscope
- **GET** `/api/horoscope/:zodiac`
  - ดึงคำทำนายดวงตามราศี
  - Parameters:
    - `zodiac`: ราศี (aries, taurus, gemini, etc.)
  - Response: Horoscope prediction object

### Books
- **GET** `/api/books/:mood/:genre`
  - ดึงรายการหนังสือแนะนำตามอารมณ์และประเภท
  - Parameters:
    - `mood`: อารมณ์
    - `genre`: ประเภทหนังสือ
  - Response: Array of book objects

## โครงสร้างโปรเจค
```
mental-health-backend/
├── controllers/     # Logic for handling routes
├── models/         # Database models
├── routes/         # API route definitions
├── config/         # Configuration files
├── middleware/     # Custom middleware
└── utils/          # Utility functions
```

## การใช้งาน Database

โปรเจคใช้ MongoDB เป็นฐานข้อมูล โดยมีโมเดลหลักดังนี้:
- User: ข้อมูลผู้ใช้
- Song: ข้อมูลเพลงและเพลย์ลิสต์
- Book: ข้อมูลหนังสือแนะนำ
- Horoscope: ข้อมูลดวงและคำทำนาย

## Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | พอร์ตที่ใช้รันเซิร์ฟเวอร์ |
| MONGODB_URI | Connection string สำหรับ MongoDB |
| OPENAI_API_KEY | API key สำหรับ OpenAI |
| SPOTIFY_CLIENT_ID | Client ID จาก Spotify Developer |
| SPOTIFY_CLIENT_SECRET | Client Secret จาก Spotify Developer |

## การพัฒนาเพิ่มเติม

1. รันเทสต์:
```bash
npm test
```

2. สร้าง production build:
```bash
npm run build
```

## API Error Handling

ระบบจะส่ง error response ในรูปแบบ:
```json
{
  "error": true,
  "message": "รายละเอียดข้อผิดพลาด",
  "status": 400
}
```

## Security

- ใช้ JWT สำหรับการ authentication
- มีการ validate request data
- มีการจำกัด rate limiting
- ใช้ CORS policy

## Contributors

- [Your Name] - Initial work and maintenance
