import os
import sys
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# Make sure we can import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ollama_client import embed_text_phi, generate_answer_phi
from db import fetch_all_vectors
from db import fetch_questions_by_year, fetch_repeated_questions
import time

app = FastAPI()

@app.on_event("startup")
async def preload_ollama_model():
    print("Preloading Ollama model for fast first response...")
    try:
        embed_text_phi("hello")  # Dummy request to load model into memory
    except Exception as e:
        print(f"Error preloading Ollama model: {e}")

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
    

# def get_top_k_context(query_emb, table, k=100):
    """Retrieve top k most similar context chunks using cosine similarity"""
    try:
        # Determine which path column to use based on the table
        path_col = "syllabus_path" if table == "pdf_vectors" else "question_path"
        
        # Fetch all vectors from the database
        vectors = fetch_all_vectors(table, path_col)
        
        if not vectors:
            print(f"Warning: No vectors found in {table}")
            return []
        
        # Calculate similarity scores
        scored = []
        for row in vectors:
            id_val, path, chunk_text, chunk_emb = row
            
            # Safety check for embedding dimensions
            if len(query_emb) != len(chunk_emb):
                print(f"Warning: Embedding dimension mismatch. Query: {len(query_emb)}, Chunk: {len(chunk_emb)}")
                continue
            
            # Calculate cosine similarity
            score = cosine_similarity(query_emb, chunk_emb)
            
            # Store score and chunk text
            scored.append((score, chunk_text))
        
        # Sort by similarity score (descending)
        scored.sort(key=lambda x: x[0], reverse=True)
        
        # Get top k chunks
        top_contexts = [text for score, text in scored[:k]]
        
        # Print first result for debugging
        if top_contexts:
            print(f"Top similarity score: {scored[0][0]}")
            print(f"Top chunk: {top_contexts[0][:100]}...")
            
        return top_contexts
    
    except Exception as e:
        print(f"Error in get_top_k_context: {e}")
        import traceback
        traceback.print_exc()
        return []



def get_top_k_context(query_emb, table, k=10, query_text=None):
    path_col = "syllabus_path" if table == "pdf_vectors" else "question_path"
    vectors = fetch_all_vectors(table, path_col)
    if not vectors:
        print(f"Warning: No vectors found in {table}")
        return []
    scored = []
    # If the query is about course contents, filter for those chunks
    filter_course_contents = False
    if query_text and "course content" in query_text.lower():
        filter_course_contents = True
    for row in vectors:
        id_val, path, chunk_text, chunk_emb, course_title, course_code, keywords, unit_title, is_course_content, is_laboratory_work = row
        if filter_course_contents and not is_course_content:
            continue  # Only use course content chunks
        if len(query_emb) != len(chunk_emb):
            continue
        score = cosine_similarity(query_emb, chunk_emb)
        scored.append((score, chunk_text))
    scored.sort(key=lambda x: x[0], reverse=True)
    top_contexts = [text for score, text in scored[:k]]
    return top_contexts
    
class ChatRequest(BaseModel):
    question: str
    context_type: str = "questions"  # or "question"
    top_k: int = 10

