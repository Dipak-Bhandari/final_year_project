import os
import psycopg2
import numpy as np
import ast
from dotenv import load_dotenv

load_dotenv()
PG_CONN_STR = os.getenv("PG_CONN_STR", "postgresql://postgres:admin@localhost:5432/bca_notes_ai")

def get_conn():
    try:
        return psycopg2.connect(PG_CONN_STR)
    except Exception as e:
        print(f"Database connection error: {e}")
        raise

def insert_vector(table, path, chunk_text, embedding, course_title, course_code, keywords, unit_title, is_course_content, is_laboratory_work):
    try:
        conn = get_conn()
        cur = conn.cursor()
        print(f"Inserting into {table}: {path}")
        cur.execute(
            f"""INSERT INTO {table} 
            (syllabus_path, chunk_text, embedding, course_title, course_code, keywords, unit_title, is_course_content, is_laboratory_work) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)""",
            (path, chunk_text, embedding, course_title, course_code, keywords, unit_title, is_course_content, is_laboratory_work)
        )
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error inserting vector: {e}")
        raise

def insert_question_vector(table, path, chunk_text, embedding, course_title, course_code, keywords,year):
    try:
        conn = get_conn()
        cur = conn.cursor()
        print(f"Inserting question into {table}: {path}")
        cur.execute(
            f"""INSERT INTO {table} 
            (question_path, chunk_text, embedding, course_title, course_code, keywords,year) 
            VALUES (%s, %s, %s, %s, %s, %s, %s)""",
            (path, chunk_text, embedding, course_title, course_code, keywords, year)
        )
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error inserting question vector: {e}")
        raise

def fetch_all_vectors(table, path_col):
    try:
        conn = get_conn()
        cur = conn.cursor()
        print(f"Fetching vectors from {table} using {path_col}")
        
        # Fetch all metadata columns
        cur.execute(
            f"""SELECT id, {path_col}, chunk_text, embedding, course_title, course_code, keywords, unit_title, is_course_content, is_laboratory_work
                FROM {table}"""
        )
        rows = cur.fetchall()
        print(f"Found {len(rows)} vectors in {table}")
        cur.close()
        conn.close()
        
        result = []
        for i, row in enumerate(rows):
            try:
                id_val, path, chunk_text, emb, course_title, course_code, keywords, unit_title, is_course_content, is_laboratory_work = row
                # Convert embedding to numpy array depending on its type
                if isinstance(emb, str):
                    emb = np.array(ast.literal_eval(emb), dtype=np.float32)
                elif isinstance(emb, list):
                    emb = np.array(emb, dtype=np.float32)
                else:
                    emb = np.array(emb, dtype=np.float32)
                # Return all metadata for downstream use
                result.append((id_val, path, chunk_text, emb, course_title, course_code, keywords, unit_title, is_course_content, is_laboratory_work))
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
        params = [year]
        if course_title:
            query += " AND course_title = %s"
            params.append(course_title)
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
                WHERE course_title = %s
                GROUP BY chunk_text
                HAVING COUNT(*) > 1
                ORDER BY freq DESC""",
            (course_title,)
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        print(f"Error fetching repeated questions: {e}")
        return []