# backend/app/core/auth.py
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.database import supabase
from supabase_auth.errors import AuthApiError

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    try:
        user = supabase.auth.get_user(token)
        if not user:
            raise HTTPException(status_code=403, detail="Could not validate credentials")
        return user.user
    except AuthApiError:
        # Explicitly return 401 for expired/invalid tokens
        raise HTTPException(status_code=401, detail="Session expired or invalid")