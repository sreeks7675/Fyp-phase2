import os
import json
from pathlib import Path
from azure.storage.blob import BlobServiceClient
from rag.embed import embed_text
CONTAINER_NAME = os.environ.get("AZURE_BLOB_CONTAINER_NAME", "scheme-docs")
OUTPUT_FILE = Path(__file__).parent / "data" / "schemes.json"
def ingest():
    connection_string = os.environ["AZURE_BLOB_CONNECTION_STRING"]
    blob_service = BlobServiceClient.from_connection_string(connection_string)
    container = blob_service.get_container_client(CONTAINER_NAME)
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    schemes = []
    print(f"Connecting to container: {CONTAINER_NAME}")
    for blob in container.list_blobs():
        print(f"  Processing: {blob.name}")
        blob_client = container.get_blob_client(blob.name)
        content = blob_client.download_blob().readall().decode("utf-8")
        scheme = json.loads(content)
        # Embed the scheme's text content for similarity search
        embed_input = (
            f"{scheme.get('schemeName', '')}. "
            f"{scheme.get('content', '')}. "
            f"Eligibility: {scheme.get('eligibility', '')}"
        )
        embedding = embed_text(embed_input)
        schemes.append({
            "id": scheme.get("id"),
            "schemeName": scheme.get("schemeName"),
            "schemeNameTa": scheme.get("schemeNameTa"),
            "content": scheme.get("content"),
            "eligibility": scheme.get("eligibility"),
            "ageMin": scheme.get("ageMin"),
            "ageMax": scheme.get("ageMax"),
            "embedding": embedding,
        })
        print(f"  Embedded: {scheme.get('schemeName')}")
 
    OUTPUT_FILE.write_text(json.dumps(schemes, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nDone. {len(schemes)} schemes saved to {OUTPUT_FILE}")
 
 
if __name__ == "__main__":
    ingest()