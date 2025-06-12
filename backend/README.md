
# Agentic Chatbot Backend

FastAPI backend for the Agentic Chatbot application with AI model integration and document processing.

## Setup

### For Windows Users

**Option 1: Using PowerShell (Recommended)**
1. Open PowerShell as Administrator
2. Navigate to the backend directory:
```powershell
cd backend
```

3. Run the PowerShell installation script:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\install_windows.ps1
```

**Option 2: Using Command Prompt**
1. Open Command Prompt as Administrator
2. Navigate to the backend directory:
```cmd
cd backend
```

3. Run the batch installation script:
```cmd
install_windows.bat
```

**Option 3: Manual Installation (if scripts fail)**
1. Set environment variables to handle SSL issues:
```powershell
$env:PYTHONHTTPSVERIFY = "0"
```

2. Install dependencies manually:
```powershell
python -m pip install --upgrade pip --trusted-host pypi.org --trusted-host files.pythonhosted.org
python -m pip install -r requirements.txt --trusted-host pypi.org --trusted-host files.pythonhosted.org --trusted-host pypi.python.org
```

### For Linux/Mac Users

1. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

## Key Changes - No Rust Required!

This backend has been updated to **eliminate all Rust dependencies**:

- **Pydantic v1.10.12**: Uses the older stable version that doesn't require Rust
- **FAISS instead of ChromaDB**: Uses Facebook's FAISS library for vector search (CPU version, no compilation needed)
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

1. Start the FastAPI server:
```bash
python run.py
```

2. The API will be available at `http://localhost:8000`
3. Interactive API documentation: `http://localhost:8000/docs`

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
- **Semantic Search**: Find relevant document sections using sentence transformers
- **Context-Aware Responses**: AI responses based on document content

### Chat Management
- **Session Persistence**: Save chat history to MongoDB
- **System Prompts**: Custom AI behavior per session
- **Message History**: Full conversation tracking

## Troubleshooting

### SSL Certificate Issues
If you encounter SSL certificate errors:
```powershell
# Set environment variable
$env:PYTHONHTTPSVERIFY = "0"

# Use trusted hosts
python -m pip install package-name --trusted-host pypi.org --trusted-host files.pythonhosted.org
```

### Python Version Compatibility
- **Recommended**: Python 3.9, 3.10, or 3.11
- **Python 3.13**: Should work fine with these packages (no Rust required)
- **Avoid**: Python 3.12 if you encounter any issues

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check your connection string format
- Verify network connectivity (for Atlas)

### Package Installation Issues
- Use the provided installation scripts
- All packages are pre-compiled (no Rust/compilation needed)
- If individual packages fail, try installing them one by one

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
└── requirements.txt   # Python dependencies (no Rust!)
```

### Technical Stack
- **FastAPI**: Modern async web framework
- **Pydantic v1**: Data validation (no Rust required)
- **FAISS**: Vector similarity search
- **Sentence Transformers**: Text embeddings
- **Motor**: Async MongoDB driver
- **LangChain**: AI framework integration

## Production Deployment

For production deployment:
1. Set `DEBUG=False` in your environment
2. Use a production WSGI server like Gunicorn
3. Set up proper logging and monitoring
4. Use environment variables for all secrets
5. Enable HTTPS and proper security headers
