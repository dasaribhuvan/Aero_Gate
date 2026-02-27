from sqlalchemy import Column, Integer, String, Float, Date, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from database import Base
from datetime import datetime

class Member(Base):
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150))
    passport = Column(String(50), unique=True, nullable=False)
    expiry = Column(Date, nullable=False)
    embedding = Column(JSONB, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Log(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    passport = Column(String(50))
    timestamp = Column(DateTime, default=datetime.utcnow)
    status = Column(String(30))
    confidence = Column(Float)