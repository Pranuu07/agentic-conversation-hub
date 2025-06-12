
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
        self.documents = []
        self.embeddings = None
        self.index = None
        self.fitted = False
        
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
            
            # Create TF-IDF embeddings
            self.add_to_index(chunks)
            
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
    
    def add_to_index(self, chunks: List[str]):
        """Add document chunks to TF-IDF index"""
        # Add new chunks to existing documents
        self.documents.extend(chunks)
        
        # Re-fit the vectorizer with all documents
        if len(self.documents) > 0:
            self.embeddings = self.vectorizer.fit_transform(self.documents)
            self.fitted = True
    
    def search_similar_chunks(self, query: str, k: int = 5) -> List[str]:
        """Search for similar document chunks using TF-IDF similarity"""
        if not self.fitted or len(self.documents) == 0:
            return []
        
        try:
            # Transform query using fitted vectorizer
            query_vector = self.vectorizer.transform([query])
            
            # Calculate cosine similarity
            similarities = cosine_similarity(query_vector, self.embeddings).flatten()
            
            # Get top k most similar chunks
            top_indices = similarities.argsort()[-k:][::-1]
            
            # Return relevant chunks
            relevant_chunks = []
            for idx in top_indices:
                if idx < len(self.documents) and similarities[idx] > 0.1:  # threshold
                    relevant_chunks.append(self.documents[idx])
            
            return relevant_chunks
        except Exception as e:
            print(f"Error in similarity search: {e}")
            return []
    
    def get_context_for_query(self, query: str) -> str:
        """Get relevant context for a query from processed documents"""
        relevant_chunks = self.search_similar_chunks(query, k=3)
        
        if not relevant_chunks:
            return ""
        
        context = "\n\n".join(relevant_chunks)
        return f"Relevant context from documents:\n\n{context}"

# Global instance
document_service = DocumentService()
