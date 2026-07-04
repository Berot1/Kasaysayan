# Kasaysayan

## Project Name
Kasaysayan

## Summary
Kasaysayan is an AI-powered research assistant specialized in analyzing and synthesizing Philippine historical archives using Retrieval-Augmented Generation (RAG).

## Project Description
Kasaysayan is an enterprise-grade AI application designed to help researchers, students, and historians explore Philippine history. Built with a modern technology stack that includes Next.js, FastAPI, and Google Gemini, the platform allows users to upload historical documents, archives, and images to create a personalized knowledge base.

By leveraging RAG, Kasaysayan ensures that all AI-generated responses are grounded strictly in the provided sources, offering verifiable citations and reducing hallucinations. The application features an academic, minimalist interface inspired by research-oriented study tools.

## Goals
- Enable source-grounded exploration of Philippine historical materials
- Support researchers, historians, and students with trustworthy AI assistance
- Facilitate the upload and indexing of documents, images, and archival content
- Provide transparent, citation-aware answers based on user-supplied sources

## System Architecture
Kasaysayan follows a modular architecture with three core layers:

1. Frontend
   - Built with Next.js and React
   - Provides the primary user interface for workspace and research interactions

2. Backend API
   - Built with FastAPI
   - Exposes endpoints for document upload, search, and retrieval

3. Intelligence Layer
   - Uses Google Gemini for embeddings and answer generation
   - Uses Supabase for vector search and document storage

## Key Features
- Upload and process PDF and image-based historical documents
- Extract text from uploaded files
- Split content into semantic chunks for retrieval
- Generate embeddings for similarity search
- Answer questions using only retrieved source material
- Provide a research-oriented interface for archival exploration

## Technology Stack
- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: FastAPI, Python
- AI: Google Gemini, LangChain, Google Generative AI
- Storage and Search: Supabase
- Document Processing: PyMuPDF, Pillow, Tesseract

## Repository Structure
```text
backend/           # FastAPI application and ingestion pipeline
frontend/          # Next.js interface and user experience
docs/              # Engineering and implementation documentation
```

## Development Setup
### Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Overview
The backend currently provides:
- POST /api/upload for document ingestion
- POST /api/search for grounded question answering
- GET /api/documents for retrieving uploaded document names

## Documentation
Additional documentation is available in:
- docs/ARCHITECTURE.md
- docs/API.md
- docs/SETUP.md

## Engineering Notes
Kasaysayan is designed to prioritize trust, traceability, and academic rigor. The current implementation uses a Retrieval-Augmented Generation workflow so that responses remain grounded in the user-provided archive rather than relying on external knowledge alone.

## Future Enhancements
- Citation-aware UI with page-level references
- Multi-document comparison tools
- Improved OCR quality for historical scans
- User authentication and project-based workspaces
- Administrative review and dataset management
