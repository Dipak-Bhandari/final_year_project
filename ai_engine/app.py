import os
import sys
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import time
from rank_bm25 import BM25Okapi  # For hybrid search

# Make sure we can import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ollama_client import embed_text, generate_answer  # Updated imports
from db import (
    fetch_all_vectors,
    fetch_questions_by_year,
    fetch_repeated_questions,
    get_conn,
    init_db,
)  # Added init_db
from model_monitor import model_monitor  # Integrated monitoring

app = FastAPI()


@app.on_event("startup")
async def startup():
    print("Initializing DB and preloading models...")
    # init_db()  # One-time pgvector setup
    embed_text("hello")  # Preload embed model
    generate_answer("warmup")  # Preload gen model


# Add CORS to allow requests from your Laravel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def cosine_similarity(a, b):
    """Calculate cosine similarity between two vectors"""
    try:
        a = np.array(a, dtype=np.float32)
        b = np.array(b, dtype=np.float32)
        return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))
    except Exception as e:
        print(f"Error calculating cosine similarity: {e}")
        return 0.0


def get_top_k_hybrid(query_emb, table, k=10, query_text=None):
    """Hybrid ANN + BM25 retrieval with metadata"""
    from pgvector.psycopg2 import register_vector  # For vector ops

    conn = get_conn()
    register_vector(conn)
    cur = conn.cursor()
    path_col = "syllabus_path" if table == "pdf_vectors" else "question_path"

    # Step 1: ANN semantic search (top 50 candidates via pgvector)
    # Handle both list and numpy array inputs
    if isinstance(query_emb, list):
        query_emb_list = query_emb
        query_emb_np = np.array(query_emb, dtype=np.float32)
    else:
        query_emb_list = query_emb.tolist()
        query_emb_np = query_emb

    # Build query based on table (pdf_vectors doesn't have 'year')
    if table == "pdf_vectors":
        query_sql = f"""
        SELECT id, {path_col}, chunk_text, embedding, course_title, course_code, keywords,
               unit_title, is_course_content, is_laboratory_work, NULL as year
        FROM {table}
        ORDER BY embedding <=> %s::vector LIMIT 50
        """
    else:
        query_sql = f"""
        SELECT id, {path_col}, chunk_text, embedding, course_title, course_code, keywords,
               NULL as unit_title, NULL as is_course_content, NULL as is_laboratory_work, year
        FROM {table}
        ORDER BY embedding <=> %s::vector LIMIT 50
        """

    cur.execute(query_sql, (query_emb_list,))
    candidates = cur.fetchall()
    cur.close()
    conn.close()

    if not candidates:
        print(f"Warning: No vectors found in {table}")
        return [], ""

    # Step 2: BM25 keyword scoring on candidates
    texts = [row[2] for row in candidates]  # chunk_text
    tokenized = [text.split() for text in texts]
    bm25 = BM25Okapi(tokenized)
    query_tokens = query_text.lower().split()
    keyword_scores = bm25.get_scores(query_tokens)

    # Step 3: Blend scores and filter
    scored = []
    filter_course_contents = query_text and "course content" in query_text.lower()
    for i, row in enumerate(candidates):
        (
            id_val,
            path,
            chunk_text,
            emb,
            course_title,
            course_code,
            keywords,
            unit_title,
            is_course_content,
            is_laboratory_work,
            year,
        ) = row

        # Semantic distance (approx cosine via L2 norm)
        emb_np = np.array(emb, dtype=np.float32)
        dist = np.linalg.norm(query_emb_np - emb_np)
        sem_score = 1 - (dist / np.sqrt(2 * len(query_emb_np)))  # Normalized [0,1]

        # Hybrid score
        hybrid_score = 0.7 * sem_score + 0.3 * keyword_scores[i]

        # Filters
        if filter_course_contents and table == "pdf_vectors" and not is_course_content:
            continue

        scored.append((hybrid_score, chunk_text, year or "", unit_title or ""))

    # Sort and select top k
    scored.sort(key=lambda x: x[0], reverse=True)
    top_chunks = scored[:k]

    # Extract texts and metadata
    context_texts = [text for _, text, _, _ in top_chunks]
    metadata_lines = [f"Year: {y}, Unit: {u}" for _, _, y, u in top_chunks if y or u]
    metadata = "\n".join(set(metadata_lines))  # Dedup

    # Log retrieval quality
    if top_chunks:
        avg_score = np.mean([s[0] for s in top_chunks])
        model_monitor.log_quality_score(
            "rag_retrieval", avg_score, f"Query: {query_text[:50]}"
        )
        print(
            f"Hybrid retrieval: Avg score {avg_score:.3f}, Top metadata: {metadata[:100]}..."
        )

    return context_texts, metadata


