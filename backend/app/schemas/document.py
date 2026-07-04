from pydantic import BaseModel

class DocumentUpload(BaseModel):
    content: str
    filename: str