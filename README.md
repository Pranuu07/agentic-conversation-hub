
# Agentic Chatbot

An AI-powered conversational agent with document analysis, chat history persistence, and multiple AI model support (Gemini and Groq). Built with React frontend and FastAPI backend.

## 🎯 Features

- **💬 Chat Interface**: Modern messenger-style UI with real-time conversations
- **🧠 Multiple AI Models**: Switch between Gemini Pro and Groq Mixtral
- **📄 Document Analysis**: Upload and analyze PDF, DOCX, and TXT files using RAG
- **📝 System Prompts**: Customize AI behavior for each chat session
- **📚 Chat History**: Persistent chat sessions stored in MongoDB
- **🎨 Clean UI**: Responsive design with consistent theme

## 🏗️ Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: FastAPI + Python
- **AI Models**: Google Gemini API + Groq API
- **Document Processing**: LangChain + ChromaDB
- **Database**: MongoDB
- **Vector Store**: ChromaDB with Sentence Transformers

## 📁 Project Structure

```
agentic-chatbot/
├── src/                    # Frontend React application
│   ├── components/
│   ├── pages/
│   └── lib/
├── backend/                # FastAPI backend
│   ├── services/
│   │   ├── chat_service.py
│   │   ├── document_service.py
│   │   ├── history_service.py
│   │   ├── model_router.py
│   │   └── prompt_service.py
│   ├── main.py
│   ├── models.py
│   ├── config.py
│   ├── requirements.txt
│   └── run.py
└── README.md
```

## 🚀 Local Setup Instructions

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.9, 3.10, or 3.11 recommended - avoid 3.12+)
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd agentic-chatbot
```

### Step 2: Frontend Setup

```bash
# Install frontend dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Step 3: Backend Setup

#### For Windows Users

Navigate to the backend directory:
```cmd
cd backend
```

**Option 1: Using PowerShell (Recommended)**
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\install_windows.ps1
```

**Option 2: Using Command Prompt**
```cmd
# Run Command Prompt as Administrator
install_windows.bat
```

**Option 3: Manual Installation**
```powershell
# Create virtual environment
python -m venv venv
.\venv\Scripts\activate

# Set SSL environment variable
$env:PYTHONHTTPSVERIFY = "0"

# Install dependencies
python -m pip install --upgrade pip --trusted-host pypi.org --trusted-host files.pythonhosted.org
python -m pip install -r requirements.txt --trusted-host pypi.org --trusted-host files.pythonhosted.org --trusted-host pypi.python.org
```

#### For Linux/Mac Users

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 4: Environment Configuration

1. **Copy the environment file:**
```bash
cd backend
cp .env.example .env
```

2. **Add your API keys to `.env`:**
```env
# API Keys (Required)
GEMINI_API_KEY=your-gemini-api-key-here
GROQ_API_KEY=your-groq-api-key-here

# MongoDB Configuration
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=agentic_chatbot

# Development
DEBUG=True
```

### Step 5: Get API Keys

#### Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key to your `.env` file

#### Groq API Key
1. Go to [Groq Console](https://console.groq.com/keys)
2. Create an account or sign in
3. Create a new API key
4. Copy the key to your `.env` file

### Step 6: Database Setup

#### Option 1: MongoDB Atlas (Cloud - Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URL` in your `.env` file:
```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/
```

#### Option 2: Local MongoDB
1. **Install MongoDB Community Edition:**
   - Windows: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Mac: `brew install mongodb-community`
   - Ubuntu: `sudo apt install mongodb`

2. **Start MongoDB service:**
   - Windows: MongoDB should start automatically
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

3. **Use default connection:**
```env
MONGODB_URL=mongodb://localhost:27017
```

### Step 7: Run the Application

#### Start the Backend (Terminal 1)
```bash
cd backend

# Activate virtual environment (if not already active)
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Run the FastAPI server
python run.py
```

Backend will be available at:
- API: `http://localhost:8000`
- Interactive Docs: `http://localhost:8000/docs`
- Alternative Docs: `http://localhost:8000/redoc`

#### Start the Frontend (Terminal 2)
```bash
# In the root directory
npm run dev
```

Frontend will be available at `http://localhost:5173`

## 🔧 API Endpoints

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

## 🛠️ Development Commands

### Frontend Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Commands
```bash
cd backend
python run.py        # Start FastAPI development server
python -m pytest    # Run tests (if available)
```

## 🐛 Troubleshooting

### SSL Certificate Issues (Windows)
```powershell
$env:PYTHONHTTPSVERIFY = "0"
python -m pip install package-name --trusted-host pypi.org --trusted-host files.pythonhosted.org
```

### Rust Compilation Issues
1. Install Rust from [rustup.rs](https://rustup.rs/)
2. Restart your terminal
3. Try installation again

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check your connection string format
- Verify network connectivity (for Atlas)
- Check firewall settings

### Python Version Issues
- Use Python 3.9, 3.10, or 3.11
- Avoid Python 3.12+ for better package compatibility

### Port Already in Use
```bash
# Check what's using the port
netstat -ano | findstr :8000  # Windows
lsof -i :8000                 # Mac/Linux

# Kill the process or use a different port
```

## 📝 Usage

1. **Start a New Chat:**
   - Click "New Chat" button
   - Enter a system prompt to define AI behavior
   - Select your preferred AI model (Gemini or Groq)

2. **Upload Documents:**
   - Use the upload button in the chat
   - Supported formats: PDF, DOCX, TXT
   - Ask questions about the uploaded document

3. **Chat History:**
   - All conversations are automatically saved
   - Access previous chats from the sidebar
   - Each session maintains its context and settings

## 🚀 Production Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy the dist/ folder to Vercel
```

### Backend
- Deploy to platforms like Railway, Render, or DigitalOcean
- Set environment variables in production
- Use production MongoDB instance
- Enable HTTPS and proper security headers

## 📦 Package Versions

### Frontend Dependencies
- React 18.3.1
- Vite (latest)
- Tailwind CSS
- shadcn/ui components
- React Router DOM 6.26.2

### Backend Dependencies
- FastAPI 0.104.1
- Python 3.9-3.11
- LangChain 0.0.350
- ChromaDB 0.4.15
- Motor (MongoDB async driver)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.
