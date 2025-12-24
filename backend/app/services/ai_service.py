from groq import Groq
import google.generativeai as genai
import json
from app.schemas.ai import ModelRecommendation
from app.config.settings import settings
from app.config.logging import logger

class AIService:
    """Smart AI service using Gemini for analysis and Groq for chat"""
    
    _groq_client = None
    _gemini_initialized = False

    @classmethod
    def _init_groq(cls):
        if not cls._groq_client and settings.GROQ_API_KEY:
            cls._groq_client = Groq(api_key=settings.GROQ_API_KEY)

    @classmethod
    def _init_gemini(cls):
        if not cls._gemini_initialized and settings.GOOGLE_API_KEY:
            genai.configure(api_key=settings.GOOGLE_API_KEY)
            cls._gemini_initialized = True

    @staticmethod
    def chat_with_model(message: str, model_name: str, history: list = None) -> str:
        """Chat using Groq (fast and conversational)"""
        
        if settings.GROQ_API_KEY:
            try:
                AIService._init_groq()
                
                messages = [
                    {"role": "system", "content": f"You are {model_name}. Respond naturally and helpfully."},
                    {"role": "user", "content": message}
                ]
                
                response = AIService._groq_client.chat.completions.create(
                    model="llama-3.1-8b-instant",
                    messages=messages,
                    temperature=0.7,
                    max_tokens=1024
                )
                
                return response.choices[0].message.content
                
            except Exception as e:
                logger.error(f"Groq Chat failed: {str(e)}", exc_info=True)
                return f"Chat temporarily unavailable: {str(e)}"
        
        return f"[{model_name}] Chat unavailable - no API key configured."

    @staticmethod
    def analyze_prompt(prompt: str) -> ModelRecommendation:
        """Analyze using Gemini (best for structured JSON)"""
        
        # Try Gemini first (better at structured output)
        if settings.GOOGLE_API_KEY:
            try:
                AIService._init_gemini()
                model = genai.GenerativeModel('gemini-pro')
                
                system_prompt = """You are an AI model expert. Recommend ONE best model for the user's task.

Return ONLY valid JSON (no markdown):
{
    "name": "Model Name",
    "provider": "Provider",
    "reasoning": "One sentence why (under 15 words)",
    "input_price": 2.5,
    "output_price": 10.0,
    "speed": "Fast",
    "categories": ["Category1", "Category2"]
}

Models:
- OpenAI o3: Best for code/debugging
- Claude 3.5 Sonnet: Best for writing/content
- Gemini 1.5 Pro: Best for data/research
- GPT-4o: Best for general tasks"""

                response = model.generate_content(f"{system_prompt}\n\nTask: {prompt}")
                text = response.text.strip()
                
                # Clean markdown
                if text.startswith("```json"):
                    text = text[7:]
                if text.startswith("```"):
                    text = text[3:]
                if text.endswith("```"):
                    text = text[:-3]
                    
                data = json.loads(text.strip())
                return ModelRecommendation(**data)
                
            except Exception as e:
                logger.error(f"Gemini Analysis failed: {str(e)}", exc_info=True)
                # Fall through to Groq backup
        
        # Groq backup if Gemini fails
        if settings.GROQ_API_KEY:
            try:
                AIService._init_groq()
                
                system_prompt = """Recommend ONE best AI model. Return ONLY JSON:
{"name": "Model", "provider": "Provider", "reasoning": "Short reason", "input_price": 2.5, "output_price": 10.0, "speed": "Fast", "categories": ["Cat1", "Cat2"]}

Models: OpenAI o3 (code), Claude 3.5 Sonnet (writing), Gemini 1.5 Pro (data), GPT-4o (general)"""
                
                response = AIService._groq_client.chat.completions.create(
                    model="llama-3.1-8b-instant",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": f"Task: {prompt}"}
                    ],
                    temperature=0.3,
                    max_tokens=256
                )
                
                text = response.choices[0].message.content.strip()
                if text.startswith("```json"):
                    text = text[7:]
                if text.startswith("```"):
                    text = text[3:]
                if text.endswith("```"):
                    text = text[:-3]
                    
                data = json.loads(text.strip())
                return ModelRecommendation(**data)
                
            except Exception as e:
                logger.error(f"Groq Analysis failed: {str(e)}", exc_info=True)
        
        # Fallback to keyword matching
        prompt_lower = prompt.lower()
        
        if any(word in prompt_lower for word in ["code", "debug", "programming", "function", "bug"]):
            return ModelRecommendation(
                name="OpenAI o3",
                provider="OpenAI",
                reasoning="Top coding AI with exceptional debugging.",
                input_price=2.00,
                output_price=8.00,
                speed="Fast",
                categories=["Code", "Auto"]
            )
        
        if any(word in prompt_lower for word in ["write", "blog", "content", "article", "essay"]):
            return ModelRecommendation(
                name="Claude 3.5 Sonnet",
                provider="Anthropic",
                reasoning="Best writing quality and natural prose.",
                input_price=3.00,
                output_price=15.00,
                speed="Fast",
                categories=["Writing", "Creative"]
            )
        
        if any(word in prompt_lower for word in ["data", "analyze", "analysis", "statistics", "chart"]):
            return ModelRecommendation(
                name="Gemini 1.5 Pro",
                provider="Google",
                reasoning="Best for data with 1M token context.",
                input_price=1.25,
                output_price=5.00,
                speed="Fast",
                categories=["Data", "Analysis"]
            )
        
        return ModelRecommendation(
            name="GPT-4o",
            provider="OpenAI",
            reasoning="Most versatile AI for any task.",
            input_price=2.50,
            output_price=10.00,
            speed="Fast",
            categories=["Auto", "General"]
        )
