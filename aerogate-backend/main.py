from fastapi import FastAPI, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
import datetime
import numpy as np

from database import SessionLocal, engine
from models import Base, Member, Log
from recognition.enroll import generate_embedding
from recognition.matcher import compare_embeddings

app = FastAPI()

# Create tables automatically
Base.metadata.create_all(bind=engine)

# -------------------------
# CORS
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

THRESHOLD = 0.60


# -------------------------
# DB SESSION
# -------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------------
# UNIVERSAL DATE PARSER
# -------------------------
def parse_expiry_date(expiry_str: str):
    """
    Accepts:
    - YYYY-MM-DD
    - DD-MM-YYYY
    - MM/DD/YYYY
    - YYYY/MM/DD
    """
    formats = [
        "%Y-%m-%d",
        "%d-%m-%Y",
        "%m/%d/%Y",
        "%Y/%m/%d",
    ]

    for fmt in formats:
        try:
            return datetime.datetime.strptime(expiry_str, fmt).date()
        except ValueError:
            continue

    return None


# -------------------------
# REGISTER MEMBER
# -------------------------
from sqlalchemy.exc import IntegrityError

@app.post("/api/register")
async def register(
    name: str = Form(...),
    email: str = Form(...),
    passport: str = Form(...),
    expiry: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    print("Register endpoint called")
    print("Incoming data:", name, email, passport, expiry)

    contents = await file.read()
    embedding = generate_embedding(contents)

    if embedding is None:
        print("No face detected")
        return {"status": "FAILED", "reason": "No face detected"}

    expiry_date = parse_expiry_date(expiry)

    if not expiry_date:
        print("Invalid date format")
        return {
            "status": "FAILED",
            "reason": "Invalid expiry date format"
        }

    if expiry_date < datetime.date.today():
        print("Membership already expired")
        return {
            "status": "FAILED",
            "reason": "Membership already expired"
        }

    new_member = Member(
        name=name,
        email=email,
        passport=passport,
        expiry=expiry_date,
        embedding=embedding.tolist()
    )

    try:
        db.add(new_member)
        db.commit()
        db.refresh(new_member)   # ensures object gets ID from DB
        print("Member saved successfully with ID:", new_member.id)

    except IntegrityError as e:
        db.rollback()
        print("Duplicate passport detected:", e)
        return {
            "status": "FAILED",
            "reason": "Passport already registered"
        }

    except Exception as e:
        db.rollback()
        print("Unexpected DB error:", e)
        return {
            "status": "FAILED",
            "reason": "Database error occurred"
        }

    return {
        "status": "SUCCESS",
        "member_id": new_member.id
    }

# -------------------------
# VERIFY FACE
# -------------------------
@app.post("/api/verify")
async def verify(file: UploadFile = File(...), db: Session = Depends(get_db)):
    contents = await file.read()
    embedding = generate_embedding(contents)

    if embedding is None:
        return {"status": "ACCESS DENIED", "reason": "No face detected"}

    members = db.query(Member).all()

    if not members:
        return {"status": "ACCESS DENIED", "reason": "No members registered"}

    best_member = None
    best_score = 0

    for member in members:
        stored_embedding = np.array(member.embedding)
        score = compare_embeddings(embedding, stored_embedding)

        if score > best_score:
            best_score = score
            best_member = member

    today = datetime.date.today()

    access_granted = (
        best_member
        and best_score >= THRESHOLD
        and best_member.expiry >= today
    )

    status = "ACCESS GRANTED" if access_granted else "ACCESS DENIED"

    # Save log
    log_entry = Log(
        name=best_member.name if best_member else "UNKNOWN",
        passport=best_member.passport if best_member else None,
        status=status,
        confidence=float(best_score * 100)
    )

    db.add(log_entry)
    db.commit()

    return {
        "status": status,
        "name": best_member.name if best_member else "UNKNOWN",
        "confidence": round(best_score * 100, 2)
    }


# -------------------------
# GET LOGS (React LogsPage)
# -------------------------
@app.get("/api/logs")
def get_logs(db: Session = Depends(get_db)):
    logs = db.query(Log).order_by(Log.id.desc()).all()

    return [
        {
            "id": f"LG-{log.id:04}",
            "name": log.name,
            "timestamp": log.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "status": log.status.lower(),
            "terminal": "LNG-04",
            "confidence": log.confidence
        }
        for log in logs
    ]