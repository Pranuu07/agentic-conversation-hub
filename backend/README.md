
# Simple Agentic Chatbot Backend

A lightweight FastAPI backend for AI chat with document processing.

## Quick Start

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Set Up Environment
Create `.env` file:
```
GEMINI_API_KEY=your-gemini-api-key-here
GROQ_API_KEY=your-groq-api-key-here
MONGODB_URL=mongodb://localhost:27017
```

**Get API Keys:**
- **Gemini**: [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Groq**: [Groq Console](https://console.groq.com/keys)

### 3. Run Backend
```bash
python run.py
```

Backend runs at: `http://localhost:8000`

## Simple Features

- **Chat with AI**: Gemini Pro and Groq Mixtral models
- **Document Upload**: PDF, DOCX, TXT files
- **Chat History**: MongoDB storage (optional)
- **Simple Setup**: No compilation needed

## API Endpoints

- `POST /api/chat/message` - Send chat message
- `POST /api/sessions` - Create chat session
- `GET /api/sessions` - Get all sessions
- `POST /api/documents/upload` - Upload document

## Troubleshooting

**API Key Issues:**
- Make sure `.env` file exists in backend folder
- Verify API keys are correct
- Restart backend after changing `.env`

**MongoDB (Optional):**
- Works without MongoDB (sessions won't persist)
- For persistence: Install MongoDB or use MongoDB Atlas

**Port Issues:**
```bash
# Check if port 8000 is in use
netstat -ano | findstr :8000
```

**Package Issues:**
- Use Python 3.9-3.11 for best compatibility
- Upgrade pip: `python -m pip install --upgrade pip`

## Simple Project Structure
```
backend/
├── services/          # AI and document processing
├── main.py           # FastAPI app
├── models.py         # Data models
├── config.py         # Settings
└── requirements.txt  # Dependencies
```

All packages are pre-compiled - no build tools needed!
