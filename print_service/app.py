from flask import Flask, request, jsonify
import pdfkit
import win32api
import os
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# configure wkhtmltopdf if not in PATH
config = pdfkit.configuration(
    wkhtmltopdf=r"C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe"
)

@app.route("/print", methods=["POST"])
def print_page():
    print("Received print request")

    html_content = request.json["html"]

    # generate file name
    filename = f"print_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    print(f"Generated filename: {filename}")
    pdf_path = os.path.join(os.getcwd(), filename)

    # convert HTML → PDF
    pdfkit.from_string(html_content, pdf_path, configuration=config)

    # send to printer
    print(f"Sending {pdf_path} to printer")
    win32api.ShellExecute(
        0,
        "print",
        pdf_path,
        None,
        ".",
        0
    )
    print(f"Printing for {pdf_path} completed")

    return jsonify({"status": "printed", "file": filename})


if __name__ == "__main__":
    app.run(port=5000)