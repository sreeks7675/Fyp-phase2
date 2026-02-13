import re

def _find(pattern, text):
    match = re.search(pattern, text, re.IGNORECASE)
    return match.group(1).strip() if match else ""

def parse_passbook(text: str):
    return {
        "accountHolderName": _find(r"Name\s*[:\-]\s*(.*)", text),
        "accountNumber": _find(r"Account\s*(No|Number)\s*[:\-]\s*([\dX]+)", text),
        "accountType": _find(r"Account\s*Type\s*[:\-]\s*(.*)", text),
        "branchName": _find(r"Branch\s*Name\s*[:\-]\s*(.*)", text),
        "ifsc": _find(r"IFSC\s*Code\s*[:\-]\s*([A-Z0-9]+)", text),
        "cif": _find(r"CIF\s*(No)?\s*[:\-]\s*([\dA-Z]+)", text),
        "mobileNumber": _find(r"Mobile\s*(No)?\s*[:\-]\s*([\d+]+)", text),
        "address": _find(r"Address\s*[:\-]\s*(.*)", text),
    }
