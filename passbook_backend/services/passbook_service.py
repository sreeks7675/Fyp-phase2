import re
from services.passbook_ocr import extract_raw_text

def extract_passbook_fields(image_path: str):
    raw_text = extract_raw_text(image_path)

    # Normalize text
    text = raw_text.upper()
    text = text.replace("\n", " ")
    text = re.sub(r"\s+", " ", text)

    def find(pattern):
        match = re.search(pattern, text, re.IGNORECASE)
        return match.group(1).strip() if match else ""

    return {
        "accountHolderName": find(
            r"(?:NAME\s+OF\s+(?:THE\s+)?ACCOUNT\s+HOLDER|ACCOUNT\s+HOLDER\s+NAME|CUSTOMER\s+NAME|NAME)\s*[:\-]?\s*([A-Z\s\.]{3,})"
        ),

        "accountNumber": find(
            r"(?:ACCOUNT\s*(?:NO|NUMBER)|A\/?C\s*NO|ACC\s*NO|A\s*C\s*NO)\s*[:\-]?\s*([0-9]{6,20})"
        ),

        "accountType": find(
            r"(?:ACCOUNT\s*TYPE|A\/?C\s*TYPE|TYPE\s*OF\s*ACCOUNT)\s*[:\-]?\s*([A-Z\s]{3,})"
        ),

        "branchName": find(
            r"(?:BRANCH\s*(?:NAME)?|HOME\s*BRANCH)\s*[:\-]?\s*([A-Z\s]{3,})"
        ),

        "ifsc": find(
            r"(?:IFSC\s*CODE|IFSC)\s*[:\-]?\s*([A-Z]{4}0[A-Z0-9]{6})"
        ),

        "cif": find(
            r"(?:CIF|CUSTOMER\s*ID|CUST\s*ID)\s*[:\-]?\s*([A-Z0-9]{6,20})"
        ),

        "address": find(
            r"(?:ADDRESS|ADDR)\s*[:\-]?\s*([A-Z0-9\s,.\-\/]{10,})"
        ),

        "mobileNumber": find(
            r"(?:MOBILE|PHONE|CONTACT)\s*(?:NO|NUMBER)?\s*[:\-]?\s*([0-9]{10})"
        ),

        "rawText": raw_text
    }

'''import re
from services.passbook_ocr import extract_raw_text

def extract_passbook_fields(image_path: str):
    raw_text = extract_raw_text(image_path)
    # Normalize text
    text = raw_text.upper()
    text = text.replace("\n", " ")
    text = re.sub(r"\s+", " ", text)
    def find(pattern, flags=0):
        match = re.search(pattern, text, flags)
        return match.group(1).strip() if match else ""

    # -------------------------
    # ACCOUNT HOLDER NAME
    # -------------------------
    # Stop at ACCOUNT / CIF / IFSC / BRANCH
    account_holder = find(
        r"(?:NAME\s*[:\-]?\s*)([A-Z\s\.]{3,40}?)(?=\s+(ACCOUNT|CIF|IFSC|BRANCH))"
    )

    # Fallback: first long capital text line
    if not account_holder:
        account_holder = find(r"\b([A-Z]{3,}\s[A-Z\s]{3,40})\b")

    # -------------------------
    # ACCOUNT NUMBER
    # -------------------------
    # Strict 10-digit numeric
    account_number = find(
        r"(?:ACCOUNT\s*(?:NO|NUMBER)?\s*[:\-]?\s*)(\d{10})"
    )

    # Fallback: any standalone 10-digit number
    if not account_number:
        account_number = find(r"\b(\d{10})\b")

    # -------------------------
    # IFSC CODE
    # Format: 4 letters + 0 + 6 digits (India standard)
    # -------------------------
    ifsc = find(r"\b([A-Z]{4}0\d{6})\b")

    # -------------------------
    # CIF (usually numeric 8-11 digits)
    # -------------------------
    cif = find(r"(?:CIF\s*[:\-]?\s*)(\d{6,12})")

    # -------------------------
    # ACCOUNT TYPE
    # -------------------------
    account_type = find(
        r"\b(SAVINGS|CURRENT|RECURRING|FD|FIXED DEPOSIT)\b"
    )

    # -------------------------
    # BRANCH (just 'Branch')
    # -------------------------
    branch = find(
        r"(?:BRANCH\s*[:\-]?\s*)([A-Z\s]{3,40})"
    )

    # -------------------------
    # ADDRESS
    # No label — detect via PINCODE
    # -------------------------
    address = ""
    pincode_match = re.search(r"\b\d{6}\b", text)
    if pincode_match:
        pin = pincode_match.group()
        # Capture 60 chars before pincode
        start = max(pincode_match.start() - 80, 0)
        address = text[start:pincode_match.end()]
        address = address.strip()

    # -------------------------
    # MOBILE NUMBER
    # -------------------------
    mobile = find(r"\b[6-9]\d{9}\b")

    return {
        "accountHolderName": account_holder,
        "accountNumber": account_number,
        "accountType": account_type,
        "branchName": branch,
        "ifsc": ifsc,
        "cif": cif,
        "address": address,
        "mobileNumber": mobile,
        "rawText": raw_text
    }'''