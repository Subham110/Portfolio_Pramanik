"""Grounded, LangChain-powered Gemini responses for the portfolio AI Agent."""
import json
import os
from pathlib import Path
from typing import AsyncIterator

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI


PROFILE_PATH = Path(__file__).resolve().parents[1] / "AI Agent" / "profile.json"
PROFILE = json.loads(PROFILE_PATH.read_text(encoding="utf-8"))
REFUSAL = (
    "I can only answer questions about Subham Pramanik's profile: his about, "
    "skills, education, experience, projects, contact details, and social links."
)
SYSTEM_PROMPT = f"""
You are Subham Pramanik's portfolio AI Agent. Answer questions only from the profile
context below. You may discuss Subham's about, skills, tools of the trade, education, experience,
client work, projects, contact details, repositories, live projects, and social links. If a question is outside
those topics, reply with exactly this boundary in a friendly way: "{REFUSAL}"

IMPORTANT FORMATTING RULES:
- DO NOT use markdown formatting like **bold**, __italics__, or ## headers
- DO NOT use asterisks (**) or underscores (__)
- Use plain text with emojis from the profile for visual appeal
- Keep answers concise and conversational
- Never invent, infer, or embellish facts
- Do not provide general advice, code, news, opinions, or information about any other person

PROFILE CONTEXT:
{json.dumps(PROFILE, ensure_ascii=False, indent=2)}
""".strip()


def _event(payload: dict) -> str:
    return f"data: {json.dumps(payload, ensure_ascii=False)}\n\n"


async def stream_gemini(message: str) -> AsyncIterator[str]:
    """Stream LangChain's Gemini chunks through the frontend's SSE contract."""
    api_key = os.getenv("GEMINI_API_KEY")
    model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    if not api_key:
        yield _event({"error": "The AI Agent is not configured yet. Add GEMINI_API_KEY to the backend environment."})
        return

    try:
        llm = ChatGoogleGenerativeAI(
            model=model,
            api_key=api_key,
            temperature=0.15,
            max_tokens=500,
            timeout=60,
            max_retries=1,
        )
        messages = [SystemMessage(content=SYSTEM_PROMPT), HumanMessage(content=message)]
        async for chunk in llm.astream(messages):
            # `.text` supports current Gemini content-block responses; `.content`
            # keeps the stream compatible with Gemini 2.5's string responses.
            text = getattr(chunk, "text", None) or getattr(chunk, "content", "")
            if isinstance(text, str) and text:
                yield _event({"text": text})
            elif isinstance(text, list):
                for block in text:
                    if isinstance(block, dict) and block.get("type") == "text" and block.get("text"):
                        yield _event({"text": block["text"]})
    except Exception as exc:
        print(f"LangChain Gemini error: {type(exc).__name__}: {exc}")
        yield _event({"error": "The AI Agent could not connect to Gemini. Please try again."})

    yield _event({"done": True})
