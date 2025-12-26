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
                    timeout=10
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
                print("\n\n>>>>>>>>>> PERPLEXITY IS CONFIRMED WORKING AND USED <<<<<<<<<<\n\n")
                
                return {
                    "recommendation": ModelRecommendation(**data['main']),
                    "alternative": ModelRecommendation(**data['alternative'])
                }
                
            except Exception as e:
                logger.error(f"Perplexity Analysis failed: {str(e)}", exc_info=True)
                # Fall through to Gemini backup
        
        # Gemini backup if Perplexity fails
        if settings.GOOGLE_API_KEY:
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
        Extended AI model recommendation system covering 100+ specialized AI models
        across all major categories with comprehensive keyword matching.
        """
        prompt_lower = prompt.lower()
        main_rec = None
        alt_rec = None
        
        # CODING & DEVELOPMENT (Enhanced with all coding tools)
        if any(word in prompt_lower for word in [
            "code", "debug", "programming", "python", "javascript", "react", "bug", "function",
            "algorithm", "software", "developer", "coding", "script", "typescript", "java",
            "c++", "golang", "rust", "backend", "frontend", "fullstack", "api", "refactor",
            "optimization", "compiler", "syntax", "repository", "git", "pull request", "commit",
            "codebase", "ide", "autocomplete", "linter", "testing", "unit test", "integration",
            "swe-bench", "software engineering", "devops", "ci/cd", "deployment"
        ]):
            main_rec = ModelRecommendation(
                name="Claude Sonnet 4.5", provider="Anthropic",
                reasoning="Absolute king of coding with 77.2% SWE-Bench score. Best for autonomous coding, refactoring, and multi-file projects.",
                subtitle="Coding Champion 2025",
                input_price=3.00, output_price=15.00, speed="Fast",
                categories=["Code", "Logic", "Autonomous", "Best-in-Class"],
            )
            alt_rec = ModelRecommendation(
                name="GitHub Copilot", provider="Microsoft/OpenAI",
                reasoning="Most popular coding assistant with 70+ language support and seamless IDE integration.",
                subtitle="Universal Code Assistant",
                input_price=10.00, output_price=0.00, speed="Instant",
                categories=["Code", "Popular", "IDE-Native"]
            )
        
        # MATH & SCIENCE (Advanced reasoning models)
        elif any(word in prompt_lower for word in [
            "math", "mathematics", "calculation", "formula", "equation", "algebra", "calculus",
            "geometry", "trigonometry", "statistics", "probability", "theorem", "proof",
            "physics", "chemistry", "science", "scientific", "research", "aime", "olympiad",
            "derivative", "integral", "matrix", "vector", "differential", "logarithm",
            "exponential", "polynomial", "complex numbers", "linear algebra", "topology",
            "number theory", "combinatorics", "graph theory", "optimization problem"
        ]):
            main_rec = ModelRecommendation(
                name="Gemini 3 Pro", provider="Google",
                reasoning="95.0% on AIME 2025. Best for visual geometry and complex mathematical reasoning with massive context.",
                subtitle="Math & Science Leader",
                input_price=1.25, output_price=5.00, speed="Fast",
                categories=["Math", "Science", "Reasoning", "Visual"],
                # benchmark="AIME 2025: 95.0%",
                # context_length="1M tokens"
            )
            alt_rec = ModelRecommendation(
                name="DeepSeek-R1", provider="DeepSeek",
                reasoning="87.5% on AIME 2025. Most cost-efficient reasoning model with exceptional mathematical capabilities.",
                subtitle="Budget Math Expert",
                input_price=0.14, output_price=0.28, speed="Very Fast",
                categories=["Math", "Value", "Open-Source", "Reasoning"],
                # benchmark="AIME 2025: 87.5%"
            )
        
        # IMAGE GENERATION (All image models)
        elif any(word in prompt_lower for word in [
            "image", "picture", "photo", "illustration", "art", "artwork", "drawing", "painting",
            "sketch", "render", "visual", "graphic", "design", "logo", "icon", "banner",
            "poster", "wallpaper", "character design", "concept art", "fantasy", "realistic",
            "photorealistic", "anime", "cartoon", "3d render", "digital art", "portrait",
            "landscape", "abstract", "creative image", "generate image", "ai art", "dalle",
            "midjourney", "stable diffusion", "flux", "image quality", "upscale", "enhance"
        ]):
            main_rec = ModelRecommendation(
                name="Flux 1 Pro Ultra", provider="Black Forest Labs",
                reasoning="Premium image quality with exceptional detail and instruction-following. Industry-leading photorealism.",
                subtitle="Premium Image Generator",
                input_price=0.00, output_price=0.00, speed="Medium",
                categories=["Image", "Premium", "Photorealistic", "Detail"]
            )
            alt_rec = ModelRecommendation(
                name="Midjourney v6.1", provider="Midjourney",
                reasoning="Industry standard for creative and artistic images with unbeatable aesthetics.",
                subtitle="Creative Visual Artist",
                input_price=0.00, output_price=0.00, speed="Medium",
                categories=["Image", "Art", "Creative", "Popular"]
            )
        
        # VIDEO GENERATION (Comprehensive video models)
        elif any(word in prompt_lower for word in [
            "video", "clip", "footage", "movie", "film", "animation", "motion", "cinematic",
            "edit", "editing", "visual effects", "vfx", "sora", "runway", "video generation",
            "text to video", "video ai", "storytelling", "scene", "shot", "camera movement",
            "8k", "4k", "1080p", "fps", "frame", "render video", "youtube", "tiktok",
            "short video", "long video", "video content", "video production", "director"
        ]):
            main_rec = ModelRecommendation(
                name="Veo 3.1", provider="Google",
                reasoning="Cinematic leader with 8K resolution and native audio. Best overall video quality in 2025.",
                subtitle="Cinematic Video King",
                input_price=0.00, output_price=0.00, speed="Slow",
                categories=["Video", "Cinematic", "8K", "Audio", "Best-Quality"]
            )
            alt_rec = ModelRecommendation(
                name="Sora 2", provider="OpenAI",
                reasoning="Long coherent storytelling with synchronized audio. Best for narrative-driven content.",
                subtitle="Story Video Creator",
                input_price=0.00, output_price=0.00, speed="Medium",
                categories=["Video", "Storytelling", "Audio", "Narrative"]
            )
        
        # TEXT-TO-SPEECH (Voice synthesis models)
        elif any(word in prompt_lower for word in [
            "text to speech", "tts", "voice", "speech synthesis", "narration", "voiceover",
            "audio", "speak", "pronunciation", "voice clone", "voice generation", "natural voice",
            "podcast", "audiobook", "read aloud", "text reader", "voice ai", "speech generation",
            "multilingual voice", "accent", "intonation", "prosody", "voice quality", "latency"
        ]):
            main_rec = ModelRecommendation(
                name="Fish Speech V1.5", provider="Fish Audio",
                reasoning="ELO score 1339. Best multilingual TTS with exceptional voice quality and naturalness.",
                subtitle="Voice Excellence",
                input_price=0.00, output_price=0.00, speed="Fast",
                categories=["TTS", "Voice", "Multilingual", "Quality"],
                # benchmark="ELO: 1339"
            )
            alt_rec = ModelRecommendation(
                name="CosyVoice2-0.5B", provider="Alibaba",
                reasoning="Ultra-low latency at 150ms. Perfect for real-time applications and interactive voice.",
                subtitle="Real-Time Voice",
                input_price=0.00, output_price=0.00, speed="Instant",
                categories=["TTS", "Real-Time", "Low-Latency", "Speed"]
            )
        
        # SPEECH-TO-TEXT (Voice recognition models)
        elif any(word in prompt_lower for word in [
            "speech to text", "stt", "transcription", "transcribe", "voice recognition",
            "speech recognition", "audio to text", "dictation", "voice input", "whisper",
            "meeting transcription", "interview transcription", "podcast transcription",
            "subtitle", "caption", "closed caption", "multilingual transcription", "accuracy",
            "word error rate", "wer", "real-time transcription", "live transcription"
        ]):
            main_rec = ModelRecommendation(
                name="Canary Qwen 2.5B", provider="NVIDIA",
                reasoning="Tops leaderboard at 5.63% WER. Best accuracy for speech-to-text in 2025.",
                subtitle="Transcription Champion",
                input_price=0.00, output_price=0.00, speed="Fast",
                categories=["STT", "Accuracy", "Best-in-Class"],
                # benchmark="WER: 5.63%"
            )
            alt_rec = ModelRecommendation(
                name="Whisper Large V3", provider="OpenAI",
                reasoning="Multilingual gold standard with 99+ languages. Most versatile transcription model.",
                subtitle="Universal Transcriber",
                input_price=0.00, output_price=0.00, speed="Fast",
                categories=["STT", "Multilingual", "Versatile", "Popular"]
            )
        
        # MUSIC GENERATION (Audio creation models)
        elif any(word in prompt_lower for word in [
            "music", "song", "audio", "sound", "melody", "composition", "beat", "track",
            "instrumental", "background music", "soundtrack", "jingle", "loop", "rhythm",
            "classical music", "electronic music", "pop music", "jazz", "rock", "ambient",
            "music generation", "audio generation", "music ai", "compose", "produce music",
            "royalty free", "music production", "dj", "remix", "mixing"
        ]):
            main_rec = ModelRecommendation(
                name="Soundverse", provider="Soundverse",
                reasoning="Top-rated AI music generator of 2025. Best overall quality and versatility.",
                subtitle="Music Generation Leader",
                input_price=0.00, output_price=0.00, speed="Medium",
                categories=["Music", "Audio", "Best-Rated", "Versatile"]
            )
            alt_rec = ModelRecommendation(
                name="Suno", provider="Suno",
                reasoning="Symbolic music generation with excellent looping tracks. Great for creative exploration.",
                subtitle="Creative Music AI",
                input_price=0.00, output_price=0.00, speed="Fast",
                categories=["Music", "Looping", "Creative", "Symbolic"]
            )
        
        # TRANSLATION (Language models)
        elif any(word in prompt_lower for word in [
            "translate", "translation", "language", "multilingual", "spanish", "french",
            "german", "chinese", "japanese", "korean", "arabic", "russian", "portuguese",
            "italian", "hindi", "localization", "l10n", "i18n", "internationalization",
            "interpret", "bilingual", "foreign language", "language conversion", "linguistic"
        ]):
            main_rec = ModelRecommendation(
                name="GPT-4.5 (preview)", provider="OpenAI",
                reasoning="Top translation quality across all domains with exceptional nuance and context preservation.",
                subtitle="Universal Translator",
                input_price=2.50, output_price=10.00, speed="Fast",
                categories=["Translation", "Multilingual", "Quality", "Universal"]
            )
            alt_rec = ModelRecommendation(
                name="Qwen 3 235B", provider="Alibaba",
                reasoning="Multilingual powerhouse supporting 100+ languages with excellent open-weight performance.",
                subtitle="Massive Language Support",
                input_price=0.00, output_price=0.00, speed="Fast",
                categories=["Translation", "100+ Languages", "Open-Source", "Multilingual"]
            )
        
        # WRITING & CONTENT CREATION (Enhanced)
        elif any(word in prompt_lower for word in [
            "write", "writing", "blog", "article", "essay", "content", "copywriting", "copy",
            "creative writing", "story", "novel", "script", "screenplay", "dialogue", "narrative",
            "prose", "paragraph", "composition", "author", "journalist", "editor", "draft",
            "marketing copy", "ad copy", "email", "newsletter", "press release", "whitepaper",
            "technical writing", "documentation", "user guide", "tutorial", "how-to", "seo",
            "content strategy", "blog post", "long-form", "short-form", "headline", "tagline"
        ]):
            main_rec = ModelRecommendation(
                name="Claude Sonnet 4.5", provider="Anthropic",
                reasoning="Best natural prose and human-like writing style. Exceptional for creative and technical content.",
                subtitle="Master Writer",
                input_price=3.00, output_price=15.00, speed="Fast",
                categories=["Writing", "Creative", "Professional", "Natural"]
            )
            alt_rec = ModelRecommendation(
                name="Claude Opus 4.1", provider="Anthropic",
                reasoning="Most creative and nuanced responses. Perfect for artistic and sophisticated writing.",
                subtitle="Creative Excellence",
                input_price=15.00, output_price=75.00, speed="Medium",
                categories=["Writing", "Creative", "Nuanced", "Premium"]
            )
        
        # DATA ANALYSIS & STATISTICS
        elif any(word in prompt_lower for word in [
            "data", "analyze", "analysis", "analytics", "statistics", "stats", "csv", "excel",
            "spreadsheet", "dataset", "data science", "machine learning", "pandas", "numpy",
            "visualization", "graph", "chart", "plot", "dashboard", "business intelligence",
            "bi", "metrics", "kpi", "insights", "trends", "correlation", "regression",
            "forecasting", "prediction", "model", "big data", "sql", "query", "database"
        ]):
            main_rec = ModelRecommendation(
                name="Gemini 3 Pro", provider="Google",
                reasoning="Massive 1M token context window handles giant datasets effortlessly. Best for comprehensive data analysis.",
                subtitle="Data Analysis Expert",
                input_price=1.25, output_price=5.00, speed="Fast",
                categories=["Data", "Analytics", "Large-Context", "Insights"],
                # context_length="1M tokens"
            )
            alt_rec = ModelRecommendation(
                name="Claude Sonnet 4.5", provider="Anthropic",
                reasoning="Best for statistics with Python integration. Excellent for complex analytical tasks.",
                subtitle="Statistical Analysis",
                input_price=3.00, output_price=15.00, speed="Fast",
                categories=["Data", "Statistics", "Python", "Analysis"]
            )
        
        # OCR & DOCUMENT PROCESSING
        elif any(word in prompt_lower for word in [
            "ocr", "optical character recognition", "scan", "document", "pdf", "text extraction",
            "handwriting", "handwritten", "receipt", "invoice", "form", "document processing",
            "table extraction", "layout analysis", "document understanding", "text recognition",
            "digitize", "scanned document", "image to text", "extract text", "read document"
        ]):
            main_rec = ModelRecommendation(
                name="ABBYY FineReader", provider="ABBYY",
                reasoning="Best overall OCR quality supporting 198 languages with exceptional accuracy.",
                subtitle="OCR Industry Leader",
                input_price=0.00, output_price=0.00, speed="Fast",
                categories=["OCR", "Document", "198 Languages", "Premium"]
            )
            alt_rec = ModelRecommendation(
                name="GPT-4.1 Vision", provider="OpenAI",
                reasoning="85% accuracy including handwriting recognition with strong document understanding.",
                subtitle="AI-Powered OCR",
                input_price=2.50, output_price=10.00, speed="Fast",
                categories=["OCR", "AI", "Handwriting", "Understanding"]
            )
        
        # AI AGENTS & AUTOMATION
        elif any(word in prompt_lower for word in [
            "automation", "workflow", "agent", "ai agent", "autonomous", "orchestration",
            "integration", "zapier", "make", "n8n", "rpa", "robotic process automation",
            "task automation", "business process", "enterprise automation", "bot", "chatbot",
            "virtual assistant", "scheduling", "trigger", "action", "webhook", "api integration"
        ]):
            main_rec = ModelRecommendation(
                name="GenFuse AI", provider="GenFuse",
                reasoning="Natural language workflow builder. Most intuitive AI agent creation platform in 2025.",
                subtitle="Workflow Builder",
                input_price=0.00, output_price=0.00, speed="Fast",
                categories=["Automation", "Agents", "No-Code", "Workflows"]
            )
            alt_rec = ModelRecommendation(
                name="Zapier", provider="Zapier",
                reasoning="Industry standard with 6,000+ app integrations. Most comprehensive automation ecosystem.",
                subtitle="Integration Champion",
                input_price=0.00, output_price=0.00, speed="Fast",
                categories=["Automation", "Integration", "Popular", "6000+ Apps"]
            )
        
        # EMBEDDINGS & SEARCH
        elif any(word in prompt_lower for word in [
            "embedding", "embeddings", "vector", "semantic search", "similarity", "rag",
            "retrieval", "search", "vector database", "vector search", "document retrieval",
            "information retrieval", "context retrieval", "knowledge base", "semantic",
            "cosine similarity", "dense retrieval", "sparse retrieval", "hybrid search"
        ]):
            main_rec = ModelRecommendation(
                name="Voyage-3-large", provider="Voyage AI",
                reasoning="Top relevance ranking in 2025. Best-in-class for semantic search and RAG applications.",
                subtitle="Embedding Excellence",
                input_price=0.00, output_price=0.00, speed="Fast",
                categories=["Embeddings", "Search", "RAG", "Best-Ranked"]
            )
            alt_rec = ModelRecommendation(
                name="OpenAI text-embedding-3-large", provider="OpenAI",
                reasoning="37.27% enterprise adoption. Most widely deployed embedding model with proven reliability.",
                subtitle="Enterprise Standard",
                input_price=0.13, output_price=0.00, speed="Instant",
                categories=["Embeddings", "Enterprise", "Reliable", "Popular"]
            )
        
        # SUMMARIZATION
        elif any(word in prompt_lower for word in [
            "summarize", "summary", "summarization", "brief", "tldr", "digest", "abstract",
            "executive summary", "key points", "highlights", "recap", "synopsis", "overview",
            "condense", "shorten", "extract", "main points", "gist", "essence"
        ]):
            main_rec = ModelRecommendation(
                name="Qwen3-30B-A3B-Instruct", provider="Alibaba",
                reasoning="Long-document processing excellence. Best for comprehensive summarization of large texts.",
                subtitle="Long-Form Summarizer",
                input_price=0.00, output_price=0.00, speed="Fast",
                categories=["Summarization", "Long-Context", "Excellence"]
            )
            alt_rec = ModelRecommendation(
                name="GLM-4.5V", provider="Zhipu AI",
                reasoning="Multimodal content summarization. Perfect for documents with images and complex layouts.",
                subtitle="Multimodal Summarizer",
                input_price=0.00, output_price=0.00, speed="Fast",
                categories=["Summarization", "Multimodal", "Visual"]
            )
        
        # SENTIMENT ANALYSIS
        elif any(word in prompt_lower for word in [
            "sentiment", "emotion", "feeling", "mood", "tone", "opinion", "attitude",
            "sentiment analysis", "emotion detection", "opinion mining", "social listening",
            "brand monitoring", "customer feedback", "review analysis", "positive", "negative",
            "neutral", "emotional intelligence", "affect", "polarity"
        ]):
            main_rec = ModelRecommendation(
                name="GPT-4.2", provider="OpenAI",
                reasoning="Best emotional reasoning accuracy. Most sophisticated understanding of nuanced sentiment.",
                subtitle="Emotion Expert",
                input_price=2.50, output_price=10.00, speed="Fast",
                categories=["Sentiment", "Emotion", "Accuracy", "Nuanced"]
            )
            alt_rec = ModelRecommendation(
                name="Brandwatch Cortex", provider="Brandwatch",
                reasoning="88% accuracy with specialized social media monitoring capabilities.",
                subtitle="Social Sentiment",
                input_price=0.00, output_price=0.00, speed="Fast",
                categories=["Sentiment", "Social-Media", "Monitoring", "88% Accuracy"]
            )
        
        # QUESTION ANSWERING & CHATBOTS
        elif any(word in prompt_lower for word in [
            "question answering", "qa", "chatbot", "chat", "conversation", "conversational ai",
            "customer service", "support", "helpdesk", "faq", "knowledge base", "assistant",
            "dialogue", "interactive", "response", "answer", "query", "information retrieval"
        ]):
            main_rec = ModelRecommendation(
                name="Copilot.Live", provider="Microsoft",
                reasoning="Real-time high-accuracy responses with enterprise-grade reliability.",
                subtitle="QA Excellence",
                input_price=0.00, output_price=0.00, speed="Instant",
                categories=["QA", "Chatbot", "Real-Time", "Enterprise"]
            )
            alt_rec = ModelRecommendation(
                name="IBM Watson", provider="IBM",
                reasoning="Robust NLP and sentiment analysis with proven enterprise deployment.",
                subtitle="Enterprise QA",
                input_price=0.00, output_price=0.00, speed="Fast",
                categories=["QA", "Enterprise", "NLP", "Proven"]
            )
        
        # LEGAL & COMPLIANCE
        elif any(word in prompt_lower for word in [
            "legal", "law", "lawyer", "attorney", "contract", "agreement", "compliance",
            "regulation", "policy", "terms", "conditions", "clause", "litigation", "case law",
            "legal document", "legal analysis", "due diligence", "regulatory", "gdpr", "hipaa",
            "patent", "trademark", "copyright", "intellectual property", "legal research"
        ]):
            main_rec = ModelRecommendation(
                name="Harvey AI", provider="Harvey",
                reasoning="Specialized legal model trained on case law and legal documents. Industry-leading for legal work.",
                subtitle="Legal AI Specialist",
                input_price=0.00, output_price=0.00, speed="Medium",
                categories=["Legal", "Specialized", "Case-Law", "Professional"]
            )
            alt_rec = ModelRecommendation(
                name="GPT-4o", provider="OpenAI",
                reasoning="Strong reasoning for complex legal document analysis and contract review.",
                subtitle="Legal Analysis",
                input_price=2.50, output_price=10.00, speed="Fast",
                categories=["Legal", "Analysis", "Reasoning", "Contracts"]
            )
        
        # UX/UI DESIGN & PROTOTYPING
        elif any(word in prompt_lower for word in [
            "ux", "ui", "user experience", "user interface", "design", "mockup", "wireframe",
            "prototype", "figma", "sketch", "website design", "app design", "interface design",
            "usability", "interaction design", "visual design", "layout", "component", "design system",
            "responsive design", "mobile design", "web design", "landing page", "dashboard design"
        ]):
            main_rec = ModelRecommendation(
                name="v0.dev", provider="Vercel",
                reasoning="Generates functional React components from UI descriptions. Best for rapid prototyping.",
                subtitle="UI Code Generator",
                input_price=0.00, output_price=0.00, speed="Fast",
                categories=["UX", "UI", "Prototyping", "React", "Code"]
            )
            alt_rec = ModelRecommendation(
                name="GPT-4o Vision", provider="OpenAI",
                reasoning="Analyzes design screenshots with incredible precision. Perfect for design critique and improvement.",
                subtitle="Design Analysis",
                input_price=2.50, output_price=10.00, speed="Fast",
                categories=["UX", "UI", "Vision", "Analysis", "Critique"]
            )
        
        # REAL-TIME & WEB DATA
        elif any(word in prompt_lower for word in [
            "real-time", "live data", "current", "now", "today", "latest", "news", "breaking",
            "web scraping", "web data", "internet", "online", "browse", "search web", "recent",
            "up-to-date", "current events", "trending", "stock price", "weather", "sports score"
        ]):
            main_rec = ModelRecommendation(
                name="Grok 4 Heavy", provider="xAI",
                reasoning="Real-time web data integration champion. Fastest access to current information and breaking news.",
                subtitle="Real-Time Intelligence",
                input_price=0.00, output_price=0.00, speed="Instant",
                categories=["Real-Time", "Web-Data", "Speed", "Current"]
            )
            alt_rec = ModelRecommendation(
                name="Perplexity Pro", provider="Perplexity",
                reasoning="Search-focused AI with real-time internet access and citation accuracy.",
                subtitle="Search Engine AI",
                input_price=0.00, output_price=0.00, speed="Fast",
                categories=["Search", "Real-Time", "Citations", "Web"]
            )
        
        # REASONING & LOGIC (Deep thinking models)
        elif any(word in prompt_lower for word in [
            "reasoning", "logic", "logical", "think", "complex problem", "puzzle", "riddle",
            "deduction", "inference", "critical thinking", "problem solving", "analytical",
            "strategy", "planning", "decision making", "optimization", "constraint", "proof",
            "chain of thought", "step by step", "systematic", "rational", "cognitive"
        ]):
            main_rec = ModelRecommendation(
                name="o3", provider="OpenAI",
                reasoning="Deep reasoning for complex problem-solving. Best for multi-step logical challenges.",
                subtitle="Reasoning Master",
                input_price=15.00, output_price=60.00, speed="Slow",
                categories=["Reasoning", "Logic", "Deep-Thinking", "Complex"]
            )
            alt_rec = ModelRecommendation(
                name="GPT-5.2 Thinking", provider="OpenAI",
                reasoning="Complex logical proofs and advanced reasoning capabilities with latest architecture.",
                subtitle="Advanced Reasoning",
                input_price=5.00, output_price=20.00, speed="Medium",
                categories=["Reasoning", "Logic", "Proofs", "Advanced"]
            )
        
        # OPEN-SOURCE & COST-EFFICIENCY
        elif any(word in prompt_lower for word in [
            "open source", "open-source", "free", "cheap", "affordable", "budget", "cost-effective",
            "economical", "low-cost", "value", "self-hosted", "local", "privacy", "offline",
            "on-premise", "llama", "mistral", "open weights", "community", "free tier"
        ]):
            main_rec = ModelRecommendation(
                name="DeepSeek-R1", provider="DeepSeek",
                reasoning="Most cost-efficient reasoning model. $294K training cost vs millions for competitors. Incredible value.",
                subtitle="Value Champion",
                input_price=0.14, output_price=0.28, speed="Very Fast",
                categories=["Open-Source", "Value", "Cost-Efficient", "Reasoning"]
            )
            alt_rec = ModelRecommendation(
                name="Llama 4 Scout/Maverick", provider="Meta",
                reasoning="Open source multimodal Mixture-of-Experts. Best free alternative for general tasks.",
                subtitle="Open-Source Leader",
                input_price=0.00, output_price=0.00, speed="Fast",
                categories=["Open-Source", "Free", "Multimodal", "MoE"]
            )
        
        # MULTIMODAL (Vision, audio, text combined)
        elif any(word in prompt_lower for word in [
            "multimodal", "multi-modal", "vision", "image understanding", "visual", "see",
            "look at", "analyze image", "describe image", "ocr", "visual question answering",
            "image + text", "audio + visual", "cross-modal", "vision language"
        ]):
            main_rec = ModelRecommendation(
                name="GPT-4o", provider="OpenAI",
                reasoning="Best for multimodal visual tasks with seamless integration of text, image, and audio.",
                subtitle="Multimodal Leader",
                input_price=2.50, output_price=10.00, speed="Fast",
                categories=["Multimodal", "Vision", "Audio", "Versatile"]
            )
            alt_rec = ModelRecommendation(
                name="Gemini 3 Pro", provider="Google",
                reasoning="Multimodal excellence with massive context window for complex visual understanding.",
                subtitle="Multimodal Expert",
                input_price=1.25, output_price=5.00, speed="Fast",
                categories=["Multimodal", "Vision", "Large-Context"],
                # context_length="1M tokens"
            )
        
        # CREATIVE & STORYTELLING
        elif any(word in prompt_lower for word in [
            "creative", "creativity", "story", "storytelling", "fiction", "novel", "narrative",
            "worldbuilding", "character", "plot", "fantasy", "science fiction", "sci-fi",
            "romance", "mystery", "thriller", "drama", "poetry", "poem", "creative writing",
            "imagination", "artistic", "original", "innovative", "unique", "brainstorm"
        ]):
            main_rec = ModelRecommendation(
                name="Claude Opus 4.1", provider="Anthropic",
                reasoning="Most creative and nuanced responses. Perfect for sophisticated storytelling and creative work.",
                subtitle="Creative Genius",
                input_price=15.00, output_price=75.00, speed="Medium",
                categories=["Creative", "Storytelling", "Nuanced", "Premium"]
            )
        
        # Fallback if no match found
        if not main_rec:
            # Default to strong general purpose
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
        # User requested to analyze EVERY message, so we removed the len < 3 check.
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
