import os
import psycopg2
import numpy as np
import ast
from dotenv import load_dotenv
from pgvector.psycopg2 import register_vector  # For vector support

load_dotenv()
PG_CONN_STR = os.getenv("PG_CONN_STR", "postgresql://postgres:admin@localhost:5432/bca_notes_ai")

def get_conn():
    try:
        conn = psycopg2.connect(PG_CONN_STR)
        register_vector(conn)  # Enable pgvector
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        raise

# def init_db():
#     """Initialize tables and indexes with pgvector"""
#     conn = get_conn()
#     cur = conn.cursor()
    
#     # pdf_vectors table
#     cur.execute("""
#         CREATE EXTENSION IF NOT EXISTS vector;
#         CREATE TABLE IF NOT EXISTS pdf_vectors (
#             id SERIAL PRIMARY KEY,
#             syllabus_path TEXT,
#             chunk_text TEXT,
#             embedding VECTOR(384),  -- all-minilm dims
#             course_title TEXT,
#             course_code TEXT,
#             keywords TEXT,
#             unit_title TEXT,
#             is_course_content BOOLEAN DEFAULT FALSE,
#             is_laboratory_work BOOLEAN DEFAULT FALSE
#         );
#         CREATE INDEX IF NOT EXISTS pdf_vectors_embedding_idx 
#         ON pdf_vectors USING hnsw (embedding vector_cosine_ops);
#     """)
    
#     # question_vectors table
#     cur.execute("""
#         CREATE TABLE IF NOT EXISTS question_vectors (
#             id SERIAL PRIMARY KEY,
#             question_path TEXT,
#             chunk_text TEXT,
#             embedding VECTOR(384),
#             course_title TEXT,
#             course_code TEXT,
#             keywords TEXT,
#             year TEXT
#         );
#         CREATE INDEX IF NOT EXISTS question_vectors_embedding_idx 
#         ON question_vectors USING hnsw (embedding vector_cosine_ops);
#     """)
    
#     conn.commit()
#     cur.close()
#     conn.close()
#     print("DB initialized with pgvector tables and indexes.")

