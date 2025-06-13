
import google.generativeai as genai
from groq import Groq
from datetime import datetime
import uuid
from config import settings
from models import MessageResponse, ModelType, MessageType

class ChatService:
    def __init__(self):
        # Initialize Gemini
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.gemini_model = genai.GenerativeModel('gemini-pro')
        
        # Initialize Groq
        self.groq_client = Groq(api_key=settings.GROQ_API_KEY)
    
    async def process_message(self, content: str, model: ModelType, system_prompt: str, document_context: str = None) -> MessageResponse:
        """Process a user message and return AI response"""
        try:
            # Prepare the full prompt with context
            full_prompt = f"System: {system_prompt}\n\n"
            if document_context:
                full_prompt += f"Document Context: {document_context}\n\n"
            full_prompt += f"User: {content}"
            
            if model == ModelType.GEMINI:
                response_content = await self._call_gemini(full_prompt)
            elif model == ModelType.GROQ:
                response_content = await self._call_groq(full_prompt, system_prompt)
            else:
                raise ValueError(f"Unsupported model: {model}")
            
            return MessageResponse(
                id=str(uuid.uuid4()),
                content=response_content,
                type=MessageType.BOT,
                timestamp=datetime.now(),
                model=model.value
            )
        
        except Exception as e:
            return MessageResponse(
                id=str(uuid.uuid4()),
                content=f"Error processing message: {str(e)}",
                type=MessageType.BOT,
                timestamp=datetime.now(),
                model=model.value
            )
    
    async def _call_gemini(self, prompt: str) -> str:
        """Call Gemini API"""
        try:
            response = self.gemini_model.generate_content(prompt)
            return response.text
        except Exception as e:
            raise Exception(f"Gemini API error: {str(e)}")
    
    async def _call_groq(self, prompt: str, system_prompt: str) -> str:
        """Call Groq API"""
        try:
            chat_completion = self.groq_client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                model="mixtral-8x7b-32768",
                temperature=0.7,
                max_tokens=1024
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            raise Exception(f"Groq API error: {str(e)}")
