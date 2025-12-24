from app.schemas.ai import ModelRecommendation


class AIService:
    """Business logic for AI model recommendations"""
    
    @staticmethod
    def analyze_prompt(prompt: str) -> ModelRecommendation:
        """Analyze a prompt and recommend the best AI model"""
        prompt_lower = prompt.lower()
        
        # Code-related tasks
        if any(word in prompt_lower for word in ["code", "debug", "programming", "function", "bug"]):
            return ModelRecommendation(
                name="OpenAI o3",
                provider="OpenAI",
                reasoning="Top performer on coding leaderboards with exceptional debugging capabilities. Excellent for complex bug fixes, code review, and algorithmic problem-solving.",
                input_price=2.00,
                output_price=8.00,
                speed="Fast",
                categories=["Code", "Analysis", "Auto"]
            )
        
        # Writing tasks
        if any(word in prompt_lower for word in ["write", "blog", "content", "article", "essay"]):
            return ModelRecommendation(
                name="Claude 3.5 Sonnet",
                provider="Anthropic",
                reasoning="Exceptional writing quality with natural, engaging prose. Perfect for long-form content, creative writing, and professional communication.",
                input_price=3.00,
                output_price=15.00,
                speed="Fast",
                categories=["Writing", "Creative", "Auto"]
            )
        
        # Data analysis tasks
        if any(word in prompt_lower for word in ["data", "analyze", "analysis", "statistics", "chart"]):
            return ModelRecommendation(
                name="Gemini 1.5 Pro",
                provider="Google",
                reasoning="Best for data analysis with massive 1M token context window. Excellent at processing large datasets and generating actionable insights.",
                input_price=1.25,
                output_price=5.00,
                speed="Fast",
                categories=["Data", "Analysis", "Research"]
            )
        
        # Default recommendation
        return ModelRecommendation(
            name="GPT-4o",
            provider="OpenAI",
            reasoning="The most versatile AI model available. Excellent at a wide range of tasks including conversation, analysis, coding, and creative work.",
            input_price=2.50,
            output_price=10.00,
            speed="Fast",
            categories=["Auto", "Analysis", "Writing"]
        )
