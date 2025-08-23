import requests

OLLAMA_URL = "http://localhost:11434"

def embed_text_phi(text, model="phi:latest"):
    resp = requests.post(f"{OLLAMA_URL}/api/embeddings", json={"model": model, "prompt": text})
    resp.raise_for_status()
    return resp.json()["embedding"]

def generate_answer_phi(prompt, model="phi:latest"):
    resp = requests.post(f"{OLLAMA_URL}/api/generate", json={"model": model, "prompt": prompt, "stream": False})
    resp.raise_for_status()
    return resp.json()["response"]