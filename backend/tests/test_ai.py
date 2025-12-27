import google.generativeai as genai
from app.config.settings import settings
import sys

def test_gemini():
    print(f"Checking Google API Key: {settings.GOOGLE_API_KEY[:8]}...")
    if not settings.GOOGLE_API_KEY:
        print("ERROR: No Google API Key found in settings/env")
        return

    try:
        genai.configure(api_key=settings.GOOGLE_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash') # Using flash as it is more permissive/faster
        response = model.generate_content("Hello, this is a connection test. Please respond with 'Oasis Ready'.")
        print(f"Response: {response.text}")
        print("SUCCESS: Connection to Gemini API established.")
    except Exception as e:
        import traceback
        print(f"FAILED: Connection to Gemini API failed: {str(e)}")
        print(traceback.format_exc())

if __name__ == "__main__":
    test_gemini()
