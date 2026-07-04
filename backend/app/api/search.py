from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict
from app.services.rag_service import get_embedding, search_documents, generate_ai_answer

router = APIRouter()

class SearchQuery(BaseModel):
    query: str
    top_k: int = 3
    filter: Optional[Dict] = {}

@router.post("/search")
async def search(data: SearchQuery):
    try:
        # 1. Convert question to vector
        query_vector = get_embedding(data.query)
        
        # 2. Search database
        results = search_documents(
            query_vector, 
            top_k=data.top_k, 
            filter_dict=data.filter
        )
        
        # 3. Generate the conversational answer using the results!
        ai_answer = generate_ai_answer(data.query, results)
        
        # 4. Return everything to the frontend
        return {
            "status": "success", 
            "answer": ai_answer,
            "results": results
        }
    except Exception as e:
        # Print to terminal so you can see it
        print(f"DEBUGGING ERROR: {str(e)}") 
        raise HTTPException(status_code=500, detail=str(e))
        # Re-raise the error so the API responds with 500