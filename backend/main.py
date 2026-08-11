"""FastAPI service for the portfolio contact form and grounded AI Agent."""
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, EmailStr, Field, ValidationError
from supabase import Client, create_client
from dotenv import load_dotenv

try:
    # Vercel imports this module from the repository root.
    from backend.ai_agent import stream_gemini
except ModuleNotFoundError:
    # Local development runs `uvicorn main:app` from the backend directory.
    from ai_agent import stream_gemini

load_dotenv()


class ContactMessage(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=30)
    message: str = Field(min_length=10, max_length=5000)


class AgentMessage(BaseModel):
    type: str = Field(default="ai-agent", pattern="^ai-agent$")
    message: str = Field(min_length=1, max_length=2000)


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
    # Vite may choose another local port when 5173 is occupied. Keep those
    # development origins working without opening production to every origin.
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Accept"],
)


@app.get("/api")
@app.get("/api/health")
async def health():
    return {"status": "ok", "database_configured": supabase is not None}


async def save_contact(message: ContactMessage):
    if not supabase:
        raise HTTPException(503, "Contact service is not configured yet.")
    result = supabase.table("contact_messages").insert(message.model_dump()).execute()
    if not result.data:
        raise HTTPException(500, "Unable to save the message.")
    return {"message": "Thanks! Your message was received."}


@app.post("/api/contact", status_code=201)
async def create_contact(message: ContactMessage):
    return await save_contact(message)


def agent_stream(message: str):
    return StreamingResponse(
        stream_gemini(message),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive", "X-Accel-Buffering": "no"},
    )


@app.post("/api/ai-agent")
async def ai_agent(message: AgentMessage):
    return agent_stream(message.message)


@app.post("/api")
async def root_api(request: Request):
    """Keep Vercel's existing /api function compatible with contact and agent requests."""
    try:
        body = await request.json()
        if body.get("type") == "ai-agent":
            return agent_stream(AgentMessage.model_validate(body).message)
        return await save_contact(ContactMessage.model_validate(body))
    except ValidationError as exc:
        raise HTTPException(status_code=422, detail=exc.errors()) from exc
