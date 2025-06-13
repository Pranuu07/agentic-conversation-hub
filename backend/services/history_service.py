
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from typing import List, Optional
import uuid
from config import settings
from models import ChatSession, MessageResponse, SessionCreateRequest

class HistoryService:
    def __init__(self):
        self.client = AsyncIOMotorClient(settings.MONGODB_URL)
        self.db = self.client[settings.DATABASE_NAME]
        self.sessions_collection = self.db.chat_sessions
    
    async def create_session(self, session_request: SessionCreateRequest) -> ChatSession:
        """Create a new chat session"""
        session = ChatSession(
            id=str(uuid.uuid4()),
            title=session_request.title,
            messages=[],
            system_prompt=session_request.system_prompt,
            model=session_request.model.value,
            created_at=datetime.now()
        )
        
        await self.sessions_collection.insert_one(session.dict())
        return session
    
    async def get_sessions(self) -> List[ChatSession]:
        """Get all chat sessions"""
        sessions = []
        async for session in self.sessions_collection.find().sort("created_at", -1):
            sessions.append(ChatSession(**session))
        return sessions
    
    async def get_session(self, session_id: str) -> Optional[ChatSession]:
        """Get a specific chat session"""
        session = await self.sessions_collection.find_one({"id": session_id})
        if session:
            return ChatSession(**session)
        return None
    
    async def add_message(self, session_id: str, message: MessageResponse):
        """Add a message to a session"""
        await self.sessions_collection.update_one(
            {"id": session_id},
            {"$push": {"messages": message.dict()}}
        )
    
    async def update_session_document(self, session_id: str, document_info: dict):
        """Update session with document information"""
        await self.sessions_collection.update_one(
            {"id": session_id},
            {"$set": {"document": document_info}}
        )
    
    async def delete_session(self, session_id: str) -> bool:
        """Delete a chat session"""
        result = await self.sessions_collection.delete_one({"id": session_id})
        return result.deleted_count > 0
