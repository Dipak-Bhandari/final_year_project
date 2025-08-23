# rag_api.py
from flask import Flask, request, jsonify
from rag_engine import query_docs

app = Flask(__name__)

@app.route('/ask', methods=['POST'])
def ask():
    question = request.json['question']
    answer = query_docs(question)
    return jsonify({'answer': answer})

if __name__ == '__main__':
    app.run(port=5001)