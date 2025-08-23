import requests
from ai_engine.search_vectors import search_vectors

def ask_ollama_phi2(prompt):
    url = "http://localhost:11434/api/generate"
    data = {"model": "phi", "prompt": prompt, "stream": False}
    response = requests.post(url, json=data)
    return response.json()["response"]

def answer_question(query):
    context_chunks = search_vectors(query, top_k=3)
    context = "\n\n".join(context_chunks)
    prompt = f"Use the following syllabus content to answer the question:\n{context}\n\nQuestion: {query}\nAnswer:"
    return ask_ollama_phi2(prompt)