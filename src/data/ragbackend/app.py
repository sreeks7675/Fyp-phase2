import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from rag.pipeline import run_scheme_rag

app = Flask(__name__)
CORS(app)

PORT = int(os.environ.get("RAG_PORT", 5002))


@app.route("/api/schemes/rag", methods=["POST"])
def rag_endpoint():
    payload = request.get_json() or {}
    situation = payload.get("situation", "").strip()

    if not situation:
        return jsonify({"error": "Missing situation"}), 400

    print(f"[RAG] /api/schemes/rag called — situation: {situation[:80]}")

    try:
        schemes = run_scheme_rag(situation)
        return jsonify({"schemes": schemes})
    except Exception as e:
        print(f"[RAG ERROR] {e}")
        return jsonify({"error": "RAG pipeline failed", "detail": str(e)}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "port": PORT})


if __name__ == "__main__":
    app.run(port=PORT, debug=False)