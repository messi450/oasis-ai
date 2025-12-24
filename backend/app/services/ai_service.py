import google.generativeai as genai
import json
from app.schemas.ai import ModelRecommendation
from app.config.settings import settings
from app.config.logging import logger

class AIService:
    """Business logic for AI model recommendations using Gemini"""
    
    _client_initialized = False

    @classmethod
    def _init_client(cls):
        if not cls._client_initialized and settings.GOOGLE_API_KEY:
            genai.configure(api_key=settings.GOOGLE_API_KEY)
            cls._client_initialized = True

    @staticmethod
    def chat_with_model(message: str, model_name: str, history: list = None) -> str:
        """Chat with the selected AI model (Simulated or Real via Gemini)"""
        
        # Use Gemini for everything if key is present, pretending to be the selected model
        if settings.GOOGLE_API_KEY:
            try:
                AIService._init_client()
                # Use gemini-pro for better availability
                model = genai.GenerativeModel('gemini-pro')
                
                # Context instruction to act like the requested model
                system_context = f"You are acting as {model_name}. Please respond to the user accordingly."
                
                response = model.generate_content(f"{system_context}\n\nUser: {message}")
                return response.text
            except Exception as e:
                logger.error(f"Gemini Chat API failed: {str(e)}", exc_info=True)
                return f"Error connecting to AI: {str(e)}"
        
        # Mock fallback if no key
        return f"[Mock {model_name}] I received your message: '{message}'"

    @staticmethod
    def analyze_prompt(prompt: str) -> ModelRecommendation:
        """Analyze a prompt and recommend the best AI model using Gemini"""
        
        # Try using Gemini if API key is available
        if settings.GOOGLE_API_KEY:
            try:
                AIService._init_client()
                model = genai.GenerativeModel('gemini-pro')
                
                system_prompt = """
                Analyze the user's prompt and recommend the best AI model for the task.
                Consider these models:
                1. OpenAI o3 (Code/Complex Logic)
                2. Claude 3.5 Sonnet (Writing/Nuance)
                3. Gemini 1.5 Pro (Data Analysis/Long Context)
                4. GPT-4o (General Purpose)
                
                Return ONLY a valid JSON object with these exact fields:
                {
                    "name": "Model Name",
                    "provider": "Provider Name",
                    "reasoning": "Short explanation why",
                    "input_price": float (cost per 1M tokens),
                    "output_price": float (cost per 1M tokens),
                    "speed": "Fast" | "Medium" | "Slow",
                    "categories": ["Category1", "Category2", "Category3"]
                }
                """
                
                response = model.generate_content(f"{system_prompt}\n\nUser Prompt: {prompt}")
                
                # specific cleanup for potential markdown code blocks in response
                text = response.text.strip()
                if text.startswith("```json"):
                    text = text[7:]
                if text.startswith("```"):
                    text = text[3:]
                if text.endswith("```"):
                    text = text[:-3]
                    
                data = json.loads(text.strip())
                
                return ModelRecommendation(**data)
                
            except Exception as e:
                logger.error(f"Gemini Analysis API failed: {str(e)}", exc_info=True)
                # Fallback to static logic below
        
        prompt_lower = prompt.lower()
        
        # Code-related tasks
        if any(word in prompt_lower for word in ["code", "debug", "programming", "function", "bug", "error"]):
            return ModelRecommendation(
                name="OpenAI o3",
                provider="OpenAI",
                reasoning="Top performer on coding leaderboards with exceptional debugging capabilities. (Fallback recommendation)",
                input_price=2.00,
                output_price=8.00,
                speed="Fast",
                categories=["Code", "Analysis", "Auto"]
            )
        
        # Writing tasks
        if any(word in prompt_lower for word in ["write", "blog", "content", "article", "essay", "email"]):
            return ModelRecommendation(
                name="Claude 3.5 Sonnet",
                provider="Anthropic",
                reasoning="Exceptional writing quality with natural, engaging prose. (Fallback recommendation)",
                input_price=3.00,
                output_price=15.00,
                speed="Fast",
                categories=["Writing", "Creative", "Auto"]
            )
        
        # Data analysis tasks
        if any(word in prompt_lower for word in ["data", "analyze", "analysis", "statistics", "chart", "trend"]):
            return ModelRecommendation(
                name="Gemini 1.5 Pro",
                provider="Google",
                reasoning="Best for data analysis with massive 1M token context window. (Fallback recommendation)",
                input_price=1.25,
                output_price=5.00,
                speed="Fast",
                categories=["Data", "Analysis", "Research"]
            )
        
        # Default recommendation
        return ModelRecommendation(
            name="GPT-4o",
            provider="OpenAI",
            reasoning="The most versatile AI model available. (Fallback recommendation)",
            input_price=2.50,
            output_price=10.00,
            speed="Fast",
            categories=["Auto", "Analysis", "Writing"]
        )
