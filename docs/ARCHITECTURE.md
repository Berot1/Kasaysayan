# Architecture Overview

## System Purpose
Kasaysayan is an AI-powered research assistant for Philippine historical archives. It ingests historical documents, extracts text, creates searchable embeddings, and answers questions using only the uploaded source material.

## High-Level Components

### 1. Frontend
Location: `frontend/`

- Built with Next.js and React.
- Provides the user experience for landing, workspace, and notebook-style research flows.
- Communicates with the backend through REST APIs.

### 2. Backend API
Location: `backend/app/`

- Built with FastAPI.
- Exposes endpoints for upload, search, and document discovery.
- Coordinates ingestion, retrieval, and generation workflows.

### 3. Document Ingestion Pipeline
Flow:
1. Upload a PDF or image through the API.
2. Extract text from the file.
3. Split content into chunks.
4. Generate embeddings with Google Gemini.
5. Store chunks and metadata in Supabase.

### 4. Retrieval and Generation
- User questions are converted into embeddings.
- Similar documents are retrieved using Supabase vector similarity.
- The retrieved context is passed to Gemini to generate a grounded answer.

## Data Model
The application currently relies on a `documents` table with at least the following conceptual fields:
- `content`: chunked document text
- `embedding`: vector representation
- `metadata`: source filename and related metadata

## External Services
- Supabase: host for document metadata and vector search support
- Google Gemini: embedding generation and answer generation
- PyMuPDF and Tesseract: PDF and image text extraction

## Request Flow
```text
User -> Frontend -> FastAPI -> Supabase / Gemini -> Response
```

## Design Principles
- Source-grounded answers only
- Verifiable historical context
- Minimal user friction
- Extensible RAG pipeline
