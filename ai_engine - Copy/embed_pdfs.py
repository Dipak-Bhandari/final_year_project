# import os
# import PyPDF2
# import psycopg2
# import requests
# import numpy as np
# from pdf2image import convert_from_path
# import pytesseract

# # PG_CONN_STR = os.getenv("PG_CONN_STR", "postgresql://postgres:admin@localhost:5432/bca_notes_ai")
# PG_CONN_STR = "postgresql://postgres:admin@localhost:5432/bca_notes_ai"

# # def extract_text_chunks(pdf_path, chunk_size=500):
# #     # text = ""
# #     # with open(pdf_path, "rb") as f:
# #     #     reader = PyPDF2.PdfReader(f)
# #     #     for page in reader.pages:
# #     #         text += page.extract_text() or ""
# #     # return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
# #     try:
# #         pages = convert_from_path(pdf_path)
# #         text = ""
# #         for image in pages:
# #             text += pytesseract.image_to_string(image)
# #         return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
# #     except Exception as e:
# #         print(f"❌ OCR failed for {pdf_path}: {e}")
# #         return []

# def extract_chunks_from_txt(txt_path, chunk_size=500):
#     try:
#         with open(txt_path, "r", encoding="utf-8") as f:
#             text = f.read()
#         return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
#     except Exception as e:
#         print(f"❌ Error reading {txt_path}: {e}")
#         return []

# def embed_text_phi2(text):
#     url = "http://localhost:11434/api/embeddings"
#     data = {"model": "phi", "prompt": text}
#     response = requests.post(url, json=data)
#     result = response.json()
    
#     embedding = result.get("embedding", [])
#     if len(embedding) != 384:
#         raise ValueError(f"Expected 384 dimensions, got {len(embedding)}")
    
#     return np.array(embedding)
#     # return np.array(response.json()["embedding"])

# def store_embedding(path, chunk_text, embedding, table="pdf_vectors"):
#     try:
#         conn = psycopg2.connect(PG_CONN_STR)
#         cur = conn.cursor()

#         embedding_str = "[" + ",".join(map(str, embedding)) + "]"

#         if table == "pdf_vectors":
#             cur.execute(
#                 "INSERT INTO pdf_vectors (syllabus_path, chunk_text, embedding) VALUES (%s, %s, %s)",
#                 (path, chunk_text, embedding_str)
#             )
#         elif table == "question_vectors":
#             cur.execute(
#                 "INSERT INTO question_vectors (question_path, chunk_text, embedding) VALUES (%s, %s, %s)",
#                 (path, chunk_text, embedding_str)
#             )
#         else:
#             print(f"⚠️ Unknown table: {table}")
#             return

#         conn.commit()
#         cur.close()
#         conn.close()
#     except Exception as e:
#         print(f"❌ Error storing embedding: {e}")


# # def process_all_pdfs(pdf_dir="ai_engine/syllabus"):
# #      for root, dirs, files in os.walk(pdf_dir):
# #         for file in files:
# #             if file.endswith(".pdf"):
# #                 path = os.path.join(root, file)
# #                 print(f"📄 Processing {path}")
# #                 chunks = extract_text_chunks(path)
# #                 print(f"✅ Extracted {len(chunks)} chunks")
# #                 for i, chunk in enumerate(chunks):
# #                     print(f"🧩 Chunk {i+1}: {chunk[:60].strip()}...")
# #                     try:
# #                         emb = embed_text_phi2(chunk)
# #                         print(f"✨ Embedding preview: {emb[:5]}")
# #                         store_embedding(path, chunk, emb)
# #                         print("✅ Stored in DB\n")
# #                     except Exception as e:
# #                         print(f"❌ Error embedding or storing: {e}")
# def process_all_txts(base_dir="ai_engine"):
#     for folder in ["syllabus", "questions"]:
#         target_table = "pdf_vectors" if folder == "syllabus" else "question_vectors"
#         full_path = os.path.join(base_dir, folder)

#         for root, dirs, files in os.walk(full_path):
#             for file in files:
#                 if file.endswith(".txt"):
#                     path = os.path.join(root, file)
#                     print(f"📄 Processing {path}")

#                     chunks = extract_chunks_from_txt(path)
#                     print(f"✅ Extracted {len(chunks)} chunks")

#                     for i, chunk in enumerate(chunks):
#                         print(f"🧩 Chunk {i+1}: {chunk[:60].strip()}...")
#                         try:
#                             emb = embed_text_phi2(chunk)
#                             print(f"✨ Embedding preview: {emb[:5]}")
#                             store_embedding(path, chunk, emb, table=target_table)
#                             print(f"✅ Stored in {target_table}\n")
#                         except Exception as e:
#                             print(f"❌ Error embedding or storing: {e}")

