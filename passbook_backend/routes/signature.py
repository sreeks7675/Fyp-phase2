from flask import Blueprint, request, jsonify
import os
from services.signature_verify import verify_signature

signature_bp = Blueprint("signature", __name__)

UPLOAD_DIR = "uploads/signatures"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@signature_bp.route("/signature/verify", methods=["POST"])
def verify():

    if "file" not in request.files:
        return jsonify({"error": "No signature uploaded"}), 400

    account_number = request.form.get("accountNumber")

    file = request.files["file"]

    path = os.path.join(UPLOAD_DIR, file.filename)
    file.save(path)

    verified, score = verify_signature(account_number, path)

    if verified:
        return jsonify({
            "status": "verified",
            "score": float(score)
        })

    else:
        return jsonify({
            "status": "mismatch",
            "score": float(score)
        })