import requests
'''from pathlib import Path
PROMPT_PATH=Path(__file__).parent.parent / "prompts" / "scheme_explain.txt"
PROMPT_TEMPLATE=PROMPT_PATH.read_text(encoding="utf-8")
def explain_scheme(context_text:str,language:str)->str:
    lang_text="Tamil" if language =="ta" else "English"
    prompt = PROMPT_TEMPLATE.replace("{{context}}", context_text).replace("{{language}}", lang_text)

    payload = {
        "model": "qwen2.5:1.5b",
        "prompt": prompt,
        "stream": False,
    }

    response = requests.post(
        "http://localhost:11434/api/generate",
        json=payload,
        timeout=300
    )
    response.raise_for_status()
    return response.json()["response"].strip()'''
import requests
import json
from pathlib import Path
from deep_translator import GoogleTranslator

PROMPT_PATH = Path(__file__).parent.parent / "prompts" / "scheme_explain.txt"
PROMPT_TEMPLATE = PROMPT_PATH.read_text(encoding="utf-8")

CACHE_PATH = Path(__file__).parent.parent / "tamil_scheme_cache.json"


# ---------- Cache Helpers ----------

def _load_cache() -> dict:
    if CACHE_PATH.exists():
        return json.loads(CACHE_PATH.read_text(encoding="utf-8"))
    return {}

def _save_cache(cache: dict):
    CACHE_PATH.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")


# ---------- Qwen - English Explanation Only ----------

def _explain_in_english(context_text: str) -> str:
    prompt = PROMPT_TEMPLATE.replace("{{context}}", context_text).replace("{{language}}", "English")
    payload = {
        "model": "qwen2.5:1.5b",
        "prompt": prompt,
        "stream": False,
    }
    response = requests.post(
        "http://localhost:11434/api/generate",
        json=payload
    )
    response.raise_for_status()
    return response.json()["response"].strip()


# ---------- Google Translate ----------

def _translate_to_tamil(english_text: str) -> str:
    # Google Translate has a character limit per call (~5000 chars)
    # So we chunk it just in case the explanation is long
    max_chunk = 4500
    if len(english_text) <= max_chunk:
        return GoogleTranslator(source='en', target='ta').translate(english_text)
    
    # Split into chunks and translate each
    chunks = [english_text[i:i+max_chunk] for i in range(0, len(english_text), max_chunk)]
    translated_chunks = [GoogleTranslator(source='en', target='ta').translate(chunk) for chunk in chunks]
    return " ".join(translated_chunks)


# ---------- Main Public Function ----------

def explain_scheme(context_text: str, language: str, scheme_id: str = "") -> str:
    # Always generate English first
    english_text = _explain_in_english(context_text)

    if language == "en":
        return english_text

    # Check Tamil cache using scheme_id as key
    cache = _load_cache()
    if scheme_id and scheme_id in cache:
        return cache[scheme_id]

    # Translate via Google
    tamil_text = _translate_to_tamil(english_text)

    # Cache it against scheme_id
    if scheme_id:
        cache[scheme_id] = tamil_text
        _save_cache(cache)

    return tamil_text    