import psycopg2
import numpy as np
import requests
import os

PG_CONN_STR = os.getenv("PG_CONN_STR", "postgresql://postgres:admin@localhost:5432/bca_notes_ai")

def embed_query_phi2(query):
    url = "http://localhost:11434/api/embeddings"
    data = {"model": "phi", "prompt": query}
    response = requests.post(url, json=data)
    return np.array(response.json()["embedding"])

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def search_vectors(query, top_k=3):
    query_emb = embed_query_phi2(query)
    conn = psycopg2.connect(PG_CONN_STR)
    cur = conn.cursor()
    cur.execute("SELECT id, chunk_text, embedding FROM pdf_vectors")
    results = []
    for row in cur.fetchall():
        chunk_emb = np.array(row[2])
        score = cosine_similarity(query_emb, chunk_emb)
        results.append((score, row[1]))
    cur.close()
    conn.close()
    results.sort(reverse=True)
    return [text for score, text in results[:top_k]]