# if __name__ == "__main__":
#     process_all_txts()



import os
import PyPDF2
import psycopg2
import requests
import numpy as np
from pdf2image import convert_from_path
import pytesseract

# PG_CONN_STR = os.getenv("PG_CONN_STR", "postgresql://postgres:admin@localhost:5432/bca_notes_ai")
PG_CONN_STR = "postgresql://postgres:admin@localhost:5432/bca_notes_ai"

def extract_chunks_from_txt(txt_path, chunk_size=500):
    try:
        with open(txt_path, "r", encoding="utf-8") as f:
            text = f.read()
        return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
    except Exception as e:
        print(f"❌ Error reading {txt_path}: {e}")
        return []

def embed_text_phi2(text):
    url = "http://localhost:11434/api/embeddings"
    data = {"model": "phi", "prompt": text}
    
    try:
        response = requests.post(url, json=data, timeout=30)
        response.raise_for_status()  # Raise an exception for bad status codes
        result = response.json()
        
        embedding = result.get("embedding", [])
        
        # Remove the dimension check since different phi models may have different dimensions
        # The database schema should be updated to match the actual embedding dimensions
        print(f"📊 Embedding dimensions: {len(embedding)}")
        
        return np.array(embedding)
    except requests.exceptions.ConnectionError:
        print("❌ Connection refused. Please make sure Ollama is running on localhost:11434")
        print("💡 To start Ollama, run: ollama serve")
        print("💡 To pull the phi model, run: ollama pull phi")
        return None
    except requests.exceptions.Timeout:
        print("❌ Request timeout. The embedding request took too long.")
        return None
    except Exception as e:
        print(f"❌ Error getting embedding: {e}")
        return None

def store_embedding(path, chunk_text, embedding, table="pdf_vectors"):
    if embedding is None:
        print("⚠️ Skipping storage due to embedding error")
        return
        
    try:
        conn = psycopg2.connect(PG_CONN_STR)
        cur = conn.cursor()

        embedding_str = "[" + ",".join(map(str, embedding)) + "]"

        if table == "pdf_vectors":
            cur.execute(
                "INSERT INTO pdf_vectors (syllabus_path, chunk_text, embedding) VALUES (%s, %s, %s)",
                (path, chunk_text, embedding_str)
            )
        elif table == "question_vectors":
            cur.execute(
                "INSERT INTO question_vectors (question_path, chunk_text, embedding) VALUES (%s, %s, %s)",
                (path, chunk_text, embedding_str)
            )
        else:
            print(f"⚠️ Unknown table: {table}")
            return

        conn.commit()
        cur.close()
        conn.close()
        print(f"✅ Stored in {table}")
    except Exception as e:
        print(f"❌ Error storing embedding: {e}")

def check_ollama_status():
    """Check if Ollama is running and the phi model is available"""
    try:
        # Check if Ollama is running
        response = requests.get("http://localhost:11434/api/tags", timeout=5)
        if response.status_code == 200:
            models = response.json().get("models", [])
            phi_models = [model for model in models if "phi" in model.get("name", "").lower()]
            
            if phi_models:
                print(f"✅ Ollama is running. Found phi models: {[m['name'] for m in phi_models]}")
                return True
            else:
                print("⚠️ Ollama is running but no phi model found.")
                print("💡 To pull the phi model, run: ollama pull phi")
                return False
        else:
            print("❌ Ollama is running but returned an error")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Ollama is not running on localhost:11434")
        print("💡 To start Ollama, run: ollama serve")
        return False
    except Exception as e:
        print(f"❌ Error checking Ollama status: {e}")
        return False

def process_all_txts(base_dir="ai_engine"):
    # First check if Ollama is available
    if not check_ollama_status():
        print("❌ Cannot proceed without Ollama. Please start Ollama and pull the phi model.")
        return
    
    for folder in ["syllabus", "questions"]:
        target_table = "pdf_vectors" if folder == "syllabus" else "question_vectors"
        full_path = os.path.join(base_dir, folder)

        for root, dirs, files in os.walk(full_path):
            for file in files:
                if file.endswith(".txt"):
                    path = os.path.join(root, file)
                    print(f"📄 Processing {path}")

                    chunks = extract_chunks_from_txt(path)
                    print(f"✅ Extracted {len(chunks)} chunks")

                    for i, chunk in enumerate(chunks):
                        print(f"🧩 Chunk {i+1}: {chunk[:60].strip()}...")
                        try:
                            emb = embed_text_phi2(chunk)
                            if emb is not None:
                                print(f"✨ Embedding preview: {emb[:5]}")
                                store_embedding(path, chunk, emb, table=target_table)
                            print()  # Empty line for readability
                        except Exception as e:
                            print(f"❌ Error embedding or storing: {e}")

if __name__ == "__main__":
    process_all_txts()