
import PyPDF2
import docx
import io
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
from typing import List, Dict, Any
import json
import tempfile
import os

class DocumentService:
    def __init__(self):
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        self.documents = []
        self.embeddings = None
        self.index = None
        
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
    
    def process_document(self, file_content: bytes, filename: str) -> Dict[str, Any]:
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
            
            # Create embeddings
            embeddings = self.embedding_model.encode(chunks)
            
            # Store in FAISS index
            self.add_to_index(chunks, embeddings)
            
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
    
    def add_to_index(self, chunks: List[str], embeddings: np.ndarray):
        """Add document chunks to FAISS index"""
        if self.index is None:
            # Initialize FAISS index
            dimension = embeddings.shape[1]
            self.index = faiss.IndexFlatL2(dimension)
            self.documents = []
        
        # Add embeddings to index
        self.index.add(embeddings.astype('float32'))
        
        # Store document chunks
        self.documents.extend(chunks)
    
    def search_similar_chunks(self, query: str, k: int = 5) -> List[str]:
        """Search for similar document chunks"""
        if self.index is None or len(self.documents) == 0:
            return []
        
        # Encode query
        query_embedding = self.embedding_model.encode([query])
        
        # Search in FAISS index
        distances, indices = self.index.search(query_embedding.astype('float32'), k)
        
        # Return relevant chunks
        relevant_chunks = []
        for idx in indices[0]:
            if idx < len(self.documents):
                relevant_chunks.append(self.documents[idx])
        
        return relevant_chunks
    
    def get_context_for_query(self, query: str) -> str:
        """Get relevant context for a query from processed documents"""
        relevant_chunks = self.search_similar_chunks(query, k=3)
        
        if not relevant_chunks:
            return ""
        
        context = "\n\n".join(relevant_chunks)
        return f"Relevant context from documents:\n\n{context}"

# Global instance
document_service = DocumentService()
