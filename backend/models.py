
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class ModelType(str, Enum):
    GEMINI = "gemini"
    GROQ = "groq"

class MessageType(str, Enum):
    USER = "user"
    BOT = "bot"

class MessageRequest(BaseModel):
    content: str
    model: ModelType
    system_prompt: str
    session_id: str
    document_context: Optional[str] = None

class MessageResponse(BaseModel):
    id: str
    content: str
    type: MessageType
    timestamp: datetime
    model: Optional[str] = None

class ChatSession(BaseModel):
    id: str
    title: str
    messages: List[MessageResponse]
    system_prompt: str
    model: str
    document: Optional[Dict[str, Any]] = None
    created_at: datetime

class SessionCreateRequest(BaseModel):
    title: str
    system_prompt: str
    model: ModelType

class DocumentUploadResponse(BaseModel):
    filename: str
    content: str
    processed: bool
    message: str

class DocumentAnalysisRequest(BaseModel):
    document_content: str
    question: str
    model: ModelType
