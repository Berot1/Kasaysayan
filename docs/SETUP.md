# Setup Guide

## Prerequisites
- Python 3.10+
- Node.js 20+
- A Supabase project
- A Google Gemini API key
- Tesseract OCR installed on the system

## Backend Setup
1. Change into the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   ```
3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the backend folder with:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   GEMINI_API_KEY=your_gemini_api_key
   ```
5. Start the API server:
   ```bash
   uvicorn app.main:app --reload
   ```

## Frontend Setup
1. Change into the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Database Notes
The current backend expects a Supabase table named `documents` and a remote procedure called `match_documents` for vector similarity search.

## Troubleshooting
- Ensure the Gemini API key begins with `AIza`.
- Confirm Tesseract is installed and available in your PATH.
- Verify CORS is configured for local frontend access.
