
from typing import List, Dict
import json
import os

class PromptService:
    """Service for managing system prompts and templates"""
    
    def __init__(self):
        self.prompt_templates = {
            "general": "You are a helpful AI assistant. Respond to user queries in a clear and informative manner.",
            "coding": "You are an expert programming assistant. Help users with coding questions, debugging, and best practices. Provide clear explanations and working code examples.",
            "formal": "You are a professional AI assistant. Respond in a formal, business-appropriate tone. Be precise and comprehensive in your responses.",
            "friendly": "You are a friendly and casual AI assistant. Use a warm, conversational tone while being helpful and informative.",
            "educational": "You are an educational AI tutor. Break down complex topics into easy-to-understand explanations. Use examples and analogies to help users learn.",
            "creative": "You are a creative AI assistant. Help users with creative writing, brainstorming, and artistic endeavors. Be imaginative and inspiring.",
            "analytical": "You are an analytical AI assistant. Focus on data-driven insights, logical reasoning, and structured problem-solving approaches."
        }
    
    def get_prompt_templates(self) -> Dict[str, str]:
        """Get all available prompt templates"""
        return self.prompt_templates
    
    def get_template(self, template_name: str) -> str:
        """Get a specific prompt template"""
        return self.prompt_templates.get(template_name, self.prompt_templates["general"])
    
    def validate_prompt(self, prompt: str) -> Dict[str, any]:
        """Validate a system prompt"""
        if not prompt or len(prompt.strip()) == 0:
            return {"valid": False, "message": "Prompt cannot be empty"}
        
        if len(prompt) > 2000:
            return {"valid": False, "message": "Prompt is too long (max 2000 characters)"}
        
        return {"valid": True, "message": "Prompt is valid"}
    
    def enhance_prompt(self, base_prompt: str, context: str = None) -> str:
        """Enhance a prompt with additional context"""
        enhanced = base_prompt
        
        if context:
            enhanced += f"\n\nAdditional Context: {context}"
        
        enhanced += "\n\nAlways be helpful, accurate, and provide detailed responses when appropriate."
        
        return enhanced
