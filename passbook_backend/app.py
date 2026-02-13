
from flask import Flask
from flask_cors import CORS
from routes.passbook import passbook_bp
from routes.verify import verify_bp

app = Flask(__name__)
CORS(app)
app.register_blueprint(passbook_bp)
app.register_blueprint(verify_bp)
if __name__ == "__main__":
    app.run(port=5071, debug=True)

