# backend/app/core/auth.py
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.database import supabase

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    # Validate the JWT directly with Supabase
    user = supabase.auth.get_user(token)
    
    if not user:
        raise HTTPException(status_code=403, detail="Could not validate credentials")
    
    return user.user # Returns the user object