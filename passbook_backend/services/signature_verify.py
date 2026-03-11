from pymongo import MongoClient
from sklearn.metrics.pairwise import cosine_similarity
from models.mobilenet_model import generate_embedding
from urllib.parse import quote_plus
import os
from dotenv import load_dotenv

load_dotenv()
username = os.getnv("USERNAME")
password = os.getenv("PASSWORD")
# connect mongo
uri=f"mongodb+srv://{username}:{password}@cluster0.kec8ius.mongodb.net/?appName=Cluster0"
client = MongoClient(uri)
db = client["bank"]
collection = db["signature_cards"]


def verify_signature(account_number, image_path):

    uploaded_embedding = generate_embedding(image_path)

    record = collection.find_one({"accountNumber": account_number})

    if not record:
        return False, "No signature on file"

    stored_embedding = record["embedding"]

    similarity = cosine_similarity(
        [uploaded_embedding],
        [stored_embedding]
    )[0][0]

    print("Similarity:", similarity)

    if similarity > 0.80:
        return True, similarity
    else:
        return False, similarity