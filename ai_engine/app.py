from fastapi import FastAPI
from pydantic import BaseModel
from ai_engine.ollama_client import embed_text_phi, generate_answer_phi
from ai_engine.db import fetch_all_vectors
import numpy as np

app = FastAPI()

def cosine_similarity(a, b):
    a = np.array(a, dtype=np.float32)
    b = np.array(b, dtype=np.float32)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

def get_top_k_context(query_emb, table, path_col, k=3):
    vectors = fetch_all_vectors(table, path_col)
    scored = []
    for row in vectors:
        chunk_emb = row[3]
        score = cosine_similarity(query_emb, chunk_emb)
        scored.append((score, row[2]))
    scored.sort(reverse=True)
    top_contexts = [text for score, text in scored[:k]]
    print("Retrieved context for LLM:", top_contexts)  # Debug print
    return top_contexts

class ChatRequest(BaseModel):
    question: str
    context_type: str = "syllabus"  # or "question"

@app.post("/chat")
async def chat(req: ChatRequest):
    query_emb = embed_text_phi(req.question)
    if req.context_type == "syllabus":
        table = "pdf_vectors"
        path_col = "syllabus_path"
    else:
        table = "question_vectors"
        path_col = "question_path"
    context_chunks = get_top_k_context(query_emb, table, path_col)
    context = "\n\n".join(context_chunks)
    prompt = f"""You are an expert assistant. Use ONLY the following syllabus content to answer the question. If the answer is not in the syllabus, say "I don't know".

Syllabus:
{context}

Question: {req.question}
Answer:"""
    answer = generate_answer_phi(prompt)
    return {"answer": answer}