import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Ensure backend directory's .env is loaded regardless of current working directory
backend_dir = Path(__file__).resolve().parent
env_path = backend_dir / ".env"
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("GEMINI_API_KEY")

print("=" * 60)
print("     SocialOpti - Gemini API Connectivity & Health Test")
print("=" * 60)

# Check 1: API Key presence
if not api_key:
    print("\n[RESULT: FAILED]")
    print("Reason: GEMINI_API_KEY is not defined.")
    print(f"Please check your .env file at:\n  {env_path}")
    sys.exit(1)

masked_key = api_key[:6] + "..." + api_key[-4:] if len(api_key) > 10 else "***"
print(f"[OK] Found GEMINI_API_KEY: {masked_key}")

# Check 2: Google GenAI SDK import
try:
    from google import genai
    print("[OK] Loaded google-genai library.")
except ImportError as err:
    print("\n[RESULT: FAILED]")
    print(f"Reason: Could not import google.genai: {err}")
    print("Fix: Install it using: .\\.venv\\Scripts\\python.exe -m pip install google-genai")
    sys.exit(1)

# Check 3: Send test prompt to Gemini
client = genai.Client(api_key=api_key)
prompt = "Suggest 3 hashtags for a technology post."

# Try available fast models with fallback if one experiences high demand (503)
models_to_try = ["gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-3.8-flash"]

response = None
success_model = None

for model_name in models_to_try:
    try:
        print(f"Sending test prompt to model '{model_name}'...")
        response = client.models.generate_content(
            model=model_name,
            contents=prompt
        )
        success_model = model_name
        break
    except Exception as err:
        err_msg = str(err)
        if "503" in err_msg or "UNAVAILABLE" in err_msg or "429" in err_msg or "RESOURCE_EXHAUSTED" in err_msg:
            print(f"  -> Model '{model_name}' busy or rate limited ({'429 Quota' if '429' in err_msg else '503 Busy'}). Trying next model...")
            continue
        else:
            print(f"\n[RESULT: FAILED] Error with model '{model_name}': {err}")
            sys.exit(1)

if response and response.text:
    print("\n" + "=" * 60)
    print(f"[RESULT: PASSED] Successfully received response from '{success_model}'!")
    print("=" * 60)
    print("\nGemini Response:")
    print(response.text.strip())
    print("\n" + "=" * 60)
    print("Status: 100% OPERATIONAL. Gemini API is ready for SocialOpti!")
    print("=" * 60)
    sys.exit(0)
else:
    print("\n[RESULT: FAILED] No response received from tested models.")
    sys.exit(1)
