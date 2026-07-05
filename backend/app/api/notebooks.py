from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.core.database import supabase
from app.core.auth import get_current_user

router = APIRouter()

class NotebookUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

# 1. Get all notebooks for the dashboard
@router.get("/notebooks")
async def get_notebooks(user=Depends(get_current_user)):
    try:
        response = supabase.table("notebooks").select("*").eq("user_id", user.id).order("updated_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 2. Get a specific notebook by ID
@router.get("/notebooks/{notebook_id}")
async def get_notebook(notebook_id: str, user=Depends(get_current_user)):
    try:
        response = supabase.table("notebooks").select("*").eq("id", notebook_id).eq("user_id", user.id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Notebook not found")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 3. Create a brand new notebook
@router.post("/notebooks")
async def create_notebook(user=Depends(get_current_user)):
    try:
        response = supabase.table("notebooks").insert({
            "user_id": user.id, 
            "title": "New Historical Analysis", 
            "content": ""
        }).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 4. Save/Update a notebook
@router.put("/notebooks/{notebook_id}")
async def update_notebook(notebook_id: str, data: NotebookUpdate, user=Depends(get_current_user)):
    try:
        update_data = {"updated_at": "now()"}
        if data.title is not None: 
            update_data["title"] = data.title
        if data.content is not None: 
            update_data["content"] = data.content
            
        response = supabase.table("notebooks").update(update_data).eq("id", notebook_id).eq("user_id", user.id).execute()
        return {"status": "success", "message": "Notebook saved"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))