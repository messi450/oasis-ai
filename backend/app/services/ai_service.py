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
                
                # Define the Persona based on User Request
                system_persona = """You are an AI assistant designed to embody three core archetypes:
1. The Warm Coach: Supportive, encouraging, and calm. Give gentle accountability without being harsh.
2. The Reliable Expert: Concise, accurate, and structured. But don't ask questions that are not relevant to the task. Ask one or two question, and try to make conversation easy.Do not hallucinate confidently.
3. The Friendly Companion: Casual tone, remember context, and make conversation easy. Avoid excessive flattery.

CRITICAL INSTRUCTION: Be SHORT and DIRECT. Avoid lengthy preambles. Get straight to the point."""

                messages = [
                    {"role": "system", "content": f"You are {model_name}. {system_persona}"},
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
    def analyze_prompt(prompt: str) -> dict:
        """Analyze using Perplexity (God Mode AI Expert with real-time knowledge)"""
        
        # Try Perplexity first (has live knowledge of ALL AI models)
        if settings.PERPLEXITY_API_KEY:
            try:
                import requests
                
                logger.info("🔍 Using Perplexity for model analysis...")
                
                system_prompt = """You are the world's leading AI Model Expert with real-time knowledge of EVERY AI model and tool available.

Your goal: Recommend the absolute perfect AI model for the user's specific request.

RULES:
1. Analyze the prompt depth, required reasoning, creativity, and technical needs.
2. Select the "Main" model that is the current STATE-OF-THE-ART for that specific task.
3. Select an "Alternative" that offers a different strength (speed, privacy, cost).
4. Use your REAL-TIME KNOWLEDGE. If o3 or Claude 3.7 just launched, recommend it!
5. Be SPECIFIC about why each model excels.

Return ONLY valid JSON (no markdown):
{
    "main": {
        "name": "Model Name",
        "provider": "Provider",
        "reasoning": "Specific reason why this model excels (under 15 words)",
        "subtitle": "Short 2-3 word role (e.g. 'Coding Expert')",
        "input_price": 0.0,
        "output_price": 0.0,
        "speed": "Fast",
        "categories": ["Cat1"]
    },
    "alternative": {
        "name": "Model Name",
        "provider": "Provider",
        "reasoning": "Why this is a strong alternative (under 15 words)",
        "subtitle": "Short 2-3 word role",
        "input_price": 0.0,
        "output_price": 0.0,
        "speed": "Fast",
        "categories": ["Cat1"]
    }
}"""

                response = requests.post(
                    "https://api.perplexity.ai/chat/completions",
                    headers={
                        "Authorization": f"Bearer {settings.PERPLEXITY_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "sonar",
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": f"Task: {prompt}"}
                        ],
                        "temperature": 0.2,
                        "max_tokens": 800
                    },
                    timeout=30
                )
                
                response.raise_for_status()
                text = response.json()["choices"][0]["message"]["content"].strip()
                
                logger.info(f"Perplexity raw response: {text[:200]}...")
                
                # Clean markdown
                if text.startswith("```json"):
                    text = text[7:]
                if text.startswith("```"):
                    text = text[3:]
                if text.endswith("```"):
                    text = text[:-3]
                    
                data = json.loads(text.strip())
                
                logger.info("✅ Perplexity successfully generated recommendations!")
                
                return {
                    "recommendation": ModelRecommendation(**data['main']),
                    "alternative": ModelRecommendation(**data['alternative'])
                }
                
            except Exception as e:
                logger.error(f"Perplexity Analysis failed: {str(e)}", exc_info=True)
                # Fall through to Gemini backup
        
        # Gemini backup (paused by user)
        if False and settings.GOOGLE_API_KEY:
            try:
                AIService._init_gemini()
                model = genai.GenerativeModel('gemini-pro')
                
                system_prompt = """You are the world's leading AI Model Expert. You have deep knowledge of EVERY AI model available (OpenAI, Anthropic, Google, Meta, open-source, specialized models, etc.).

Your goal is to recommend the absolute perfect tool for the user's specific request.

RULES:
1. Analyze the prompt depth, required reasoning, creativity, and technical needs.
2. Select the "Main" model that is the current STATE-OF-THE-ART for that specific task.
3. Select an "Alternative" that offers a different strength (e.g., speed, privacy, open-source, lower cost).
4. Do NOT simply recommend GPT-4 every time. Consider Claude 3.5 Sonnet for coding, Midjourney v6 for art, Gemini 1.5 Pro for large context, etc.

Return ONLY valid JSON (no markdown):
{
    "main": {
        "name": "Model Name",
        "provider": "Provider",
        "reasoning": "Specific reason why this model excels at this exact task (under 15 words)",
        "subtitle": "Short 2-3 word role (e.g. 'Coding Expert')",
        "input_price": 0.0,
        "output_price": 0.0,
        "speed": "Fast",
        "categories": ["Cat1"]
    },
    "alternative": {
        "name": "Model Name",
        "provider": "Provider",
        "reasoning": "Why this is a strong alternative (under 15 words)",
        "subtitle": "Short 2-3 word role",
        "input_price": 0.0,
        "output_price": 0.0,
        "speed": "Fast",
        "categories": ["Cat1"]
    }
}"""

                response = model.generate_content(f"{system_prompt}\n\nTask: {prompt}")
                text = response.text.strip()
                
                logger.info(f"Gemini raw response: {text[:200]}...")  # Log first 200 chars
                
                # Clean markdown
                if text.startswith("```json"):
                    text = text[7:]
                if text.startswith("```"):
                    text = text[3:]
                if text.endswith("```"):
                    text = text[:-3]
                    
                data = json.loads(text.strip())
                
                logger.info("✅ Gemini successfully generated recommendations!")
                
                return {
                    "recommendation": ModelRecommendation(**data['main']),
                    "alternative": ModelRecommendation(**data['alternative'])
                }
                
                
            except Exception as e:
                logger.error(f"Gemini Analysis failed: {str(e)}", exc_info=True)
                # Fall through to Groq backup
        
        # Groq backup if Gemini fails
        logger.warning("⚠️ Falling back to Groq for analysis (Gemini failed)")
        if settings.GROQ_API_KEY:
            try:
                AIService._init_groq()
                
                system_prompt = """Recommend TWO models (Best and Alternative). Return ONLY JSON:
{
    "main": {"name": "M1", "provider": "P1", "reasoning": "R1", "input_price": 0, "output_price": 0, "speed": "Fast", "categories": ["C1"]},
    "alternative": {"name": "M2", "provider": "P2", "reasoning": "R2", "input_price": 0, "output_price": 0, "speed": "Fast", "categories": ["C1"]}
}"""
                
                response = AIService._groq_client.chat.completions.create(
                    model="llama-3.1-8b-instant",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": f"Task: {prompt}"}
                    ],
                    temperature=0.3,
                    max_tokens=512
                )
                
                text = response.choices[0].message.content.strip()
                if text.startswith("```json"):
                    text = text[7:]
                if text.startswith("```"):
                    text = text[3:]
                if text.endswith("```"):
                    text = text[:-3]
                    
                data = json.loads(text.strip())
                logger.info("✅ Groq successfully generated recommendations!")
                return {
                    "recommendation": ModelRecommendation(**data['main']),
                    "alternative": ModelRecommendation(**data['alternative'])
                }
                
            except Exception as e:
                logger.error(f"Groq Analysis failed: {str(e)}", exc_info=True)
        
        # Fallback to local expert knowledge base
        logger.warning("Using local expert knowledge base for recommendation")
        return AIService.get_ai_recommendation(prompt)
    
    @staticmethod
    def get_ai_recommendation(prompt: str) -> dict:
        """
        AI model recommendation system based on keywords from a data file.
        """
        import json
        import os
        import re
        from app.schemas.ai import ModelRecommendation

        prompt_lower = prompt.lower()
        
        # Load recommendations from JSON
        data_path = os.path.join(os.path.dirname(__file__), "..", "data", "recommendations.json")
        try:
            with open(data_path, 'r', encoding='utf-8') as f:
                rec_data = json.load(f)
        except Exception as e:
            logger.error(f"Failed to load recommendations: {e}")
            rec_data = []

        main_rec = None
        alt_rec = None
        
        # Keyword matching loop
        for category in rec_data:
            keywords = category.get("keywords", [])
            if any(re.search(r'\b' + re.escape(w.lower()) + r'\b', prompt_lower) for w in keywords):
                if "main_rec" in category:
                    main_rec = ModelRecommendation(**category["main_rec"])
                if "alt_rec" in category:
                    alt_rec = ModelRecommendation(**category["alt_rec"])
                break

        # Fallback if no match found
        if not main_rec:
            main_rec = ModelRecommendation(
                name="GPT-4o", provider="OpenAI",
                reasoning="Most versatile AI for any task.",
                subtitle="General purpose AI",
                input_price=2.50, output_price=10.00, speed="Fast",
                categories=["Auto", "General"]
            )
            alt_rec = ModelRecommendation(
                name="Claude 3.5 Sonnet", provider="Anthropic",
                reasoning="Slightly better reasoning for nuanced chat.",
                subtitle="Conversational Expert",
                input_price=3.00, output_price=15.00, speed="Fast",
                categories=["General", "Logic"]
            )

        return {
            "recommendation": main_rec,
            "alternative": alt_rec
        }
    
    @staticmethod
    def monitor_chat_context(messages: list, current_model: str) -> dict:
        """
        Gemini Observer: Monitors chat history for context shifts and suggests model switches.
        """
        # Gemini Observer paused by user request
        return {"should_switch": False}
        
        if not settings.GOOGLE_API_KEY:
            return {"should_switch": False}
            
        try:
            AIService._init_gemini()
            model = genai.GenerativeModel('gemini-pro')
            
            # Build conversation context
            conversation_summary = "\n".join([
                f"{'User' if msg.get('role') == 'user' else 'AI'}: {msg.get('content', '')[:150]}"
                for msg in messages[-6:]  # Last 6 messages
            ])
            
            observer_prompt = f"""You are a silent AI observer monitoring a chat conversation.

Current Active Model: {current_model}

Recent Conversation:
{conversation_summary}

TASK: Determine if the user's intent has SHIFTED to a different domain that would benefit from a DIFFERENT AI model.

Examples of shifts:
- Started with coding, now asking about travel → Recommend general model
- Started with general chat, now asking for image generation → Recommend Midjourney
- Started with writing, now asking complex math → Recommend o1

Return ONLY JSON:
{{
    "should_switch": true/false,
    "suggested_model": "Model Name" (only if should_switch is true),
    "provider": "Provider" (only if should_switch is true),
    "reason": "Brief explanation why" (only if should_switch is true),
    "subtitle": "Role" (only if should_switch is true)
}}

If NO switch needed, return: {{"should_switch": false}}
"""
            
            response = model.generate_content(observer_prompt)
            text = response.text.strip()
            
            # Clean markdown
            if text.startswith("```json"):
                text = text[7:]
            if text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
                
            result = json.loads(text.strip())
            
            if result.get("should_switch"):
                logger.info(f"🔄 Gemini Observer detected context shift: {result.get('reason')}")
            
            return result
            
        except Exception as e:
            logger.error(f"Gemini Observer failed: {str(e)}", exc_info=True)
            return {"should_switch": False}
