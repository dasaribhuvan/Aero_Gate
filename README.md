# ✈️ Neon Gate Vision

Neon Gate Vision is an AI-powered biometric access control system that uses facial recognition to grant or deny access based on identity verification and membership validity.

---

## 🚀 Features

- Biometric member registration
- Real-time face verification
- Access decision based on similarity score
- Membership expiry validation
- Live terminal access logs
- PostgreSQL database integration

---

## 🧠 Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS

**Backend**
- FastAPI
- PostgreSQL
- SQLAlchemy
- InsightFace
- OpenCV

---

## 🛠 Run Locally

### Frontend
```bash
npm install
npm run dev
Backend
cd aerogate-backend
pip install -r requirements.txt
uvicorn main:app --reload
🗄 Database

Set environment variable:

DATABASE_URL=postgresql://username:password@localhost:5432/aerogate_db
👨‍💻 Author

Bhuvan Kumar
