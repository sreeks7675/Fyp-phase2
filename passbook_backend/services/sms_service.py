import os
import requests
from dotenv import load_dotenv

load_dotenv()

MSG91_API_KEY = os.getenv("MSG91_API_KEY")
MSG91_SENDER_ID = os.getenv("MSG91_SENDER_ID")
MSG91_TEMPLATE_ID = os.getenv("MSG91_TEMPLATE_ID")


'''def send_otp_sms(mobile: str, otp: str):
    """
    Send OTP using MSG91
    """

    url = "https://control.msg91.com/api/v5/otp?mobile=917550012023&authkey=493985TxeQicShEO7698e2994P1&otp_expiry=2&template_id=698e2b1619598a13c5633df6&realTimeResponse=1"

    payload = {
        "flow_id": MSG91_TEMPLATE_ID,
        "sender": MSG91_SENDER_ID,
        "mobiles": f"91{mobile}",
        "OTP": otp
    }

    headers = {
        "authkey": MSG91_API_KEY,
        "Content-Type": "application/json"
    }

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code != 200:
        raise Exception(f"MSG91 Error: {response.text}")

    return True'''

def send_otp_sms(mobile: str, otp: str):

    url = "https://control.msg91.com/api/v5/flow/"

    payload = {
        "flow_id": MSG91_TEMPLATE_ID,
        "sender": MSG91_SENDER_ID,
        "mobiles": f"91{mobile}",
        "VAR1": otp  # Must match template variable name
    }

    headers = {
        "authkey": MSG91_API_KEY,
        "Content-Type": "application/json"
    }
    print(payload["VAR1"])
    response = requests.post(url, json=payload, headers=headers)

    if response.status_code != 200:
        raise Exception(f"MSG91 Error: {response.text}")

    return True

