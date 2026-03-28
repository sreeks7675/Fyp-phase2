import os
from openai import AzureOpenAI
client = AzureOpenAI(
    api_key=os.environ["AZURE_OPENAI_KEY"],
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
    api_version="2024-02-01",
)
DEPLOYMENT = os.environ.get("AZURE_OPENAI_DEPLOYMENT", "text-embedding-small")
def embed_text(text: str) -> list[float]:
    res = client.embeddings.create(
        model=DEPLOYMENT,
        input=text,
    )
    return res.data[0].embedding