from services.otp_verification import generate_and_send_otp, verify_otp


def match_name(passbook_name, aadhaar_name):
    if not passbook_name or not aadhaar_name:
        return False
    return passbook_name.lower().strip() in aadhaar_name.lower().strip()


def initiate_verification(passbook_name, aadhaar_data, passbook_data=None):
    aadhaar_name = aadhaar_data.get("name", "")
    mobile = passbook_data.get("mobileNumber", "")

    if not mobile:
        return {"status": "error", "message": "Mobile number missing in passbook"}

    if not match_name(passbook_name, aadhaar_name):
        return {"status": "mismatch", "message": "Name mismatch"}

    try:
        generate_and_send_otp(mobile)

        return {
            "status": "otp_sent",
            "mobile": mobile
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}


def confirm_verification(mobile, otp):
    if verify_otp(mobile, otp):
        return {"status": "verified"}

    return {"status": "invalid_otp"}
