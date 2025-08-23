import os
import psycopg2
import numpy as np
import ast
from dotenv import load_dotenv

load_dotenv()
PG_CONN_STR = os.getenv("PG_CONN_STR", "postgresql://postgres:admin@localhost:5432/bca_notes_ai")

def get_conn():
    return psycopg2.connect(PG_CONN_STR)

def insert_vector(table, path, chunk_text, embedding):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        f"INSERT INTO {table} (syllabus_path, chunk_text, embedding) VALUES (%s, %s, %s)",
        (path, chunk_text, embedding)
    )
    conn.commit()
    cur.close()
    conn.close()

def insert_question_vector(table, path, chunk_text, embedding):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        f"INSERT INTO {table} (question_path, chunk_text, embedding) VALUES (%s, %s, %s)",
        (path, chunk_text, embedding)
    )
    conn.commit()
    cur.close()
    conn.close()

def fetch_all_vectors(table, path_col):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(f"SELECT id, {path_col}, chunk_text, embedding FROM {table}")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    result = []
    for row in rows:
        emb = row[3]
        # If embedding is a string, parse it to a list
        if isinstance(emb, str):
            emb = np.array(ast.literal_eval(emb), dtype=np.float32)
        else:
            emb = np.array(emb, dtype=np.float32)
        result.append((row[0], row[1], row[2], emb))
    return result