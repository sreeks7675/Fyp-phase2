from rag.embed import embed_text
from rag.vector_search import find_top_schemes
def run_scheme_rag(situation: str) -> list[dict]:
    # Step 1: Embed the user's situation into a vector
    print(f"[RAG] Embedding situation: {situation[:80]}...")
    query_vector = embed_text(situation)
 
    # Step 2: Find top 3 matching schemes by cosine similarity
    top_schemes = find_top_schemes(query_vector, k=3)
    print(f"[RAG] Top matches: {[s.get('id') for s in top_schemes]}")
 
    # Step 3: Generate a plain-English explanation for each matched scheme
    results = []
    for scheme in top_schemes:
        results.append({
            "id": scheme.get("id"),
            "name": scheme.get("schemeName"),
            "nameTa": scheme.get("schemeNameTa"),
            "maxAmount": scheme.get("maxAmount"),
            "interestRate": scheme.get("interestRate"),
            "eligibility": scheme.get("eligibility")
        })
    return results