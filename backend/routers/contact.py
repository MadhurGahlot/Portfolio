# backend/routers/contact.py
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from data import CONTACT_MESSAGES

router = APIRouter(prefix="/api", tags=["contact"])

class ContactSchema(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=150)
    service: str = Field("General Inquiry", max_length=100)
    budget: str = Field("Flexible", max_length=50)
    message: str = Field(..., min_length=10, max_length=2000)

@router.post("/contact", status_code=status.HTTP_201_CREATED)
def submit_contact_form(data: ContactSchema):
    submission = {
        "id": len(CONTACT_MESSAGES) + 1,
        "name": data.name,
        "email": data.email,
        "service": data.service,
        "budget": data.budget,
        "message": data.message,
        "timestamp": datetime.utcnow().isoformat()
    }
    CONTACT_MESSAGES.append(submission)
    return {
        "success": True,
        "message": f"Thank you, {data.name}. Your message has been received. Pia Quinn will get back to you shortly.",
        "data": submission
    }

@router.get("/contact/messages")
def get_contact_messages():
    return CONTACT_MESSAGES
