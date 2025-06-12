
# Agentic Chatbot Backend

FastAPI backend for the Agentic Chatbot application with AI model integration and document processing.

## Manual Setup

### Install Dependencies

1. Navigate to the backend directory:
```bash
cd backend
```

2. Upgrade pip:
```bash
python -m pip install --upgrade pip
```

3. Install all dependencies:
```bash
pip install -r requirements.txt
```

## Key Features - No Compilation Required!

This backend has been designed to **eliminate all compilation dependencies**:

- **Pydantic v1.10.12**: Uses the older stable version that doesn't require Rust
- **FAISS instead of ChromaDB**: Uses Facebook's FAISS library for vector search (CPU version, no compilation needed)
- **TF-IDF Vectorization**: Uses scikit-learn for text similarity (no sentence-transformers compilation)
- **Pre-compiled packages**: All packages are available as pre-built wheels

**No additional system dependencies required!** Just Python and pip.

## Environment Configuration

1. Create a `.env` file:
```bash
cp .env.example .env
```

2. Add your API keys to the `.env` file:
```
GEMINI_API_KEY=your-gemini-api-key-here
GROQ_API_KEY=your-groq-api-key-here
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=agentic_chatbot
```

### Getting API Keys

**Gemini API Key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

**Groq API Key:**
1. Go to [Groq Console](https://console.groq.com/keys)
2. Create a new API key
3. Copy the key to your `.env` file

## Database Setup

### Option 1: MongoDB Atlas (Cloud - Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URL` in your `.env` file

### Option 2: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service:
   - **Windows**: MongoDB should start automatically
   - **Linux/Mac**: `sudo systemctl start mongod` or `brew services start mongodb`
3. Use default connection: `mongodb://localhost:27017`

## Running the Application

### Step-by-Step Manual Run Process:

1. **Ensure you're in the backend directory:**
```bash
cd backend
```

2. **Verify dependencies are installed:**
```bash
pip list | grep fastapi
# Should show fastapi and other packages
```

3. **Check your .env file exists and has API keys:**
```bash
# Windows
type .env

# Linux/Mac
cat .env
```

4. **Start the FastAPI server:**
```bash
python run.py
```

5. **Verify the server is running:**
- API will be available at `http://localhost:8000`
- Interactive API documentation: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

6. **You should see output like:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
```

## API Endpoints

### Chat
- `POST /api/chat/message` - Send a message and get AI response
- `POST /api/chat/upload` - Upload and process documents

### Sessions
- `POST /api/sessions` - Create a new chat session
- `GET /api/sessions` - Get all chat sessions
- `GET /api/sessions/{session_id}` - Get a specific session
- `DELETE /api/sessions/{session_id}` - Delete a session

### System
- `GET /api/models` - Get available AI models
- `GET /api/health` - Health check endpoint

## Features

### AI Model Integration
- **Gemini Pro**: Google's advanced language model
- **Groq**: High-performance AI inference
- Dynamic model switching during conversations

### Document Processing
- **PDF**: Extract text and analyze content
- **DOCX**: Process Word documents
- **TXT**: Handle plain text files
- **RAG**: Retrieval-Augmented Generation for document Q&A

### Vector Database
- **FAISS**: Facebook's similarity search library (CPU version)
- **TF-IDF Search**: Find relevant document sections using TF-IDF similarity
- **Context-Aware Responses**: AI responses based on document content

### Chat Management
- **Session Persistence**: Save chat history to MongoDB
- **System Prompts**: Custom AI behavior per session
- **Message History**: Full conversation tracking

## Troubleshooting

### Python Version Compatibility
- **Recommended**: Python 3.9, 3.10, or 3.11
- **Python 3.13**: Should work fine with these packages (no compilation required)
- **Avoid**: Python 3.12 if you encounter any issues

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check your connection string format
- Verify network connectivity (for Atlas)

### Package Installation Issues
- Make sure pip is upgraded: `python -m pip install --upgrade pip`
- All packages are pre-compiled (no compilation needed)
- If individual packages fail, try installing them one by one

### API Key Issues
- Verify keys are correctly set in `.env`
- Check API key permissions and quotas
- Restart backend after changing `.env`

## Development

### Project Structure
```
backend/
├── services/           # Business logic
│   ├── chat_service.py    # AI chat processing
│   ├── document_service.py # Document parsing with FAISS
│   ├── history_service.py  # Chat history
│   ├── model_router.py     # AI model routing
│   └── prompt_service.py   # System prompt management
├── main.py            # FastAPI application
├── models.py          # Pydantic data models
├── config.py          # Configuration settings
└── requirements.txt   # Python dependencies (no compilation!)
```

### Technical Stack
- **FastAPI**: Modern async web framework
- **Pydantic v1**: Data validation (no Rust required)
- **FAISS**: Vector similarity search
- **TF-IDF**: Text similarity using scikit-learn
- **Motor**: Async MongoDB driver
- **LangChain**: AI framework integration

## Production Deployment

For production deployment:
1. Set `DEBUG=False` in your environment
2. Use a production WSGI server like Gunicorn
3. Set up proper logging and monitoring
4. Use environment variables for all secrets
5. Enable HTTPS and proper security headers
