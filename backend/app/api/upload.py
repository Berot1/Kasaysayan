from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.services.rag_service import extract_text_from_file, process_and_ingest
from app.core.database import supabase
from app.core.auth import get_current_user

router = APIRouter()

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...), 
    user=Depends(get_current_user)
):
    try:
        contents = await file.read()
        text = extract_text_from_file(contents, file.content_type)
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from file.")
            
        # Pass user.id to the ingestion pipeline
        process_and_ingest(text, file.filename, user.id)
        return {"message": f"Successfully processed {file.filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/documents")
async def get_documents(user=Depends(get_current_user)):
    try:
        # Filter documents so users only see their own files
        response = supabase.table("documents").select("metadata").eq("user_id", user.id).execute()
        
        unique_files = set()
        for row in response.data:
            if 'metadata' in row and 'filename' in row['metadata']:
                unique_files.add(row['metadata']['filename'])
                
        return [{"name": filename, "status": "ready"} for filename in unique_files]
    except Exception as e:
        print(f"Error fetching documents: {e}")
        return []