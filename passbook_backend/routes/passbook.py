from flask import Blueprint, request, jsonify, session
import os
from services.passbook_service import extract_passbook_fields
from werkzeug.utils import secure_filename
import uuid

passbook_bp = Blueprint("passbook", __name__)

UPLOAD_DIR = os.path.join(os.getcwd(), "uploads", "passbooks")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Global storage for passbook data (should be replaced with database in production)
PASSBOOK_DATA_STORE = {}

@passbook_bp.route("/passbook/extract", methods=["POST"])
def extract_passbook():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    #path = os.path.join(UPLOAD_DIR, file.filename)
    #file.save(path)
    safe_name = secure_filename(file.filename)

    # add unique id so no overwrite happens
    unique_name = f"{uuid.uuid4()}_{safe_name}"

    path = os.path.join(UPLOAD_DIR, unique_name)

    file.save(path)

    print("Saved file at:", path)
    print("File exists:", os.path.exists(path))
    print("File size:", os.path.getsize(path))


    try:
        data = extract_passbook_fields(path)
        # Store passbook data for later comparison
        PASSBOOK_DATA_STORE["current"] = data
        # Return without rawText and debug to client
        response = {k: v for k, v in data.items() if k not in ["rawText", "debug"]}
        print(f"DEBUG: Passbook extracted and stored: {response}")
        return jsonify(response)
    except Exception as e:
        print(f"ERROR: Exception in extract_passbook: {str(e)}")
        return jsonify({"error": str(e)}), 500


@passbook_bp.route("/passbook/update", methods=["POST"])
def update_passbook():
    """Update passbook data with user-edited values"""
    data = request.json
    
    if not data:
        print("ERROR: No data provided for passbook update")
        return jsonify({"error": "No data provided"}), 400
    
    # Update the stored passbook data with edited values
    if "current" in PASSBOOK_DATA_STORE:
        # Keep rawText if it exists, update other fields
        raw_text = PASSBOOK_DATA_STORE["current"].get("rawText", "")
        PASSBOOK_DATA_STORE["current"] = {**data, "rawText": raw_text}
    else:
        # If no previous extraction, just store the new data
        PASSBOOK_DATA_STORE["current"] = data
    
    print(f"DEBUG: Passbook data updated with user edits: {data}")
    return jsonify({
        "status": "success",
        "message": "Passbook data updated",
        "data": {k: v for k, v in PASSBOOK_DATA_STORE["current"].items() if k != "rawText"}
    })


@passbook_bp.route("/passbook/get", methods=["GET"])
def get_passbook():
    """Retrieve current stored passbook data"""
    if "current" not in PASSBOOK_DATA_STORE:
        return jsonify({"error": "No passbook data found"}), 404
    
    data = PASSBOOK_DATA_STORE["current"]
    response = {k: v for k, v in data.items() if k != "rawText"}
    return jsonify(response)
