from flask import Blueprint, request, jsonify
from services.aadhar_ocr import extract_aadhaar_data
from services.verification_service import initiate_verification, confirm_verification
from routes.passbook import PASSBOOK_DATA_STORE
import os

verify_bp = Blueprint("verify", __name__)
UPLOAD_DIR = "uploads/aadhaar"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@verify_bp.route("/aadhaar/extract", methods=["POST"])
def extract_aadhaar():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    path = os.path.join(UPLOAD_DIR, file.filename)
    file.save(path)

    data = extract_aadhaar_data(path)
    return jsonify(data)


@verify_bp.route("/verify/initiate", methods=["POST"])
def initiate():
    if "current" not in PASSBOOK_DATA_STORE:
        return jsonify({"error": "Passbook not extracted"}), 400

    data = request.json
    aadhaar_data = data.get("aadhaarData", {})
    passbook_data = PASSBOOK_DATA_STORE["current"]

    result = initiate_verification(
        passbook_data.get("accountHolderName"),
        aadhaar_data,
        passbook_data
    )

    return jsonify(result)


@verify_bp.route("/verify/confirm", methods=["POST"])
def confirm():
    data = request.json
    mobile = data.get("mobile")
    otp = data.get("otp")

    result = confirm_verification(mobile, otp)
    return jsonify(result)
