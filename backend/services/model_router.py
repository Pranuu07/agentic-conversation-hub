
from enum import Enum
from models import ModelType

class ModelRouter:
    """Router for managing different AI models"""
    
    @staticmethod
    def get_available_models():
        """Get list of available models"""
        return [
            {
                "id": ModelType.GEMINI.value,
                "name": "Gemini Pro",
                "description": "Google's advanced AI model with superior reasoning",
                "icon": "sparkles"
            },
            {
                "id": ModelType.GROQ.value,
                "name": "Groq Mixtral",
                "description": "High-performance inference with Mixtral model",
                "icon": "bot"
            }
        ]
    
    @staticmethod
    def validate_model(model: str) -> bool:
        """Validate if model is supported"""
        return model in [ModelType.GEMINI.value, ModelType.GROQ.value]
    
    @staticmethod
    def get_model_info(model: str) -> dict:
        """Get information about a specific model"""
        models = ModelRouter.get_available_models()
        for m in models:
            if m["id"] == model:
                return m
        return None
