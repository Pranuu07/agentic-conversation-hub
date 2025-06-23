
import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # API Keys
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "your-gemini-api-key")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "your-groq-api-key")
    
    # MongoDB Configuration - Production Ready
    MONGODB_URL = os.getenv("MONGODB_URL", "mongodb+srv://pranathisubrahmanyam07:6Klm0Nlg90cg3pdg@cluster0.cacx9au.mongodb.net/")
    DATABASE_NAME = os.getenv("DATABASE_NAME", "agentic_chatbot")
    
    # CORS Settings - Production & Development
    ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8080",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8080",
        "https://agentic-conversation-hub.vercel.app",
        "https://agentic-conversation-hub.netlify.app",
        "https://agentic-conversation-hub.onrender.com",
        "https://chatbot-frontend.vercel.app",
        "https://chatbot-frontend.netlify.app",
        "https://chatbot-frontend.onrender.com",
        "https://*.vercel.app",
        "https://*.netlify.app",
        "https://*.onrender.com",
        "*"  # For development - remove in production
    ]
    
    # File Upload Settings
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    ALLOWED_FILE_TYPES = [".pdf", ".txt", ".docx"]
    
    # Development Settings
    DEBUG = os.getenv("DEBUG", "True").lower() == "true"
    
    # Production Settings
    PORT = int(os.getenv("PORT", 8000))
    HOST = os.getenv("HOST", "0.0.0.0")

settings = Settings()
