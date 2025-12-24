from groq import Groq
import json
from app.schemas.ai import ModelRecommendation
from app.config.settings import settings
from app.config.logging import logger

class AIService:
    """Business logic for AI model recommendations using Groq"""
    
    _client = None

    @classmethod
    def _init_client(cls):
        if not cls._client and settings.GROQ_API_KEY:
            cls._client = Groq(api_key=settings.GROQ_API_KEY)

    @staticmethod
    def chat_with_model(message: str, model_name: str, history: list = None) -> str:
        """Chat with the selected AI model using Groq"""
        
        if settings.GROQ_API_KEY:
            try:
                AIService._init_client()
                
                # Build messages for Groq
                messages = [
                    {"role": "system", "content": f"You are acting as {model_name}. Please respond to the user accordingly."},
                    {"role": "user", "content": message}
                ]
                
                response = AIService._client.chat.completions.create(
                    model="llama-3.1-8b-instant",
                    messages=messages,
                    temperature=0.7,
                    max_tokens=1024
                )
                
                return response.choices[0].message.content
                
            except Exception as e:
                logger.error(f"Groq Chat API failed: {str(e)}", exc_info=True)
                return f"Error connecting to AI: {str(e)}"
        
        # Mock fallback if no key
        return f"[Mock {model_name}] I received your message: '{message}'"

    @staticmethod
    def analyze_prompt(prompt: str) -> ModelRecommendation:
        """Analyze a prompt and recommend the best AI model using Groq"""
        
        # Try using Groq if API key is available
        if settings.GROQ_API_KEY:
            try:
                AIService._init_client()
                
                system_prompt = """You are an AI model recommendation expert. Analyze the user's prompt and recommend ONE best AI model.

Return ONLY valid JSON (no markdown, no extra text):
{
    "name": "Model Name",
    "provider": "Provider Name", 
    "reasoning": "One short sentence explaining why this is the best choice.",
    "input_price": 2.5,
    "output_price": 10.0,
    "speed": "Fast",
    "categories": ["Category1", "Category2"]
}

Available models:
- OpenAI o3 (best for code/debugging)
- Claude 3.5 Sonnet (best for writing/content)
- Gemini 1.5 Pro (best for data analysis/research)
- GPT-4o (best for general tasks)

Keep reasoning under 15 words. Be direct."""
                
                response = AIService._client.chat.completions.create(
                    model="llama-3.1-8b-instant",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": f"User Prompt: {prompt}"}
                    ],
                    temperature=0.3,
                    max_tokens=512
                )
                
                text = response.choices[0].message.content.strip()
                
                # Clean up markdown code blocks if present
                if text.startswith("```json"):
                    text = text[7:]
                if text.startswith("```"):
                    text = text[3:]
                if text.endswith("```"):
                    text = text[:-3]
                    
                data = json.loads(text.strip())
                
                return ModelRecommendation(**data)
                
            except Exception as e:
                logger.error(f"Groq Analysis API failed: {str(e)}", exc_info=True)
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
