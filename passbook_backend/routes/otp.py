from flask import Blueprint, request, jsonify
from services.twilio_otp import send_otp, verify_otp

otp_bp = Blueprint("otp", __name__)


@otp_bp.route("/otp/send", methods=["POST"])
def send():
    data = request.json
    mobile = data.get("mobile")

    if not mobile:
        return jsonify({"error": "Mobile number required"}), 400

    try:
        send_otp(mobile)
        return jsonify({"status": "otp_sent"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@otp_bp.route("/otp/verify", methods=["POST"])
def verify():
    data = request.json
    mobile = data.get("mobile")
    otp = data.get("otp")

    if verify_otp(mobile, otp):
        return jsonify({"status": "verified"})
    else:
        return jsonify({"status": "invalid"})