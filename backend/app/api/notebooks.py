from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.core.database import supabase
from app.core.auth import get_current_user

router = APIRouter()

class NotebookUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    pinned: Optional[bool] = None

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
        update_data = {} # Remove "updated_at": "now()" if you don't want it to jump in recent order
        if data.title is not None: update_data["title"] = data.title
        if data.content is not None: update_data["content"] = data.content
        if data.pinned is not None: update_data["pinned"] = data.pinned # Add this line
        
        response = supabase.table("notebooks").update(update_data).eq("id", notebook_id).eq("user_id", user.id).execute()
        return {"status": "success", "message": "Notebook updated"}
    except Exception as e:
        print(f"DEBUGGING ERROR: {str(e)}") # Useful to see this in your Render logs
        raise HTTPException(status_code=500, detail=str(e))

# 5. Delete a notebook
@router.delete("/notebooks/{notebook_id}")
async def delete_notebook(notebook_id: str, user=Depends(get_current_user)):
    try:
        response = supabase.table("notebooks").delete().eq("id", notebook_id).eq("user_id", user.id).execute()
        return {"status": "success", "message": "Notebook deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))