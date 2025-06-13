
import PyPDF2
import docx
import io
import faiss
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict, Any
import json
import tempfile
import os

class DocumentService:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
        self.documents = {}  # session_id -> documents
        self.embeddings = {}  # session_id -> embeddings
        self.fitted = {}  # session_id -> bool
        
    def extract_text_from_pdf(self, file_content: bytes) -> str:
        """Extract text from PDF file"""
        try:
            pdf_file = io.BytesIO(file_content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            text = ""
            
            for page in pdf_reader.pages:
                text += page.extract_text()
            
            return text.strip()
        except Exception as e:
            raise Exception(f"Error extracting text from PDF: {str(e)}")
    
    def extract_text_from_docx(self, file_content: bytes) -> str:
        """Extract text from DOCX file"""
        try:
            doc_file = io.BytesIO(file_content)
            doc = docx.Document(doc_file)
            text = ""
            
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            
            return text.strip()
        except Exception as e:
            raise Exception(f"Error extracting text from DOCX: {str(e)}")
    
    def extract_text_from_txt(self, file_content: bytes) -> str:
        """Extract text from TXT file"""
        try:
            return file_content.decode('utf-8').strip()
        except Exception as e:
            raise Exception(f"Error extracting text from TXT: {str(e)}")
    
    async def process_document(self, file_content: bytes, filename: str, session_id: str) -> Dict[str, Any]:
        """Process document and extract text based on file type"""
        file_extension = filename.lower().split('.')[-1]
        
        try:
            if file_extension == 'pdf':
                text = self.extract_text_from_pdf(file_content)
            elif file_extension == 'docx':
                text = self.extract_text_from_docx(file_content)
            elif file_extension == 'txt':
                text = self.extract_text_from_txt(file_content)
            else:
                raise Exception(f"Unsupported file type: {file_extension}")
            
            if not text:
                raise Exception("No text could be extracted from the document")
            
            # Split text into chunks for better processing
            chunks = self.split_text_into_chunks(text)
            
            # Create TF-IDF embeddings for this session
            self.add_to_index(chunks, session_id)
            
            return {
                "filename": filename,
                "text": text,
                "chunks": len(chunks),
                "processed": True
            }
            
        except Exception as e:
            return {
                "filename": filename,
                "text": "",
                "chunks": 0,
                "processed": False,
                "error": str(e)
            }
    
    def split_text_into_chunks(self, text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
        """Split text into overlapping chunks"""
        words = text.split()
        chunks = []
        
        for i in range(0, len(words), chunk_size - overlap):
            chunk = ' '.join(words[i:i + chunk_size])
            chunks.append(chunk)
            
            if i + chunk_size >= len(words):
                break
        
        return chunks
    
    def add_to_index(self, chunks: List[str], session_id: str):
        """Add document chunks to TF-IDF index for specific session"""
        # Initialize session storage if not exists
        if session_id not in self.documents:
            self.documents[session_id] = []
        
        # Add new chunks to existing documents for this session
        self.documents[session_id].extend(chunks)
        
        # Re-fit the vectorizer with all documents for this session
        if len(self.documents[session_id]) > 0:
            vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
            self.embeddings[session_id] = vectorizer.fit_transform(self.documents[session_id])
            self.fitted[session_id] = True
            # Store the vectorizer for this session
            setattr(self, f'vectorizer_{session_id}', vectorizer)
    
    def search_similar_chunks(self, query: str, session_id: str, k: int = 5) -> List[str]:
        """Search for similar document chunks using TF-IDF similarity"""
        if session_id not in self.fitted or not self.fitted[session_id] or len(self.documents[session_id]) == 0:
            return []
        
        try:
            # Get the vectorizer for this session
            vectorizer = getattr(self, f'vectorizer_{session_id}', None)
            if not vectorizer:
                return []
            
            # Transform query using fitted vectorizer
            query_vector = vectorizer.transform([query])
            
            # Calculate cosine similarity
            similarities = cosine_similarity(query_vector, self.embeddings[session_id]).flatten()
            
            # Get top k most similar chunks
            top_indices = similarities.argsort()[-k:][::-1]
            
            # Return relevant chunks
            relevant_chunks = []
            for idx in top_indices:
                if idx < len(self.documents[session_id]) and similarities[idx] > 0.1:  # threshold
                    relevant_chunks.append(self.documents[session_id][idx])
            
            return relevant_chunks
        except Exception as e:
            print(f"Error in similarity search: {e}")
            return []
    
    async def query_document(self, session_id: str, query: str) -> str:
        """Get relevant context for a query from processed documents"""
        relevant_chunks = self.search_similar_chunks(query, session_id, k=3)
        
        if not relevant_chunks:
            return ""
        
        context = "\n\n".join(relevant_chunks)
        return f"Relevant context from documents:\n\n{context}"
    
    def cleanup_session(self, session_id: str):
        """Clean up session data"""
        if session_id in self.documents:
            del self.documents[session_id]
        if session_id in self.embeddings:
            del self.embeddings[session_id]
        if session_id in self.fitted:
            del self.fitted[session_id]
        
        # Remove session-specific vectorizer
        vectorizer_attr = f'vectorizer_{session_id}'
        if hasattr(self, vectorizer_attr):
            delattr(self, vectorizer_attr)
