import time
from fastapi import APIRouter, HTTPException
from app.schemas.document import DocumentUpload
from app.services.rag_service import process_and_chunk, get_embedding
from app.core.database import supabase

router = APIRouter()

@router.post("/ingest")
async def ingest_document(doc: DocumentUpload):
    try:
        chunks = process_and_chunk(doc.content)
        processed_count = 0
        
        for chunk in chunks:
            vector = get_embedding(chunk)
            
            # Insert into Supabase
            supabase.table("documents").insert({
                "content": chunk,
                "embedding": vector,
                "metadata": {"filename": doc.filename}
            }).execute()
            
            processed_count += 1
            
            # THROTTLING FOR FREE TIER: 
            # Pause for 21 seconds between requests to stay under 3 Requests Per Minute
            if processed_count < len(chunks):
                print(f"Chunk {processed_count} saved. Sleeping for 21s to respect rate limits...")
                time.sleep(21) 
                
        return {"status": "success", "message": f"Processed {processed_count} chunks from {doc.filename}."}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))