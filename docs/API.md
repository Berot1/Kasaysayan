# API Reference

## Overview
The backend exposes a compact REST API for document ingestion and RAG-based search.

## Base URL
When running locally:
- `http://localhost:8000/api`

## Endpoints

### GET /
Health check endpoint.

Response:
```json
{
  "message": "Kasaysayan API is online and CORS is configured."
}
```

### POST /api/upload
Uploads a document for processing and ingestion.

Request:
- Form-data field: `file`

Response:
```json
{
  "message": "Successfully processed example.pdf"
}
```

Supported input types:
- PDF files
- Image files (OCR-based extraction)

### POST /api/search
Searches uploaded knowledge and generates a grounded answer.

Request body:
```json
{
  "query": "What does the archive say about Rizal?",
  "top_k": 3,
  "filter": {}
}
```

Response:
```json
{
  "status": "success",
  "answer": "...",
  "results": []
}
```

### GET /api/documents
Returns the list of uploaded document filenames currently available in the knowledge base.

Response:
```json
[
  {
    "name": "sample.pdf",
    "status": "ready"
  }
]
```

## Notes
- Search results are retrieved from source-grounded chunks stored in Supabase.
- The answer is generated from those retrieved chunks and should be treated as source-bound.
