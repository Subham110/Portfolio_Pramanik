# Subham Pramanik — Portfolio

A responsive portfolio built with React, CSS and Vite. The optional contact form is handled by FastAPI and saves enquiries securely in Supabase.

## Tech stack

- Frontend: React, JavaScript, CSS, Vite
- Backend: FastAPI (Python)
- Database: Supabase (PostgreSQL)

## Prerequisites

Install these before starting:

- [Node.js](https://nodejs.org/) 20 or newer
- Python 3.10 or newer
- A Supabase account and project (only required for the contact form)

## 1. Clone or open the project

```powershell
cd C:\Users\subha\Downloads\Portfolio_Pramanik
```

## 2. Install and run the frontend

Install the JavaScript dependencies once:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

Open the URL shown in the terminal, usually `http://localhost:5173`.

To make a production build:

```powershell
npm run build
```

The optimised static files are created in the `dist` folder.

## 3. Set up Supabase for contact messages

This step is needed only if you want messages submitted through **Get in touch** to be saved.

1. Create a new project at [Supabase](https://supabase.com/dashboard/projects).
2. In the project dashboard, open **SQL Editor** and select **New query**.
3. Copy the complete contents of [`supabase/schema.sql`](supabase/schema.sql) into the editor and click **Run**. This creates the `contact_messages` table and enables Row Level Security.
4. In **Project Settings → API**, copy the project URL and the `service_role`/secret API key.

> Keep the `service_role` key private. It is used only by FastAPI and must never be added to a frontend `.env` file or committed to Git.

## 4. Configure environment variables

The repository includes [`.env.example`](.env.example) as a reference. Create two separate `.env` files.

### Frontend `.env`

Create a file named `.env` in the project root:

```env
VITE_API_URL=http://localhost:8000
```

### Backend `backend/.env`

Create a file named `.env` inside the `backend` folder:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
CORS_ORIGINS=http://localhost:5173
```

Replace both Supabase values with the values from your Supabase project.

## 5. Install and run the backend

Open a second PowerShell terminal and run:

```powershell
cd C:\Users\subha\Downloads\Portfolio_Pramanik\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The API runs at `http://localhost:8000`. You can confirm it is configured by opening:

```text
http://localhost:8000/api/health
```

When the response contains `"database_configured": true`, the contact form is connected to Supabase.

## Run the complete app

Keep both terminals running:

1. Backend terminal: `uvicorn main:app --reload --port 8000`
2. Frontend terminal: `npm run dev`

Then open `http://localhost:5173`, complete the contact form and submit it. A new row will appear in the Supabase `contact_messages` table.

## Deployment notes

### Deploy on Vercel

The project contains a Vercel Function at `api/index.py`, so the contact form works on the same deployed domain. You do **not** need to host the FastAPI backend separately for this Vercel setup.

Vercel uses Python 3.13 for the serverless function, pinned in `.python-version`. This avoids an unsupported Python 3.14 dependency build.

1. In Vercel, open your project and go to **Settings → Environment Variables**.
2. Add these variables for **Production** (and Preview if you want contact forms to work in preview deployments):

   ```env
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-secret-key
   CORS_ORIGINS=https://your-portfolio.vercel.app
   ```

3. Save the variables, commit and push this repository, then select **Deployments → Redeploy** in Vercel.

`SUPABASE_SERVICE_ROLE_KEY` must be a Supabase secret key (or legacy service-role key) and must only be set in Vercel's environment variables—never in `VITE_API_URL` or a frontend `.env` file.

The deployed frontend automatically sends requests to `/api/contact`, which Vercel routes to FastAPI. For local development it still uses `http://localhost:8000` by default.
