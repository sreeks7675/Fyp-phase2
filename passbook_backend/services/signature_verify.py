from pymongo import MongoClient
from sklearn.metrics.pairwise import cosine_similarity
from models.mobilenet_model import generate_embedding
from urllib.parse import quote_plus
import os
from dotenv import load_dotenv
import numpy as np

load_dotenv()
username = quote_plus("SreekarKashyap")
password = quote_plus("Sreekar@12023")
# connect mongo
uri=f"mongodb+srv://{username}:{password}@cluster0.kec8ius.mongodb.net/?appName=Cluster0"
client = MongoClient(uri)
db = client["bank"]
collection = db["Signature_Card"]

def verify_signature(account_number, image_path):

    uploaded_embedding = generate_embedding(image_path)

    # Normalize embedding
    uploaded_embedding = uploaded_embedding / np.linalg.norm(uploaded_embedding)

    record = collection.find_one({"accountNumber": account_number})

    if not record:
        return False, "No signature on file"

    stored_embedding = np.array(record["embedding"])
    stored_embedding = stored_embedding / np.linalg.norm(stored_embedding)

    similarity = cosine_similarity(
        [uploaded_embedding],
        [stored_embedding]
    )[0][0]

    print("Similarity Score:", similarity)

    # Recommended threshold after preprocessing
    if similarity > 0.998:
        return True, float(similarity)
    else:
        return False, float(similarity)