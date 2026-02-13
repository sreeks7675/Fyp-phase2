import easyocr
import cv2
import numpy as np

# Initialize reader once (global)
reader = easyocr.Reader(['en'], gpu=False)

def extract_raw_text(image_path: str) -> str:
    """
    Extract raw text from passbook image using EasyOCR
    """

    '''img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)[1]'''
    result = reader.readtext(image_path)
    # Combine detected text in reading order
    lines = []
    for detection in result:
        text = detection[1]
        lines.append(text)

    return "\n".join(lines)