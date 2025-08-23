# # rag_engine.py
# import os
# from llama_index import VectorStoreIndex, SimpleDirectoryReader, ServiceContext
# from llama_index.embeddings.huggingface import HuggingFaceEmbedding
# from llama_index.vector_stores.postgres import PGVectorStore
# from llama_index.storage.storage_context import StorageContext

# # Load .env variables if needed
# from dotenv import load_dotenv
# load_dotenv()

# # --- Set up embedding model ---
# embed_model = HuggingFaceEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")

# # --- Configure PGVector ---
# pgvector_store = PGVectorStore.from_params(
#     database=os.getenv("PG_DB", "bca_notes_ai"),
#     host=os.getenv("PG_HOST", "localhost"),
#     password=os.getenv("PG_PASS", "admin"),
#     port=int(os.getenv("PG_PORT", "5432")),
#     user=os.getenv("PG_USER", "postgres"),
#     table_name="question_vectors",
# )

# # --- Load & index documents ---
# documents = SimpleDirectoryReader("data").load_data()
# storage_context = StorageContext.from_defaults(vector_store=pgvector_store)

# service_context = ServiceContext.from_defaults(embed_model=embed_model)
# index = VectorStoreIndex.from_documents(documents, service_context=service_context, storage_context=storage_context)

# # --- Set up query engine ---
# query_engine = index.as_query_engine()

# # --- Expose function to use in FastAPI ---
# def query_rag(prompt: str) -> str:
#     return query_engine.query(prompt).response


# from llama_index.core import VectorStoreIndex, Document, StorageContext, SimpleDirectoryReader
# from llama_index.embeddings.huggingface import HuggingFaceEmbedding
# from llama_index.vector_stores import PGVectorStore
# # from llama_index.storage.vector_store.pgvector import PGVectorStore
# from ai_engine.ollama_client import ask_ollama_phi
# from ai_engine.ingest import ingest_all_pdfs
# from llama_index import GPTVectorStoreIndex, ServiceContext
# from llama_index.llms import OpenAI
# import os

# # Set up your Postgres connection string
# PG_CONN_STR = os.getenv("PG_CONN_STR", "postgresql://postgres:password@localhost:5432/yourdb")

# def build_pgvector_index():
#     # Ingest documents
#     docs = ingest_all_pdfs()
#     documents = [Document(text=doc["text"], metadata={"source": doc["path"]}) for doc in docs]

#     # Set up embedding model
#     embed_model = HuggingFaceEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")

#     # Set up pgvector store
#     vector_store = PGVectorStore.from_params(
#         database_url=PG_CONN_STR,
#         table_name="syllabus_vectors",
#         embed_dim=384,  # for MiniLM-L6-v2
#     )
#     storage_context = StorageContext.from_defaults(vector_store=vector_store)

#     # Build and persist index
#     index = VectorStoreIndex.from_documents(
#         documents,
#         storage_context=storage_context,
#         embed_model=embed_model,
#     )
#     return index

# def retrieve_relevant_chunks(question, top_k=3):
#     # Set up embedding model and pgvector store
#     embed_model = HuggingFaceEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")
#     vector_store = PGVectorStore.from_params(
#         database_url=PG_CONN_STR,
#         table_name="syllabus_vectors",
#         embed_dim=384,
#     )
#     storage_context = StorageContext.from_defaults(vector_store=vector_store)
#     index = VectorStoreIndex.from_vector_store(
#         storage_context=storage_context,
#         embed_model=embed_model,
#     )
#     query_engine = index.as_query_engine()
#     response = query_engine.query(question)
#     return str(response)

# def answer_question(question):
#     context = retrieve_relevant_chunks(question)
#     prompt = f"Use the following syllabus content to answer the question:\n\n{context}\n\nQuestion: {question}\nAnswer:"
#     answer = ask_ollama_phi(prompt)
#     return answer



import os
import psycopg2
from psycopg2.extensions import register_adapter, AsIs
from dotenv import load_dotenv

load_dotenv()

def adapt_list(lst):
    return AsIs("'[" + ",".join(map(str, lst)) + "]'")

register_adapter(list, adapt_list)

# Connect to your PostgreSQL with pgvector enabled
conn = psycopg2.connect(
    dbname=os.getenv("PG_DB", "bca_notes_ai"),
    user=os.getenv("PG_USER", "postgres"),
    password=os.getenv("PG_PASS", "admin"),
    host=os.getenv("PG_HOST", "localhost"),
    port=os.getenv("PG_PORT", "5432"),
)

cursor = conn.cursor()

def query_similar_vectors(table_name, query_vector, top_k=5):
    sql = f"""
    SELECT content, embedding <=> %s AS distance
    FROM {table_name}
    ORDER BY distance
    LIMIT %s;
    """
    cursor.execute(sql, (query_vector, top_k))
    return cursor.fetchall()

# Example query vector (replace with your actual embedding vector)
query_embedding = [0.1, 0.2, 0.3, 0.4, 0.5]  # must match your vector dimension!

# Query question_vectors table
question_results = query_similar_vectors("question_vectors", query_embedding, top_k=3)
print("Top matches from question_vectors:")
for content, distance in question_results:
    print(f"Content: {content}, Distance: {distance}")

# Query pdf_vectors table
pdf_results = query_similar_vectors("pdf_vectors", query_embedding, top_k=3)
print("\nTop matches from pdf_vectors:")
for content, distance in pdf_results:
    print(f"Content: {content}, Distance: {distance}")

cursor.close()
conn.close()


