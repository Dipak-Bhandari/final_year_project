from fastapi import FastAPI
from pydantic import BaseModel
from notes_rag.rag_engine import load_documents, query_docs
from dotenv import load_dotenv
load_dotenv() 
app = FastAPI()

# ✅ Define request body schema
class ChatRequest(BaseModel):
    question: str

# ✅ Use the schema in the endpoint
@app.post("/chat")
async def chat(request: ChatRequest):
    answer = query_docs(request.question)
    return {"answer": answer}
