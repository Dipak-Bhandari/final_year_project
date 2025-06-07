# from llama_index.core import SimpleDirectoryReader, VectorStoreIndex
# from llama_index.embeddings.huggingface import HuggingFaceEmbedding
# from llama_index.core.response.notebook_utils import display_source_node
# import os

# def load_documents():
#     docs = SimpleDirectoryReader(input_dir="test_docs").load_data()
#     return docs

# def query_docs(question):
#     documents = load_documents()
#     # index = VectorStoreIndex.from_documents(documents)
#     embed_model = HuggingFaceEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")
#     index = VectorStoreIndex.from_documents(documents, embed_model=embed_model)
#     query_engine = index.as_query_engine()
#     response = query_engine.query(question)
#     return str(response)
from llama_index.llms import HuggingFaceLLM
from llama_index.core import ServiceContext, VectorStoreIndex, SimpleDirectoryReader
from llama_index.embeddings.huggingface import HuggingFaceEmbedding

def load_documents():
    docs = SimpleDirectoryReader(input_dir="test_docs").load_data()
    return docs

def query_docs(question):
    documents = load_documents()

    # Use HuggingFace embeddings
    embed_model = HuggingFaceEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")

    # Initialize local LLM (example: Falcon 7B instruct)
    llm = HuggingFaceLLM(
        model_name="tiiuae/falcon-7b-instruct", 
        tokenizer_name="tiiuae/falcon-7b-instruct",  # Optional but recommended
        model_kwargs={"temperature": 0.7, "max_new_tokens": 512},
        device_map="auto",  # or "cpu" if no GPU
    )

    # Combine everything in a ServiceContext
    service_context = ServiceContext.from_defaults(
        llm=llm,
        embed_model=embed_model
    )

    # Create the index
    index = VectorStoreIndex.from_documents(documents, service_context=service_context)

    # Create the query engine
    query_engine = index.as_query_engine()

    # Get response
    response = query_engine.query(question)
    return str(response)
