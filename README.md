
# Agentic Chatbot

**Owner:** Pranathi Jogavajjhula  
**Version:** 1.0  
**Last Updated:** June 10, 2025

## 🎯 Overview

Agentic Chatbot is an advanced AI-powered conversational agent capable of analyzing documents, saving chat histories, and switching between multiple AI models (Gemini and Groq). It leverages modern web technologies to provide a seamless chat experience with document understanding capabilities.

## ✨ Features

### 💬 Chat Interface
- **Messenger-style UI** with modern design
- **Dark/Light theme** toggle for optimal viewing
- **Real-time messaging** with typing indicators
- **Responsive design** that works on all devices

### 🧠 Model Switching
- **Gemini API** integration for advanced AI responses
- **Groq API** support for high-performance inference
- **Dynamic model switching** during conversations
- **Model-specific response indicators**

### 📄 Document Upload & Analysis
- **Multi-format support** (PDF, TXT, DOCX)
- **Document parsing** and content extraction
- **RAG (Retrieval-Augmented Generation)** for contextual responses
- **Document-aware conversations**

### 📝 System Prompt Customization
- **Custom system prompts** to define AI behavior
- **Role-based configurations** (coding assistant, formal, friendly, etc.)
- **Session-specific prompts** for tailored interactions
- **Prompt templates** for common use cases

### 📚 Chat History & Persistence
- **Session management** with automatic saving
- **Sidebar navigation** for easy access to previous chats
- **Conversation timestamps** and metadata
- **Local storage persistence** for offline access

### ⚙️ Advanced Features
- **File upload validation** and error handling
- **Message timestamps** and formatting
- **Loading states** and smooth animations
- **Toast notifications** for user feedback

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React + TypeScript |
| **UI Framework** | Tailwind CSS + shadcn/ui |
| **State Management** | React Hooks + Local Storage |
| **Icons** | Lucide React |
| **Build Tool** | Vite |
| **Deployment** | Vercel |

## 📋 Prerequisites

Before running this project locally, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

## 🛠️ Local Development Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd agentic-chatbot
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

For production use, you'll need to set up API keys for Gemini and Groq. Currently, the application runs with mock responses for demonstration purposes.

To integrate real AI models, you would typically:

1. Create API accounts with Google (Gemini) and Groq
2. Obtain API keys
3. Set up environment variables
4. Configure the backend service

### 4. Start Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:8080`

### 5. Build for Production

```bash
npm run build
# or
yarn build
```

## 📱 Usage Guide

### Starting a New Chat

1. Click **"New Chat"** in the sidebar
2. Enter a **system prompt** to define AI behavior
3. Select your preferred **AI model** (Gemini or Groq)
4. Click **"Start Chat"** to begin

### Uploading Documents

1. In an active chat session, click the **upload button** 📎
2. Select a PDF, TXT, or DOCX file
3. The document will be processed and available for Q&A
4. Ask questions about the document content

### Managing Chat History

- **View all sessions** in the left sidebar
- **Click any session** to switch between conversations
- **Session metadata** shows model used and creation date
- **Document indicator** shows which chats include uploaded files

### Customizing Experience

- **Toggle themes** using the sun/moon icon
- **Switch AI models** anytime during conversation
- **Collapse sidebar** for focused chat view
- **Responsive design** adapts to your screen size

## 🎨 UI/UX Features

### Design System
- **Consistent color palette** with semantic tokens
- **Smooth animations** and micro-interactions
- **Accessible design** with proper contrast ratios
- **Mobile-first approach** for all screen sizes

### Interactive Elements
- **Hover effects** on clickable elements
- **Loading animations** during AI processing
- **Toast notifications** for user feedback
- **Keyboard shortcuts** for power users

## 🔧 Configuration Options

### Theme Customization
The application supports both light and dark themes with automatic preference detection and manual override.

### Model Selection
Choose between different AI models based on your needs:
- **Gemini**: Advanced reasoning and context understanding
- **Groq**: High-performance inference and speed

### File Upload Settings
Supported file formats:
- **PDF**: Document analysis and text extraction
- **TXT**: Plain text processing
- **DOCX**: Microsoft Word document parsing

## 🚢 Deployment

### Vercel Deployment (Recommended)

1. Connect your repository to Vercel
2. Configure build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. Set up environment variables (when integrating real APIs)
4. Deploy and enjoy your live chatbot!

### Alternative Deployment Options

- **Netlify**: Similar setup to Vercel
- **GitHub Pages**: For static hosting
- **Self-hosted**: Use any web server with static file support

## 🔒 Security Considerations

- **Input sanitization** for all user inputs
- **File type validation** for uploads
- **API key protection** (when implemented)
- **XSS prevention** through proper escaping

## 🧪 Future Enhancements

### Planned Features
- [ ] **Real-time collaboration** on shared chats
- [ ] **Export conversations** to PDF/Markdown
- [ ] **Advanced search** through chat history
- [ ] **Plugin system** for extended functionality
- [ ] **Voice input/output** capabilities
- [ ] **Multi-language support**

### Backend Integration
For production use, consider implementing:
- **FastAPI backend** for AI model integration
- **MongoDB** for persistent data storage
- **Authentication system** for user management
- **Rate limiting** and usage analytics

## 📖 API Integration Guide

To connect real AI models, you'll need to:

### 1. Set Up Backend Service
```python
# Example FastAPI structure
from fastapi import FastAPI
from services.chat_service import ChatService
from services.document_service import DocumentService

app = FastAPI()

@app.post("/api/chat")
async def send_message(message: str, model: str):
    return await ChatService.process_message(message, model)
```

### 2. Update Frontend API Calls
```typescript
// Replace mock responses with real API calls
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message, model, systemPrompt })
});
```

## 🐛 Troubleshooting

### Common Issues

**Build Errors:**
- Ensure all dependencies are installed
- Check Node.js version compatibility
- Clear npm cache if needed

**Theme Not Applying:**
- Check browser developer tools for CSS conflicts
- Verify Tailwind CSS is properly configured

**File Upload Issues:**
- Confirm file size limits
- Check supported file formats
- Verify browser compatibility

## 📄 License

This project is available for educational and demonstration purposes. Please ensure you have proper licenses for any AI APIs you integrate.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for:

- Bug fixes
- Feature enhancements
- Documentation improvements
- Performance optimizations

## 📞 Support

For questions or support regarding this project, please:

1. Check the troubleshooting guide above
2. Review the code documentation
3. Open an issue in the repository
4. Contact the project maintainer

---

**Built with ❤️ by Pranathi Jogavajjhula**

*This application demonstrates modern web development practices with React, TypeScript, and AI integration capabilities.*
