import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

# Look for .env in the backend folder (two levels up from app/core)
env_path = Path(__file__).resolve().parents[2] / '.env'
load_dotenv(dotenv_path=env_path)

# Initialize Supabase
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    raise ValueError("Supabase credentials not found in .env file.")

supabase: Client = create_client(supabase_url, supabase_key)