import os
import io
import time
import fitz  # PyMuPDF
import pytesseract
from PIL import Image
from langchain_text_splitters import RecursiveCharacterTextSplitter

from langchain_google_genai import GoogleGenerativeAIEmbeddings
import google.generativeai as genai
from app.core.database import supabase

# --- 0. Initialize Google AI Studio ---
api_key = os.environ.get("GEMINI_API_KEY")

if not api_key or not api_key.startswith("AIza"):
    print("WARNING: Please ensure your GEMINI_API_KEY in .env starts with 'AIza' for the Free Tier.")

genai.configure(api_key=api_key)
print("DEBUG: Google AI Studio (Free Tier) Initialized")

# --- 1. Processing & Chunking ---
def process_and_chunk(text: str):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500, 
        chunk_overlap=50, 
        length_function=len
    )
    return text_splitter.split_text(text)

# --- 2. Embeddings & Search ---
def get_embedding(text: str):
    # Used for single queries (searching)
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-001",
        google_api_key=api_key
    )
    return embeddings.embed_query(text)

def get_embeddings_batch(texts: list):
    # NEW: Used for massive file uploads (1 request processes 100 chunks!)
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-001",
        google_api_key=api_key
    )
    return embeddings.embed_documents(texts)

def search_documents(query_vector: list, top_k: int = 3, filter_dict: dict = {}):
    response = supabase.rpc(
        "match_documents",
        {
            "query_embedding": query_vector, 
            "match_threshold": 0.5, 
            "match_count": top_k, 
            "filter": filter_dict
        },
    ).execute()
    return response.data

# --- 3. Generative AI Logic ---
def generate_ai_answer(query: str, retrieved_docs: list):
    if not retrieved_docs:
        return "I couldn't find any relevant historical documents in the database to answer that."
    
    context_text = "\n\n".join([doc["content"] for doc in retrieved_docs])
    model = genai.GenerativeModel("gemini-2.5-flash")
    
    prompt = f"""
    You are Kasaysayan, an elite AI researcher strictly specializing in Philippine History.
    
    YOUR RULES:
    1. You must evaluate the provided Context. Is it related to Philippine History, culture, or historical events? 
    2. If the Context is completely unrelated (e.g., a cookbook, a math textbook, modern pop culture), YOU MUST REFUSE TO ANSWER. Politely state: "The uploaded document does not appear to be related to Philippine History. I am specifically trained to analyze Philippine historical archives."
    3. If the Context IS valid history, answer the user's question using ONLY the provided Context. Do not use outside knowledge.
    4. If the valid Context does not contain the answer, politely state that the information is missing from the uploaded archives.
    
    Context:
    {context_text}
    
    Question: {query}
    """
    response = model.generate_content(prompt)
    return response.text

# --- 4. Automated Ingestion Pipeline ---
def extract_text_from_file(file_bytes: bytes, mime_type: str) -> str:
    text = ""
    if mime_type == "application/pdf":
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        for page in doc:
            text += page.get_text()
    elif mime_type.startswith("image/"):
        image = Image.open(io.BytesIO(file_bytes))
        text = pytesseract.image_to_string(image)
    return text

def process_and_ingest(text: str, filename: str, notebook_id: str):
    print(f"DEBUG: Processing {filename}. Text length: {len(text)}")
    chunks = process_and_chunk(text)
    
    batch_size = 100
    total_chunks = len(chunks)
    
    for i in range(0, total_chunks, batch_size):
        batch = chunks[i:i + batch_size]
        vectors = get_embeddings_batch(batch)
        
        for j, chunk in enumerate(batch):
            supabase.table("documents").insert({
                "content": chunk,
                "embedding": vectors[j],
                "metadata": {"filename": filename, "notebook_id": notebook_id}, # <-- Add here for easy filtering
                "notebook_id": notebook_id # <-- Saves to your dedicated column
            }).execute()
            
        print("Batch saved successfully! Pausing for 10 seconds to respect rate limits...")
        time.sleep(10)