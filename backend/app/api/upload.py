from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.rag_service import extract_text_from_file, process_and_ingest
from app.core.database import supabase

router = APIRouter()

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        text = extract_text_from_file(contents, file.content_type)
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from file.")
            
        process_and_ingest(text, file.filename)
        return {"message": f"Successfully processed {file.filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# NEW: Endpoint to fetch already uploaded documents from Supabase
@router.get("/documents")
async def get_documents():
    try:
        # Fetch all metadata from the documents table
        response = supabase.table("documents").select("metadata").execute()
        
        # Extract unique filenames using a Python set
        unique_files = set()
        for row in response.data:
            if 'metadata' in row and 'filename' in row['metadata']:
                unique_files.add(row['metadata']['filename'])
        
        # Format for the React frontend
        return [{"name": filename, "status": "ready"} for filename in unique_files]
    except Exception as e:
        print(f"Error fetching documents: {e}")
        return []