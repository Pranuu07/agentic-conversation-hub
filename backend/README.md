
# Agentic Chatbot Backend

FastAPI backend for the Agentic Chatbot application.

## Setup

1. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

2. Create a `.env` file:
```bash
cp .env.example .env
```

3. Add your API keys to the `.env` file:
```
GEMINI_API_KEY=your-gemini-api-key-here
GROQ_API_KEY=your-groq-api-key-here
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=agentic_chatbot
```

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Run the FastAPI server:
```bash
python run.py
```

The API will be available at `http://localhost:8000`

## API Documentation

Visit `http://localhost:8000/docs` for interactive API documentation.

## Endpoints

- `POST /api/chat/message` - Send a message and get AI response
- `POST /api/sessions` - Create a new chat session
- `GET /api/sessions` - Get all chat sessions
- `GET /api/sessions/{session_id}` - Get a specific session
- `DELETE /api/sessions/{session_id}` - Delete a session
- `POST /api/documents/upload` - Upload and process a document
- `GET /api/models` - Get available AI models
- `GET /api/prompts/templates` - Get prompt templates
