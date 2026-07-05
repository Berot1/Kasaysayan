from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict
from app.services.rag_service import get_embedding, search_documents, generate_ai_answer
from app.core.auth import get_current_user

router = APIRouter()

class SearchQuery(BaseModel):
    query: str
    top_k: int = 3
    filter: Optional[Dict] = {}

@router.post("/search")
async def search(data: SearchQuery, user=Depends(get_current_user)):
    try:
        query_vector = get_embedding(data.query)
        
        # Pass the user.id to search_documents
        results = search_documents(
            query_vector, 
            user.id, 
            top_k=data.top_k, 
            filter_dict=data.filter
        )
        
        ai_answer = generate_ai_answer(data.query, results)
        
        return {
            "status": "success", 
            "answer": ai_answer,
            "results": results
        }
    except Exception as e:
        print(f"DEBUGGING ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))