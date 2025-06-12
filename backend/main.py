
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uuid
import os
from datetime import datetime
from typing import List

from config import settings
from models import *
from services.chat_service import ChatService
from services.document_service import DocumentService
from services.history_service import HistoryService
from services.model_router import ModelRouter
from services.prompt_service import PromptService

app = FastAPI(title="Agentic Chatbot API", version="1.0.0")

# Add CORS middleware for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
chat_service = ChatService()
document_service = DocumentService()
history_service = HistoryService()
prompt_service = PromptService()

@app.get("/")
async def root():
    return {"message": "Agentic Chatbot API", "version": "1.0.0", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}

# Chat endpoints
@app.post("/api/chat/message", response_model=MessageResponse)
async def send_message(request: MessageRequest):
    """Send a message and get AI response"""
    try:
        # Get document context if available
        document_context = None
        if request.document_context:
            document_context = await document_service.query_document(
                request.session_id, 
                request.content
            )
        
        # Process message with AI
        bot_response = await chat_service.process_message(
            content=request.content,
            model=request.model,
            system_prompt=request.system_prompt,
            document_context=document_context
        )
        
        # Save user message
        user_message = MessageResponse(
            id=str(uuid.uuid4()),
            content=request.content,
            type=MessageType.USER,
            timestamp=datetime.now()
        )
        
        await history_service.add_message(request.session_id, user_message)
        await history_service.add_message(request.session_id, bot_response)
        
        return bot_response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Session endpoints
@app.post("/api/sessions", response_model=ChatSession)
async def create_session(request: SessionCreateRequest):
    """Create a new chat session"""
    try:
        session = await history_service.create_session(request)
        return session
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/sessions", response_model=List[ChatSession])
async def get_sessions():
    """Get all chat sessions"""
    try:
        sessions = await history_service.get_sessions()
        return sessions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/sessions/{session_id}", response_model=ChatSession)
async def get_session(session_id: str):
    """Get a specific chat session"""
    try:
        session = await history_service.get_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        return session
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/sessions/{session_id}")
async def delete_session(session_id: str):
    """Delete a chat session"""
    try:
        deleted = await history_service.delete_session(session_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Cleanup document service
        document_service.cleanup_session(session_id)
        
        return {"message": "Session deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Document endpoints
@app.post("/api/documents/upload", response_model=DocumentUploadResponse)
async def upload_document(session_id: str, file: UploadFile = File(...)):
    """Upload and process a document"""
    try:
        # Validate file
        if file.size > settings.MAX_FILE_SIZE:
            raise HTTPException(status_code=413, detail="File too large")
        
        file_extension = os.path.splitext(file.filename)[1].lower()
        if file_extension not in settings.ALLOWED_FILE_TYPES:
            raise HTTPException(status_code=400, detail="File type not allowed")
        
        # Read file content
        content = await file.read()
        
        # Process document
        result = await document_service.process_document(content, file.filename, session_id)
        
        if result.processed:
            # Update session with document info
            document_info = {
                "name": file.filename,
                "uploaded_at": datetime.now(),
                "size": file.size
            }
            await history_service.update_session_document(session_id, document_info)
        
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/documents/analyze")
async def analyze_document(request: DocumentAnalysisRequest):
    """Analyze document content with a specific question"""
    try:
        return {
            "analysis": f"Analysis of the document regarding: {request.question}",
            "model_used": request.model.value
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Model endpoints
@app.get("/api/models")
async def get_models():
    """Get available AI models"""
    return ModelRouter.get_available_models()

@app.get("/api/models/{model_id}")
async def get_model_info(model_id: str):
    """Get information about a specific model"""
    model_info = ModelRouter.get_model_info(model_id)
    if not model_info:
        raise HTTPException(status_code=404, detail="Model not found")
    return model_info

# Prompt endpoints
@app.get("/api/prompts/templates")
async def get_prompt_templates():
    """Get available prompt templates"""
    return prompt_service.get_prompt_templates()

@app.get("/api/prompts/templates/{template_name}")
async def get_prompt_template(template_name: str):
    """Get a specific prompt template"""
    template = prompt_service.get_template(template_name)
    return {"template": template}

@app.post("/api/prompts/validate")
async def validate_prompt(prompt: dict):
    """Validate a system prompt"""
    return prompt_service.validate_prompt(prompt.get("prompt", ""))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