@app.post("/chat")
async def chat(req: ChatRequest):
    """API endpoint for chat"""
    print(f"\n--- New chat request ---")
    print(f"Question: {req.question}")
    print(f"Context type: {req.context_type}")
    print(f"Top K: {req.top_k}")

    greetings = ["hello", "hi", "hey", "namaste", "good morning", "good afternoon", "good evening"]
    if req.question.strip().lower() in greetings:
        return {
            "success": True,
            "answer": "Hello! How can I help you with your BCA syllabus or questions today?",
            "model_used": "phi:latest",
            "response_time": None,
            "context_chunks_used": 0
        }
    try:
        start_time = time.time()
        query_emb = embed_text_phi(req.question)

        # Auto-detect context type for question-related queries
        question_keywords = ["question", "questions", "previous year", "board paper", "repeated", "exam", "group b", "group c"]
        auto_context = req.context_type
        if any(word in req.question.lower() for word in question_keywords):
            auto_context = "questions"
        table = "pdf_vectors" if auto_context == "syllabus" else "question_vectors"

        context_chunks = get_top_k_context(query_emb, table, k=req.top_k, query_text=req.question)
        if not context_chunks:
            return {
                "answer": f"I don't have enough context in the {auto_context} database to answer your question. Please try a different question or make sure the database has been populated with content."
            }
        context = "\n\n".join(context_chunks)
        print(f"Using {len(context_chunks)} context chunks for answer generation")
        prompt = f"""You are an expert BCA teaching assistant. Answer the following question using ONLY 
the information provided in the context below. If the answer cannot be found in the context,
say "I don't have enough information to answer that question based on the available course materials."

Context from {auto_context}:
{context}

Question: {req.question}

Answer:"""
        answer = generate_answer_phi(prompt)
        response_time = time.time() - start_time
        print(f"Response time: {response_time:.2f}s")
        if response_time > 20:
            print("Warning: Slow response detected!")
        return {
            "success": True,
            "answer": answer,
            "model_used": "phi:latest",
            "response_time": response_time,
            "context_chunks_used": len(context_chunks)
        }
    except Exception as e:
        print(f"Error processing chat request: {e}")
        import traceback
        traceback.print_exc()
        return {
            "success": False,
            "answer": f"Sorry, an error occurred while processing your request: {str(e)}",
            "model_used": "phi:latest",
            "response_time": None,
            "context_chunks_used": 0
        }
#     try:
#         # Step 1: Generate embedding for the question
#         query_emb = embed_text_phi(req.question)
        
#         # Step 2: Determine which table to use based on context_type
#         table = "pdf_vectors" if req.context_type == "syllabus" else "question_vectors"
        
#         # Step 3: Get relevant context using cosine similarity
#         context_chunks = get_top_k_context(query_emb, table)
        
#         # Check if we found any context
#         if not context_chunks:
#             return {
#                 "answer": f"I don't have enough context in the {req.context_type} database to answer your question. Please try a different question or make sure the database has been populated with content."
#             }
        
#         # Step 4: Combine context chunks into a single context
#         context = "\n\n".join(context_chunks)
#         print(f"Using {len(context_chunks)} context chunks for answer generation")
        
#         # Step 5: Create prompt with the context and question
#         prompt = f"""You are an expert BCA teaching assistant. Answer the following question using ONLY 
# the information provided in the context below. If the answer cannot be found in the context,
# say "I don't have enough information to answer that question based on the available course materials."

# Context from {req.context_type}:
# {context}

# Question: {req.question}

# Answer:"""
        
#         # Step 6: Generate answer using the prompt
#         answer = generate_answer_phi(prompt)
        
#         # Step 7: Return the answer
#         return {"answer": answer}
        
#     except Exception as e:
#         print(f"Error processing chat request: {e}")
#         import traceback
#         traceback.print_exc()
#         return {
#             "answer": f"Sorry, an error occurred while processing your request: {str(e)}"
#         }


class QuestionQuery(BaseModel):
    year: str
    course_title: str = None

@app.post("/questions/by_year")
async def get_questions_by_year(query: QuestionQuery):
    rows = fetch_questions_by_year("question_vectors", query.year, query.course_title)
    if not rows:
        return {"questions": [], "message": "No questions found for the given year/course."}
    return {"questions": [{"question": r[0], "course_title": r[1], "keywords": r[2]} for r in rows]}

class RepeatedQuery(BaseModel):
    course_title: str

@app.post("/questions/repeated")
async def get_repeated_questions(query: RepeatedQuery):
    rows = fetch_repeated_questions("question_vectors", query.course_title)
    if not rows:
        return {"questions": [], "message": "No repeated questions found for this course."}
    return {"questions": [{"question": r[0], "frequency": r[1]} for r in rows]}

@app.get("/")
def root():
    """Root endpoint for API health check"""
    return {
        "status": "BCA Notes AI is running",
        "version": "1.0.0",
        "description": "RAG system for BCA syllabus questions"
    }