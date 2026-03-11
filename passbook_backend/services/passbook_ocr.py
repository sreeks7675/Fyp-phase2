import cv2
from rapidocr_onnxruntime import RapidOCR

# Load once globally
engine = RapidOCR()

def extract_raw_text(image_path: str) -> str:
    """
    Fast OCR using RapidOCR
    """

    img = cv2.imread(image_path)

    if img is None:
        raise Exception(f"Image not readable: {image_path}")

    # mild preprocessing (important)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.resize(gray, None, fx=1.3, fy=1.3)

    result, _ = engine(gray)

    if not result:
        return ""

    lines = [item[1] for item in result]

    return "\n".join(lines)
