# AI Agent

This folder contains the profile context used by the portfolio's Gemini assistant.

`profile.json` is deliberately limited to Subham Pramanik's public portfolio facts. The FastAPI service loads it into a LangChain `ChatGoogleGenerativeAI` conversation as grounded context. Keep the Gemini API key in the backend environment, never in this folder or in a `VITE_*` variable.
