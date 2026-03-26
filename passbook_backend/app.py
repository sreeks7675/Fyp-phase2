
from flask import Flask
from flask_cors import CORS
from routes.passbook import passbook_bp
from routes.otp import otp_bp
from routes.signature import signature_bp
#from routes.verify import verify_bp

app = Flask(__name__)
CORS(app)
app.register_blueprint(passbook_bp)
app.register_blueprint(otp_bp)
app.register_blueprint(signature_bp)
#app.register_blueprint(verify_bp)
if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5071, debug=True)

