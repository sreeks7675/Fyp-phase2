import json
import math
import os
from typing import Any
 
SCHEMES_PATH = os.path.join(os.path.dirname(__file__), "../data/schemes.json")
 
# Load schemes once at import time
with open(SCHEMES_PATH, "r", encoding="utf-8") as f:
    _schemes: list[dict[str, Any]] = json.load(f)
 
 
def _cosine_similarity(a: list[float], b: list[float]) -> float:
    dot = sum(x * y for x, y in zip(a, b))
    mag_a = math.sqrt(sum(x * x for x in a))
    mag_b = math.sqrt(sum(x * x for x in b))
    if mag_a == 0 or mag_b == 0:
        return 0.0
    return dot / (mag_a * mag_b)
 
 
def find_top_schemes(query_vector: list[float], k: int = 3) -> list[dict[str, Any]]:
    scored = []
    for scheme in _schemes:
        embedding = scheme.get("embedding", [])
        if not embedding:
            continue
        score = _cosine_similarity(query_vector, embedding)
        scored.append({**scheme, "score": score})
 
    scored.sort(key=lambda s: s["score"], reverse=True)
    return scored[:k]