import os
from db import insert_vector, insert_question_vector
from ollama_client import embed_text_phi
# from ai_engine.db import insert_vector, insert_question_vector
# from ai_engine.ollama_client import embed_text_phi

def extract_chunks_by_unit(txt_path):
    with open(txt_path, "r", encoding="utf-8") as f:
        text = f.read()
    units = text.split("Unit ")
    chunks = []
    for unit in units[1:]:
        title = unit.split("\n", 1)[0]
        content = unit
        chunks.append(f"Unit {title}\n{content}")
    return chunks if chunks else [text]

def embed_folder(folder, table, path_col):
    for root, dirs, files in os.walk(folder):
        for file in files:
            if file.endswith(".txt"):
                path = os.path.join(root, file)
                chunks = extract_chunks_by_unit(path)
                for chunk in chunks:
                    emb = embed_text_phi(chunk)
                    if table == "pdf_vectors":
                        insert_vector(table, path, chunk, emb)
                    else:
                        insert_question_vector(table, path, chunk, emb)

if __name__ == "__main__":
    print("Embedding syllabus...")
    embed_folder("syllabus", "pdf_vectors", "syllabus_path")
    print("Embedding questions...")
    embed_folder("questions", "question_vectors", "question_path")
    print("Embedding complete.")