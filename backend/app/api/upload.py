from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from app.services.rag_service import extract_text_from_file, process_and_ingest
from app.core.database import supabase
from app.core.auth import get_current_user

router = APIRouter()

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    archive_id: str = Form("default"),
    user=Depends(get_current_user)
):
    try:
        contents = await file.read()
        text = extract_text_from_file(contents, file.content_type)
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from file.")
            
        # Pass both user.id and archive_id to the ingestion pipeline
        process_and_ingest(text, file.filename, user.id, archive_id)
        
        # Return the text so the frontend can render it immediately
        return {
            "message": f"Successfully processed {file.filename}",
            "filename": file.filename,
            "text": text 
        }
    except Exception as e:
        print(f"UPLOAD ERROR: {str(e)}") # This will print the EXACT reason it failed in your terminal
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