class ChatRequest(BaseModel):
    question: str
    context_type: str = "questions"  # or "syllabus"
    top_k: int = 10


@app.post("/chat")
async def chat(req: ChatRequest):
    """API endpoint for chat with hybrid RAG"""
    print(f"\n--- New chat request ---")
    print(f"Question: {req.question}")
    print(f"Context type: {req.context_type}")
    print(f"Top K: {req.top_k}")

    greetings = [
        "hello",
        "hi",
        "hey",
        "namaste",
        "good morning",
        "good afternoon",
        "good evening",
    ]
    if req.question.strip().lower() in greetings:
        return {
            "success": True,
            "answer": "Hello! How can I help you with your BCA syllabus or questions today?",
            "model_used": "phi3:mini",
            "response_time": None,
            "context_chunks_used": 0,
        }

    start_time = model_monitor.start_timer()  # Monitor timing
    try:
        model_monitor.log_model_usage("rag_system", "chat")  # Track usage

        query_emb = embed_text(req.question)

        # Auto-detect context type
        question_keywords = [
            "question",
            "questions",
            "previous year",
            "board paper",
            "repeated",
            "exam",
            "group b",
            "group c",
        ]
        auto_context = req.context_type
        if any(word in req.question.lower() for word in question_keywords):
            auto_context = "questions"
        table = "pdf_vectors" if auto_context == "syllabus" else "question_vectors"

        context_chunks, metadata = get_top_k_hybrid(
            query_emb, table, k=req.top_k, query_text=req.question
        )
        if not context_chunks:
            answer = f"I don't have enough context in the {auto_context} database to answer your question. Please try a different question or make sure the database has been populated with content."
            return {
                "success": True,
                "answer": answer,
                "model_used": "phi3:mini",
                "response_time": model_monitor.end_timer(start_time),
                "context_chunks_used": 0,
            }

        context = "\n\n".join(context_chunks)
        print(f"Using {len(context_chunks)} context chunks for answer generation")

        # Enhanced prompt with metadata
        prompt = f"""You are an expert BCA teaching assistant for Tribhuvan University (TU) Nepal. Answer the following question using ONLY
the information provided in the context below. If the answer cannot be found in the context,
say "I don't have enough information to answer that question based on the available course materials." Provide insights like repeated questions or unit references where relevant.

Context from {auto_context}:
{context}

Metadata: {metadata}

Question: {req.question}

Answer:"""

        answer = generate_answer(prompt)
        response_time = model_monitor.end_timer(start_time)
        model_monitor.log_response_time(
            "phi3:mini", "chat", response_time
        )  # Log response

        print(f"Response time: {response_time:.2f}s")
        return {
            "success": True,
            "answer": answer,
            "model_used": "phi3:mini",
            "response_time": response_time,
            "context_chunks_used": len(context_chunks),
        }
    except Exception as e:
        response_time = model_monitor.end_timer(start_time)
        model_monitor.log_error("phi3:mini", "chat_error", str(e))
        print(f"Error processing chat request: {e}")
        import traceback

        traceback.print_exc()
        return {
            "success": False,
            "answer": f"Sorry, an error occurred while processing your request: {str(e)}",
            "model_used": "phi3:mini",
            "response_time": response_time,
            "context_chunks_used": 0,
        }


class QuestionQuery(BaseModel):
    year: str
    course_title: str = None


@app.post("/questions/by_year")
async def get_questions_by_year(query: QuestionQuery):
    rows = fetch_questions_by_year("question_vectors", query.year, query.course_title)
    if not rows:
        return {
            "questions": [],
            "message": "No questions found for the given year/course.",
        }
    return {
        "questions": [
            {"question": r[0], "course_title": r[1], "keywords": r[2]} for r in rows
        ]
    }


class RepeatedQuery(BaseModel):
    course_title: str


@app.post("/questions/repeated")
async def get_repeated_questions(query: RepeatedQuery):
    rows = fetch_repeated_questions("question_vectors", query.course_title)
    if not rows:
        return {
            "questions": [],
            "message": "No repeated questions found for this course.",
        }
    return {"questions": [{"question": r[0], "frequency": r[1]} for r in rows]}


@app.get("/health")
async def health():
    """Health check endpoint"""
    return model_monitor.health_check()


@app.get("/")
def root():
    """Root endpoint for API health check"""
    return {
        "status": "BCA Notes AI is running",
        "version": "2.0.0",  # Updated version
        "description": "Enhanced RAG system for BCA syllabus questions with hybrid search",
    }