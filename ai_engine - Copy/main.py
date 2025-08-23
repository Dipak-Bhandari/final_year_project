
import psycopg2
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from sklearn.metrics.pairwise import cosine_similarity

# Database config
DB_CONFIG = {
    "host": "localhost",
    "port": 5432,
    "dbname": "bca_notes_ai",
    "user": "postgres",
    "password": "admin"
}

# FastAPI app instance
app = FastAPI()

# Request model
class QueryRequest(BaseModel):
    query: str
    context: str  # Either "syllabus" or "question"

def get_vectors_from_db(table_name: str):
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        cur.execute(f"SELECT id, content, vector FROM {table_name}")
        rows = cur.fetchall()
        data = []
        for row in rows:
            content_id = row[0]
            content_text = row[1]
            content_vector = np.array(row[2], dtype=np.float32)
            data.append((content_id, content_text, content_vector))
        cur.close()
        conn.close()
        return data
    except Exception as e:
        raise RuntimeError(f"Database error: {e}")

def embed_query(text: str):
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer("all-MiniLM-L6-v2")
    return model.encode([text])[0]

def find_best_match(query_embedding, data_vectors):
    if not data_vectors:
        return "No data found in database."

    vectors = [vec[2] for vec in data_vectors]
    similarities = cosine_similarity([query_embedding], vectors)[0]
    best_idx = int(np.argmax(similarities))
    best_match = data_vectors[best_idx]
    return best_match[1]  # return matched content

@app.post("/query")
def query_engine(request: QueryRequest):
    if request.context == "syllabus":
        table_name = "pdf_vectors"
    elif request.context == "question":
        table_name = "question_vectors"
    else:
        raise HTTPException(status_code=400, detail="Invalid context type. Use 'syllabus' or 'question'.")

    try:
        data = get_vectors_from_db(table_name)
        query_vec = embed_query(request.query)
        result = find_best_match(query_vec, data)
        return {"answer": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
