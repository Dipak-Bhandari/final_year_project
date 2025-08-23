# class DataIngestor:
#     def __init__(self, input_dir="ai_engine/test_docs"):
#         self.input_dir = input_dir

#     def _load_data(self):
#         # Implement PDF/text loading logic here
#         pass

#     def ingest_data(self):
#         data = self._load_data()
#         # Process and store embeddings, etc.
#         pass

import os
import PyPDF2

def extract_text_from_pdf(pdf_path):
    text = ""
    with open(pdf_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            text += page.extract_text() or ""
    return text

def ingest_all_pdfs(base_dir="ai_engine/syllabus"):
    docs = []
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith(".pdf"):
                path = os.path.join(root, file)
                text = extract_text_from_pdf(path)
                docs.append({"path": path, "text": text})
    return docs