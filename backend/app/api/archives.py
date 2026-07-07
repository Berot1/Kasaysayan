from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.core.database import supabase
from app.core.auth import get_current_user

router = APIRouter()

class ArchiveUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    pinned: Optional[bool] = None

# 1. Get all archives for the dashboard
@router.get("/archives")
async def get_archive(user=Depends(get_current_user)):
    try:
        response = supabase.table("archives").select("*").eq("user_id", user.id).order("updated_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 2. Get a specific archive by ID
@router.get("/archives/{archive_id}")
async def get_archive(archive_id: str, user=Depends(get_current_user)):
    try:
        response = supabase.table("archives").select("*").eq("id", archive_id).eq("user_id", user.id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Archive not found")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 3. Create a brand new archive
@router.post("/archives")
async def create_archive(user=Depends(get_current_user)):
    try:
        response = supabase.table("archives").insert({
            "user_id": user.id, 
            "title": "Untitle archive", 
            "content": ""
        }).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 4. Save/Update a archive
@router.put("/archives/{archive_id}")
async def update_archive(archive_id: str, data: ArchiveUpdate, user=Depends(get_current_user)):
    try:
        update_data = {} # Remove "updated_at": "now()" if you don't want it to jump in recent order
        if data.title is not None: update_data["title"] = data.title
        if data.content is not None: update_data["content"] = data.content
        if data.pinned is not None: update_data["pinned"] = data.pinned # Add this line
        
        response = supabase.table("archives").update(update_data).eq("id", archive_id).eq("user_id", user.id).execute()
        return {"status": "success", "message": "Archive updated"}
    except Exception as e:
        print(f"DEBUGGING ERROR: {str(e)}") # Useful to see this in your Render logs
        raise HTTPException(status_code=500, detail=str(e))

# 5. Delete a archive
@router.delete("/archives/{archive_id}")
async def delete_archive(archive_id: str, user=Depends(get_current_user)):
    try:
        response = supabase.table("archives").delete().eq("id", archive_id).eq("user_id", user.id).execute()
        return {"status": "success", "message": "Archive deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#6. Get the document content for a specific archive
@router.get("/archives/{archive_id}/document")
async def get_archive_document(archive_id: str, user=Depends(get_current_user)):
    try:
        # Fetch all chunks associated with this archive
        response = supabase.table("documents").select("content, metadata").eq("archive_id", archive_id).eq("user_id", user.id).execute()
        
        if not response.data:
            return {"text": None, "filename": None}
            
        # Stitch the chunks back together for the frontend viewer
        full_text = "\n\n".join([row["content"] for row in response.data])
        
        # Get the filename from the first chunk's metadata
        filename = response.data[0].get("metadata", {}).get("filename", "Archival Source")
        
        return {"text": full_text, "filename": filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))