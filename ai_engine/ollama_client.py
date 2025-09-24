import requests
import time

OLLAMA_URL = "http://localhost:11434"

def embed_text_phi(text, model="phi:latest"):
    """Get embedding vector for text using Ollama"""
    try:
        start_time = time.time()
        response = requests.post(
            f"{OLLAMA_URL}/api/embeddings",
            json={"model": model, "prompt": text},
            timeout=30
        )
        response.raise_for_status()
        duration = time.time() - start_time
        
        embedding = response.json()["embedding"]
        print(f"Generated embedding with {len(embedding)} dimensions in {duration:.2f}s")
        return embedding
    except Exception as e:
        print(f"Error generating embedding: {e}")
        raise

# def generate_answer_phi(prompt, model="phi:latest"):
#     """Generate text completion using Ollama"""
#     try:
#         start_time = time.time()
#         response = requests.post(
#             f"{OLLAMA_URL}/api/generate",
#             json={
#                 "model": model,
#                 "prompt": prompt,
#                 "stream": False,
#                 "temperature": 0.7,
#                 "top_p": 0.9
#             },
#             timeout=60
#         )
#         response.raise_for_status()
#         duration = time.time() - start_time
        
#         answer = response.json()["response"]
#         print(f"Generated answer in {duration:.2f}s")
#         return answer
#     except Exception as e:
#         print(f"Error generating answer: {e}")
#         raise

def generate_answer_phi(prompt, model="phi:latest", max_retries=2):
    """Generate text completion using Ollama with retry on timeout"""
    for attempt in range(max_retries):
        try:
            start_time = time.time()
            response = requests.post(
                f"{OLLAMA_URL}/api/generate",
                json={
                    "model": model,
                    "prompt": prompt,
                    "stream": False,
                    "temperature": 0.7,
                    "top_p": 0.9
                },
                timeout=60
            )
            response.raise_for_status()
            duration = time.time() - start_time
            answer = response.json()["response"]
            print(f"Generated answer in {duration:.2f}s")
            return answer
        except requests.exceptions.Timeout:
            print(f"Timeout on attempt {attempt+1}, retrying...")
            continue
        except Exception as e:
            print(f"Error generating answer: {e}")
            raise
    raise Exception("Ollama failed after retries")