from groq import Groq
from app.config.settings import settings

def test_groq():
    print(f"Checking Groq API Key: {settings.GROQ_API_KEY[:8]}...")
    if not settings.GROQ_API_KEY:
        print("ERROR: No Groq API Key found in settings/env")
        return

    try:
        client = Groq(api_key=settings.GROQ_API_KEY)
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "user", "content": "Hello, this is a connection test. Please respond with 'Oasis Ready'."}
            ],
            temperature=0.3,
            max_tokens=50
        )
        print(f"Response: {response.choices[0].message.content}")
        print("SUCCESS: Connection to Groq API established.")
    except Exception as e:
        import traceback
        print(f"FAILED: Connection to Groq API failed: {str(e)}")
        print(traceback.format_exc())

if __name__ == "__main__":
    test_groq()
