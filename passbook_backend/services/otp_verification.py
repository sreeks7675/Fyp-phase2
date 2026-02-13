import random
from datetime import datetime, timedelta
import re
from services.sms_service import send_otp_sms

OTP_STORE = {}


def validate_mobile_format(mobile):
    return bool(re.match(r'^[6-9]\d{9}$', str(mobile).strip()))


def generate_and_send_otp(mobile):
    mobile = str(mobile).strip()

    if not validate_mobile_format(mobile):
        raise ValueError("Invalid mobile number format")

    otp = str(random.randint(100000, 999999))

    OTP_STORE[mobile] = {
        "otp": otp,
        "expires": datetime.now() + timedelta(minutes=3),
        "attempts": 0,
        "max_attempts": 3
    }

    # Send SMS
    send_otp_sms(mobile, otp)

    return True


def verify_otp(mobile, otp_input):
    mobile = str(mobile).strip()
    otp_input = str(otp_input).strip()

    record = OTP_STORE.get(mobile)

    if not record:
        return False

    if datetime.now() > record["expires"]:
        del OTP_STORE[mobile]
        return False

    if record["attempts"] >= record["max_attempts"]:
        del OTP_STORE[mobile]
        return False

    if record["otp"] == otp_input:
        del OTP_STORE[mobile]
        return True

    record["attempts"] += 1
    return False
