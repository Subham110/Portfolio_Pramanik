"""FastAPI service for the portfolio contact form."""
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from supabase import Client, create_client
from dotenv import load_dotenv

load_dotenv()


class ContactMessage(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=30)
    message: str = Field(min_length=10, max_length=5000)


supabase: Client | None = None


@asynccontextmanager
async def lifespan(_: FastAPI):
    global supabase
    url, key = os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if url and key:
        supabase = create_client(url, key)
    yield


app = FastAPI(title="Subham Portfolio API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173").split(","),
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)


@app.get("/api")
@app.get("/api/health")
async def health():
    return {"status": "ok", "database_configured": supabase is not None}


@app.post("/api", status_code=201)
@app.post("/api/contact", status_code=201)
async def create_contact(message: ContactMessage):
    if not supabase:
        raise HTTPException(503, "Contact service is not configured yet.")
    result = supabase.table("contact_messages").insert(message.model_dump()).execute()
    if not result.data:
        raise HTTPException(500, "Unable to save the message.")
    return {"message": "Thanks! Your message was received."}
