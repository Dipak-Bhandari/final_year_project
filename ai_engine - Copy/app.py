# app.py
from fastapi import FastAPI
from pydantic import BaseModel
from rag_engine import query_rag

app = FastAPI()

class QueryRequest(BaseModel):
    prompt: str

@app.post("/query")
def handle_query(request: QueryRequest):
    response = query_rag(request.prompt)
    return {"response": response}


# from fastapi import FastAPI
# from pydantic import BaseModel
# from ai_engine.rag_engine import answer_question

# app = FastAPI()

# class ChatRequest(BaseModel):
#     question: str

# @app.post("/chat")
# async def chat(request: ChatRequest):
#     answer = answer_question(request.question)
#     return {"answer": answer}
