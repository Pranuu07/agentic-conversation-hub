
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
- **ChromaDB**: Store document embeddings
- **Semantic Search**: Find relevant document sections
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

### Rust Compilation Issues
If packages require Rust compilation:
1. Install Rust from [rustup.rs](https://rustup.rs/)
2. Restart your terminal
3. Try installation again

### Python Version Compatibility
- **Recommended**: Python 3.9, 3.10, or 3.11
- **Not recommended**: Python 3.12+ (some packages may not be compatible)

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check your connection string format
- Verify network connectivity (for Atlas)

## Development

### Project Structure
```
backend/
├── services/           # Business logic
│   ├── chat_service.py    # AI chat processing
│   ├── document_service.py # Document parsing
│   ├── history_service.py  # Chat history
│   ├── model_router.py     # AI model routing
│   └── prompt_service.py   # System prompt management
├── main.py            # FastAPI application
├── models.py          # Pydantic data models
├── config.py          # Configuration settings
└── requirements.txt   # Python dependencies
```

### Adding New Features
1. Create service modules in the `services/` directory
2. Define Pydantic models in `models.py`
3. Add API endpoints in `main.py`
4. Update configuration in `config.py`

## Production Deployment

For production deployment:
1. Set `DEBUG=False` in your environment
2. Use a production WSGI server like Gunicorn
3. Set up proper logging and monitoring
4. Use environment variables for all secrets
5. Enable HTTPS and proper security headers

```

This updated backend configuration should resolve the SSL and Rust compilation issues you're experiencing on Windows.
