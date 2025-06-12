
# Agentic Chatbot

An AI-powered conversational agent with document analysis, chat history persistence, and multiple AI model support (Gemini and Groq). Built with React frontend and FastAPI backend.

## 🎯 Features

- **💬 Chat Interface**: Modern messenger-style UI with real-time conversations
- **🧠 Multiple AI Models**: Switch between Gemini Pro and Groq Mixtral
- **📄 Document Analysis**: Upload and analyze PDF, DOCX, and TXT files using RAG
- **📝 System Prompts**: Customize AI behavior for each chat session
- **📚 Chat History**: Persistent chat sessions stored in MongoDB
- **🎨 Clean UI**: Responsive design with consistent theme

## 🚀 Quick Local Setup

### Prerequisites
- **Python** (3.9, 3.10, or 3.11 recommended)
- **Node.js** (v18 or higher)
- **Git**

### Step 1: Clone Repository
```bash
git clone <your-repository-url>
cd agentic-chatbot
```

### Step 2: Frontend Setup
```bash
# Install frontend dependencies
npm install

# Start frontend (in separate terminal)
npm run dev
```
Frontend runs at: `http://localhost:5173`

### Step 3: Backend Setup

#### Windows Users
```cmd
# Navigate to backend
cd backend

# Run installation script
install_windows.bat
```

#### Linux/Mac Users
```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt
```

### Step 4: Environment Configuration
```bash
# Copy environment file
cd backend
cp .env.example .env
```

Edit `.env` file with your API keys:
```env
# Required API Keys
GEMINI_API_KEY=your-gemini-api-key-here
GROQ_API_KEY=your-groq-api-key-here

# Database (optional for testing)
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=agentic_chatbot
```

### Step 5: Get API Keys

**Gemini API Key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key
3. Add to `.env` file

**Groq API Key:**
1. Go to [Groq Console](https://console.groq.com/keys)
2. Create API key
3. Add to `.env` file

### Step 6: Run Backend
```bash
# In backend directory
python run.py
```
Backend runs at: `http://localhost:8000`

## 📁 Project Structure
```
agentic-chatbot/
├── src/                    # React frontend
├── backend/                # FastAPI backend
│   ├── services/          # Business logic
│   ├── main.py           # FastAPI app
│   ├── models.py         # Data models
│   ├── config.py         # Configuration
│   └── requirements.txt   # Dependencies
└── README.md
```

## 🔧 API Endpoints

- **Chat**: `POST /api/chat/message` - Send messages
- **Sessions**: `GET/POST/DELETE /api/sessions` - Manage chat sessions
- **Documents**: `POST /api/documents/upload` - Upload files
- **Health**: `GET /health` - Health check

## 🎮 Usage

1. **Start New Chat**: Click "New Chat", set system prompt, select AI model
2. **Upload Documents**: Use upload button for PDF/DOCX/TXT files
3. **Chat History**: All conversations auto-saved in sidebar

## 🛠️ Development Commands

**Frontend:**
```bash
npm run dev          # Development server
npm run build        # Production build
```

**Backend:**
```bash
python run.py        # Development server
```

## 🐛 Troubleshooting

### MongoDB (Optional)
- Install MongoDB locally OR use MongoDB Atlas (cloud)
- App works without database (sessions won't persist)

### Python Version
- Use Python 3.9-3.11 for best compatibility
- Avoid Python 3.12+ if you encounter issues

### Port Issues
```bash
# If ports are busy, kill processes or change ports
netstat -ano | findstr :8000  # Windows
lsof -i :8000                 # Mac/Linux
```

### API Key Issues
- Verify keys are correctly set in `.env`
- Check API key permissions and quotas
- Restart backend after changing `.env`

## 📦 Tech Stack

**Frontend:** React + TypeScript + Vite + Tailwind CSS + shadcn/ui
**Backend:** FastAPI + Python + FAISS + LangChain
**Database:** MongoDB (optional for local development)
**AI:** Google Gemini + Groq APIs

## 🚀 Production Deployment

1. Build frontend: `npm run build`
2. Deploy backend to cloud platform (Railway, Render, etc.)
3. Set production environment variables
4. Use production MongoDB instance

## 📄 License

MIT License - Open source project
```
