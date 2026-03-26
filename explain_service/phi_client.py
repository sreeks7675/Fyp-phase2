'''import requests
from pathlib import Path
OLLAMA_URL="http://localhost:11434/api/generate"
MODEL_NAME="phi4-mini:latest"
PROMPT_PATH=Path(__file__).parent / "prompts" / "explain.txt"

def generate_explanation(topic: str, language: str)->str:
    template=PROMPT_PATH.read_text(encoding="utf-8")
    lang_text="Tamil" if language =="ta" else "English"
    prompt=template.format(
        topic=topic,
        language=lang_text
    )
    payload={
        "model":MODEL_NAME,
        "prompt":prompt,
        "stream":False,
    }
    response=requests.post(OLLAMA_URL,json=payload)
    response.raise_for_status()
    return response.json()['response'].strip()
    '''

import requests
import json
from pathlib import Path
from tts import text_to_speech  # <-- importing from tts.py
from deep_translator import GoogleTranslator

OLLAMA_URL = "http://localhost:11434/api/generate"
EXPLAIN_MODEL = "phi4-mini:latest"

PROMPT_PATH = Path(__file__).parent / "prompts" / "explain.txt"
CACHE_PATH = Path(__file__).parent / "tamil_cache.json"


# ---------- Cache Helpers ----------

def _load_cache() -> dict:
    if CACHE_PATH.exists():
        return json.loads(CACHE_PATH.read_text(encoding="utf-8"))
    return {}

def _save_cache(cache: dict):
    CACHE_PATH.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")


# ---------- Ollama Helpers ----------

def _generate_english(topic: str) -> str:
    template = PROMPT_PATH.read_text(encoding="utf-8")
    prompt = template.format(topic=topic, language="English")
    payload = {
        "model": EXPLAIN_MODEL,
        "prompt": prompt,
        "stream": False,
        "options": {"num_predict": 300}
    }
    response = requests.post(OLLAMA_URL, json=payload)
    response.raise_for_status()
    return response.json()["response"].strip()

def _translate_to_tamil(english_text: str) -> str:
    translated = GoogleTranslator(source='en', target='ta').translate(english_text)
    return translated


# ---------- Main Public Function ----------

def generate_explanation(topic: str, language: str) -> str:
    english_text = _generate_english(topic)

    if language == "en":
        return english_text

    # Check Tamil cache first
    cache = _load_cache()
    if topic in cache:
        return cache[topic]

    tamil_text = _translate_to_tamil(english_text)

    # Save to cache for next time
    cache[topic] = tamil_text
    _save_cache(cache)

    return tamil_text


# ---------- Audio Generation ----------

def generate_audio(topic: str, language: str) -> str:
    text = generate_explanation(topic, language)
    filename = text_to_speech(text, language)  # returns mp3 filename
    return filename