# Chatbot Frontend

A modern React-based chat interface for the Agentic Conversation Hub, featuring AI-powered conversations with document processing capabilities.

## 🎯 Features

- **💬 Chat Interface**: Modern messenger-style UI with real-time conversations
- **🧠 Multiple AI Models**: Switch between Gemini Pro and Groq Mixtral
- **📄 Document Analysis**: Upload and analyze PDF, DOCX, and TXT files
- **📝 System Prompts**: Customize AI behavior for each chat session
- **📚 Chat History**: Persistent chat sessions with MongoDB backend
- **🎨 Clean UI**: Responsive design with Tailwind CSS and Shadcn/ui

## 🚀 Quick Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Pranuu07/Chatbot-Frontend.git
   cd Chatbot-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure
```
Chatbot-Frontend/
├── src/                    # React source code
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   └── lib/              # Utility functions
├── public/               # Static assets
├── package.json          # Dependencies and scripts
└── README.md
```

## 🎮 Usage

1. **Start New Chat**: Click "New Chat", set system prompt, select AI model
2. **Upload Documents**: Use upload button for PDF/DOCX/TXT files
3. **Chat History**: All conversations auto-saved in sidebar
4. **Switch Models**: Toggle between Gemini and Groq AI models

## 🛠️ Development Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🔧 API Integration

The frontend connects to the backend API at: `https://chatbot-backend-ny74.onrender.com/api`

## 📦 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Shadcn/ui
- **State Management**: React Query
- **Routing**: React Router
- **Icons**: Lucide React
- **Backend**: FastAPI (separate repository)

## 🚀 Deployment

This project can be deployed on:
- **Vercel** (Recommended)
- **Netlify**
- **Render**
- Any static hosting service

### Build for Production

```bash
npm run build
```

## 📄 License

MIT License - Open source project
