import easyocr
import cv2
import numpy as np
import re

reader = easyocr.Reader(['en'], gpu=False)

def extract_aadhaar_data(image_path: str):
    """Extract Aadhar card data from image"""
    
    '''file_bytes = np.fromfile(image_path, dtype=np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)'''

    result = reader.readtext(image_path, detail=0)
    lines = [text.strip() for text in result if text.strip()]
    raw_text = "\n".join(lines)


    '''# Extract name (usually large uppercase block at top of card)
    name_match = re.search(r"([A-Z]{1}\s[A-Z]{3,}\s[A-Z\s]+?)", raw_text)
    name = name_match.group(1).strip() if name_match else ""'''
    lines = [l.strip() for l in raw_text.split("\n") if l.strip()]

    # --- Extract Name ---
    name = ""

    ignore_keywords = [
        "government",
        "india",
        "unique identification",
        "authority",
        "aadhaar",
        "dob",
        "male",
        "female"
    ]

    # Step 1: Filter valid candidate lines
    candidates = []

    for line in lines:
        clean = line.strip()
        lower = clean.lower()

        # Skip headers
        if any(word in lower for word in ignore_keywords):
            continue

        # Skip lines containing digits
        if re.search(r"\d", clean):
            continue

        # Must contain at least 2 words
        #if len(clean.split()) >= 2:
        if 2 <= len(clean.split()) <= 4:

            # Must be alphabetic words (allow initials)
            if re.fullmatch(r"[A-Za-z\s\.]+", clean):
                candidates.append(clean)

    # Step 2: Choose best candidate (usually longest valid line)
    if candidates:
        name = max(candidates, key=len)

    
    # Extract Aadhar number (12 digits, often in groups)
    aadhar_match = re.search(r"\b(\d{4}\s?\d{4}\s?\d{4}|\d{12})\b", raw_text)
    aadhar_number = ""
    if aadhar_match:
        aadhar_number = aadhar_match.group(1).replace(" ", "")

    '''# Extract mobile number (10 digits starting with 6-9)
    mobile_match = re.search(r"\b[6-9]\d{9}\b", raw_text)
    mobile = mobile_match.group(0) if mobile_match else ""'''

    # Extract DOB (dd/mm/yyyy format)
    dob_match = re.search(r"\b(\d{2}/\d{2}/\d{4})\b", raw_text)
    dob = dob_match.group(1) if dob_match else ""

    return {
        "name": name,
        "aadhaarNumber": aadhar_number,
        #"mobileNumber": mobile,
        "dob": dob,
        "rawText": raw_text
    }
