
# Agentic Chatbot Backend

A production-ready FastAPI backend for AI chat with document processing capabilities.

## 🚀 Production Deployment

### Render Deployment (Recommended)

1. **Connect Repository**
   - Link your GitHub repository to Render
   - Select "Web Service" for deployment type

2. **Environment Variables**
   Set these in Render dashboard:
   ```
   GEMINI_API_KEY=your-gemini-api-key
   GROQ_API_KEY=your-groq-api-key
   MONGODB_URL=mongodb+srv://pranathisubrahmanyam07:6Klm0Nlg90cg3pdg@cluster0.cacx9au.mongodb.net/
   DATABASE_NAME=agentic_chatbot
   DEBUG=False
   ```

3. **Build Settings**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python run.py`
   - Python Version: 3.9+

## 🛠️ Local Development

### Prerequisites
- Python 3.9+
- MongoDB Atlas account (or local MongoDB)

### Setup Steps

1. **Install Dependencies**
   ```bash
   cd backend
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux  
   source venv/bin/activate
   
   pip install -r requirements.txt
   ```

2. **Environment Setup**
   Create `.env` file:
   ```
   GEMINI_API_KEY=your-gemini-api-key
   GROQ_API_KEY=your-groq-api-key
   MONGODB_URL=mongodb+srv://pranathisubrahmanyam07:6Klm0Nlg90cg3pdg@cluster0.cacx9au.mongodb.net/
   DATABASE_NAME=agentic_chatbot
   DEBUG=True
   ```

3. **Run Backend**
   ```bash
   python run.py
   ```
   
   Server runs at: `http://localhost:8000`

## 🔑 API Keys Setup

### Get Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create new API key
3. Copy to environment variables

### Get Groq API Key  
1. Visit [Groq Console](https://console.groq.com/keys)
2. Create new API key
3. Copy to environment variables

## 📊 Database

- **Production**: MongoDB Atlas (configured)
- **Connection**: Pre-configured connection string
- **Collections**: `chat_sessions`, `documents`

## 🌐 CORS Configuration

Backend configured for:
- Local development (localhost:3000, 5173, 8080)
- Vercel deployments (*.vercel.app)
- Netlify deployments (*.netlify.app)  
- Render deployments (*.onrender.com)

## 📋 API Endpoints

### Chat
- `POST /api/chat/message` - Send message
- `POST /api/sessions` - Create session
- `GET /api/sessions` - List sessions

### Documents  
- `POST /api/documents/upload` - Upload file
- `GET /health` - Health check

## 🔧 Troubleshooting

### Common Issues

**Import Errors**
```bash
# Ensure you're in backend directory
cd backend
python run.py
```

**MongoDB Connection**
- Verify connection string in environment
- Check network access in MongoDB Atlas
- Ensure database user has proper permissions

**API Key Issues**
- Verify keys are valid and active
- Check environment variable names match exactly
- Restart server after updating .env

**CORS Issues**
- Frontend URL must be in ALLOWED_ORIGINS
- Check protocol (http vs https)
- Verify port numbers match

### Production Checklist

- ✅ Environment variables set in Render
- ✅ MongoDB Atlas configured  
- ✅ API keys valid and active
- ✅ CORS origins include frontend URL
- ✅ DEBUG=False in production

## 📁 Project Structure
```
backend/
├── services/          # Core business logic
├── main.py           # FastAPI application  
├── models.py         # Data models
├── config.py         # Configuration
├── run.py           # Application runner
└── requirements.txt  # Dependencies
```

## 🔐 Security

- Environment variables for sensitive data
- CORS properly configured
- Input validation on all endpoints
- File upload restrictions (10MB, PDF/TXT/DOCX)

Ready for production deployment! 🚀
