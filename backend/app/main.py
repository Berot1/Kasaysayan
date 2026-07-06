from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.ingest import router as ingest_router
from app.api.search import router as search_router 
from app.api.upload import router as upload_router
from app.api.notebooks import router as notebooks_router

app = FastAPI(title="Kasaysayan API")

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",   # Next.js local development
        "http://127.0.0.1:3000",   # Next.js alternative local IP
        "https://kasaysayan-archive.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],           # Allows all standard methods (GET, POST, etc.)
    allow_headers=["*"],           # Allows all standard headers
)

app.include_router(ingest_router, prefix="/api")
app.include_router(search_router, prefix="/api") 
app.include_router(upload_router, prefix="/api")
app.include_router(notebooks_router, prefix="/api")

@app.api_route("/", methods=["GET", "HEAD"])
async def root():
    return {"message": "Kasaysayan API is online and CORS is configured."}