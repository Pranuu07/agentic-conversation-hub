
import os
import tempfile
from typing import Dict, Any
from langchain.document_loaders import PyPDFLoader, TextLoader, Docx2txtLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.embeddings import SentenceTransformerEmbeddings
from ..models import DocumentUploadResponse

class DocumentService:
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        self.embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
        self.vector_stores = {}  # Store vector stores per session
    
    async def process_document(self, file_content: bytes, filename: str, session_id: str) -> DocumentUploadResponse:
        """Process uploaded document and create vector store"""
        try:
            # Save file temporarily
            with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(filename)[1]) as temp_file:
                temp_file.write(file_content)
                temp_file_path = temp_file.name
            
            # Load document based on file type
            file_extension = os.path.splitext(filename)[1].lower()
            
            if file_extension == '.pdf':
                loader = PyPDFLoader(temp_file_path)
            elif file_extension == '.txt':
                loader = TextLoader(temp_file_path, encoding='utf-8')
            elif file_extension == '.docx':
                loader = Docx2txtLoader(temp_file_path)
            else:
                raise ValueError(f"Unsupported file type: {file_extension}")
            
            # Load and split document
            documents = loader.load()
            texts = self.text_splitter.split_documents(documents)
            
            # Create vector store
            vector_store = Chroma.from_documents(
                documents=texts,
                embedding=self.embeddings,
                persist_directory=f"./chroma_db_{session_id}"
            )
            
            # Store vector store for session
            self.vector_stores[session_id] = vector_store
            
            # Extract text content
            content = "\n".join([doc.page_content for doc in documents])
            
            # Clean up temp file
            os.unlink(temp_file_path)
            
            return DocumentUploadResponse(
                filename=filename,
                content=content[:1000] + "..." if len(content) > 1000 else content,
                processed=True,
                message=f"Document '{filename}' processed successfully. {len(texts)} chunks created."
            )
        
        except Exception as e:
            if 'temp_file_path' in locals():
                try:
                    os.unlink(temp_file_path)
                except:
                    pass
            
            return DocumentUploadResponse(
                filename=filename,
                content="",
                processed=False,
                message=f"Error processing document: {str(e)}"
            )
    
    async def query_document(self, session_id: str, query: str, k: int = 3) -> str:
        """Query the document using vector similarity search"""
        try:
            if session_id not in self.vector_stores:
                return "No document available for this session."
            
            vector_store = self.vector_stores[session_id]
            docs = vector_store.similarity_search(query, k=k)
            
            context = "\n".join([doc.page_content for doc in docs])
            return context
        
        except Exception as e:
            return f"Error querying document: {str(e)}"
    
    def cleanup_session(self, session_id: str):
        """Clean up vector store for a session"""
        if session_id in self.vector_stores:
            del self.vector_stores[session_id]
            # Also remove the persistent directory
            import shutil
            try:
                shutil.rmtree(f"./chroma_db_{session_id}")
            except:
                pass