def init_db():
    """Initialize tables and indexes with pgvector"""
    conn = get_conn()
    cur = conn.cursor()
    
    # pdf_vectors table (without index first)
    cur.execute("""
        CREATE EXTENSION IF NOT EXISTS vector;
        CREATE TABLE IF NOT EXISTS pdf_vectors (
            id SERIAL PRIMARY KEY,
            syllabus_path TEXT,
            chunk_text TEXT,
            embedding VECTOR(384),
            course_title TEXT,
            course_code TEXT,
            keywords TEXT,
            unit_title TEXT,
            is_course_content BOOLEAN DEFAULT FALSE,
            is_laboratory_work BOOLEAN DEFAULT FALSE
        );
    """)
    
    # question_vectors table (without index first)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS question_vectors (
            id SERIAL PRIMARY KEY,
            question_path TEXT,
            chunk_text TEXT,
            embedding VECTOR(384),
            course_title TEXT,
            course_code TEXT,
            keywords TEXT,
            year TEXT
        );
    """)
    
    # Add indexes with proper HNSW settings
    cur.execute("""
        CREATE INDEX IF NOT EXISTS pdf_vectors_embedding_idx 
        ON pdf_vectors USING hnsw (embedding vector_cosine_ops)
        WITH (m=16, ef_construction=200);
    """)
    
    cur.execute("""
        CREATE INDEX IF NOT EXISTS question_vectors_embedding_idx 
        ON question_vectors USING hnsw (embedding vector_cosine_ops)
        WITH (m=16, ef_construction=200);
    """)
    
    conn.commit()
    cur.close()
    conn.close()
    print("DB initialized with pgvector tables and indexes.")

def insert_vector(table, path, chunk_text, embedding, course_title, course_code, keywords, unit_title, is_course_content, is_laboratory_work):
    try:
        conn = get_conn()
        cur = conn.cursor()
        print(f"Inserting into {table}: {path}")
        cur.execute(
            f"""INSERT INTO {table} 
            (syllabus_path, chunk_text, embedding, course_title, course_code, keywords, unit_title, is_course_content, is_laboratory_work) 
            VALUES (%s, %s, %s::vector, %s, %s, %s, %s, %s, %s)""",
            (path, chunk_text, embedding, course_title, course_code, keywords, unit_title, is_course_content, is_laboratory_work)
        )
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error inserting vector: {e}")
        raise

def insert_question_vector(table, path, chunk_text, embedding, course_title, course_code, keywords, year):
    try:
        conn = get_conn()
        cur = conn.cursor()
        print(f"Inserting question into {table}: {path}")
        cur.execute(
            f"""INSERT INTO {table} 
            (question_path, chunk_text, embedding, course_title, course_code, keywords, year) 
            VALUES (%s, %s, %s::vector, %s, %s, %s, %s)""",
            (path, chunk_text, embedding, course_title, course_code, keywords, year)
        )
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error inserting question vector: {e}")
        raise

def fetch_all_vectors(table, path_col):
    """Fetch vectors with consistent tuple structure (11 items: + year/None padding)"""
    try:
        conn = get_conn()
        cur = conn.cursor()
        print(f"Fetching vectors from {table} using {path_col}")
        
        if table == "question_vectors":
            # Query for questions: pad syllabus fields as NULL
            cur.execute(
                f"""SELECT id, {path_col}, chunk_text, embedding, course_title, course_code, keywords, 
                           year, NULL as unit_title, NULL as is_course_content, NULL as is_laboratory_work
                    FROM {table}"""
            )
        else:
            # Full query for syllabus
            cur.execute(
                f"""SELECT id, {path_col}, chunk_text, embedding, course_title, course_code, keywords, 
                           unit_title, is_course_content, is_laboratory_work, NULL as year
                    FROM {table}"""
            )
        
        rows = cur.fetchall()
        print(f"Found {len(rows)} vectors in {table}")
        cur.close()
        conn.close()
        
        result = []
        for i, row in enumerate(rows):
            try:
                id_val, path, chunk_text, emb_str, course_title, course_code, keywords, extra1, extra2, extra3, extra4 = row
                # Handle embedding (VECTOR type or fallback)
                if isinstance(emb_str, str):
                    emb = np.array(ast.literal_eval(emb_str), dtype=np.float32)
                elif hasattr(emb_str, 'tolist'):  # pgvector
                    emb = np.array(emb_str.tolist(), dtype=np.float32)
                else:
                    emb = np.array(emb_str, dtype=np.float32)
                
                # Consistent unpacking: year last
                if table == "question_vectors":
                    year = extra1
                    unit_title = extra2
                    is_course_content = extra3
                    is_laboratory_work = extra4
                else:
                    year = extra4
                    unit_title = extra1
                    is_course_content = extra2
                    is_laboratory_work = extra3
                
                result.append((id_val, path, chunk_text, emb, course_title, course_code, keywords, unit_title, is_course_content, is_laboratory_work, year))
            except Exception as e:
                print(f"Error processing row {i}: {e}")
                continue
        
        print(f"Successfully converted {len(result)} vectors")
        return result
        
    except Exception as e:
        print(f"Error fetching vectors: {e}")
        return []
    
def fetch_questions_by_year(table, year, course_title=None):
    """Fetch all questions for a given year (and optionally course_title)"""
    try:
        conn = get_conn()
        cur = conn.cursor()
        query = f"SELECT chunk_text, course_title, keywords FROM {table} WHERE year ILIKE %s"
        params = [f"%{year}%"]  # Fuzzy match
        if course_title:
            query += " AND course_title ILIKE %s"
            params.append(f"%{course_title}%")
        cur.execute(query, params)
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        print(f"Error fetching questions by year: {e}")
        return []

def fetch_repeated_questions(table, course_title):
    """Fetch questions that appear in multiple years for a given course_title"""
    try:
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"""SELECT chunk_text, COUNT(*) as freq
                FROM {table}
                WHERE course_title ILIKE %s
                GROUP BY chunk_text
                HAVING COUNT(*) > 1
                ORDER BY freq DESC
                LIMIT 20""",  # Limit for performance
            (f"%{course_title}%",)
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        print(f"Error fetching repeated questions: {e}")
        return []