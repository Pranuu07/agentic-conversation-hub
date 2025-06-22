import google.generativeai as genai
import groq
from datetime import datetime
import uuid
from config import settings
from models import MessageResponse, ModelType, MessageType

class ChatService:
    def __init__(self):
        # Initialize Gemini
        if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your-gemini-api-key":
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.gemini_model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.gemini_model = None
        
        # Initialize Groq with simplified initialization
        if settings.GROQ_API_KEY and settings.GROQ_API_KEY != "your-groq-api-key":
            try:
                self.groq_client = groq.Client(api_key=settings.GROQ_API_KEY)
            except Exception as e:
                print(f"Warning: Could not initialize Groq client: {e}")
                self.groq_client = None
        else:
            self.groq_client = None
    
    async def process_message(self, content: str, model: ModelType, system_prompt: str, document_context: str = None) -> MessageResponse:
        """Process a user message and return AI response"""
        try:
            # Prepare the full prompt with context
            full_prompt = f"System: {system_prompt}\n\n"
            if document_context:
                full_prompt += f"Document Context: {document_context}\n\n"
            full_prompt += f"User: {content}"
            
            if model == ModelType.GEMINI and self.gemini_model:
                response_content = await self._call_gemini(full_prompt)
            elif model == ModelType.GROQ and self.groq_client:
                response_content = await self._call_groq(full_prompt, system_prompt)
            else:
                response_content = f"Model {model.value} is not available. Please check your API keys in the .env file."
            
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
                model="meta-llama/llama-4-scout-17b-16e-instruct",
                temperature=0.7,
                max_tokens=1024
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            raise Exception(f"Groq API error: {str(e)}")
