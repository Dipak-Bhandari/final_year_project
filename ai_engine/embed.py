# import os
# import re
# from db import insert_vector, insert_question_vector
# from ollama_client import embed_text  # Updated import

# def extract_metadata(chunk, path):
#     course_title = ""
#     course_code = ""
#     unit_title = ""
#     keywords = []
#     year = ""

#     course_title_match = re.search(r'Course Title:\s*(.+)', chunk)
#     course_code_match = re.search(r'Course Code:\s*(\S+)', chunk)
#     unit_title_match = re.search(r'Unit\s*\d+\s*([^\n]*)', chunk)
#     year_match = re.search(r'(19|20)\d{2}', chunk)
     
#     if course_title_match:
#         course_title = course_title_match.group(1).strip()
#     else:
#         course_title = os.path.basename(path).replace(".txt", "")

#     if course_code_match:
#         course_code = course_code_match.group(1).strip()
#     else:
#         course_code = ""

#     if unit_title_match:
#         unit_title = unit_title_match.group(1).strip()
#     else:
#         unit_title = chunk.split('\n', 1)[0].strip()

#     if year_match:
#         year = year_match.group(0)
#     else:
#         filename_year = re.search(r'(19|20)\d{2}', os.path.basename(path))
#         if filename_year:
#             year = filename_year.group(0)

#     if course_title:
#         keywords.append(course_title)
#     if course_code:
#         keywords.append(course_code)
#     if unit_title:
#         keywords.append(unit_title)
#     for word in ["syllabus", "unit", "overview", "introduction", "topics", "list", "fundamentals", "applications", "technology", "network", "database", "software", "system"]:
#         if word.lower() in chunk.lower():
#             keywords.append(word)
#     keywords_str = ", ".join(set(keywords))

#     return course_title, course_code, unit_title, keywords_str, year

# def extract_syllabus_chunks(txt_path):
#     with open(txt_path, "r", encoding="utf-8") as f:
#         text = f.read()
#     chunks = []
#     # Extract Course Contents section
#     course_contents_match = re.search(r'Course Contents\s*:(.*?)(?=Unit \d+)', text, re.DOTALL)
#     if course_contents_match:
#         course_contents = course_contents_match.group(0).strip()
#         chunks.append((course_contents, True, False))  # Mark as course content
#     current_section = None
#     unit_buffer = ""
#     found_unit = False
#     for line in text.splitlines():
#         if "Course Contents" in line:
#             current_section = "course_content"
#         elif "Laboratory Works" in line:
#             current_section = "laboratory_work"
#         elif line.strip().startswith("Unit"):
#             found_unit = True
#             if unit_buffer:
#                 is_course_content = current_section == "course_content"
#                 is_laboratory_work = current_section == "laboratory_work"
#                 chunks.append((unit_buffer.strip(), is_course_content, is_laboratory_work))
#                 unit_buffer = ""
#             unit_buffer = line
#         elif unit_buffer:
#             unit_buffer += "\n" + line
#     if unit_buffer:
#         is_course_content = current_section == "course_content"
#         is_laboratory_work = current_section == "laboratory_work"
#         chunks.append((unit_buffer.strip(), is_course_content, is_laboratory_work))
#     if not found_unit and text.strip():
#         chunks.append((text.strip(), False, False))
#     return chunks

# def extract_question_chunks(txt_path):
#     with open(txt_path, "r", encoding="utf-8") as f:
#         text = f.read()
#     # Split by lines that look like questions (start with number or bullet)
#     question_pattern = re.compile(r'^\s*(\d+\.|\([a-zA-Z]\)|[a-zA-Z]\))\s+', re.MULTILINE)
#     lines = text.splitlines()
#     questions = []
#     buffer = ""
#     for line in lines:
#         if re.match(r'^\s*\d+\.', line) or re.match(r'^\s*\([a-zA-Z]\)', line) or re.match(r'^[a-zA-Z]\)', line):
#             if buffer:
#                 questions.append(buffer.strip())
#                 buffer = ""
#             buffer = line
#         else:
#             if buffer:
#                 buffer += "\n" + line
#     if buffer:
#         questions.append(buffer.strip())
#     # If no questions found, treat whole file as one chunk
#     if not questions and text.strip():
#         questions.append(text.strip())
#     # Return as simple list of strings
#     return questions

# def embed_folder(folder, table, path_col):
#     for root, dirs, files in os.walk(folder):
#         for file in files:
#             if file.endswith(".txt"):
#                 path = os.path.join(root, file)
#                 if table == "pdf_vectors":
#                     chunks = extract_syllabus_chunks(path)
#                     if not chunks:
#                         print(f"Warning: No units found in {path}. Skipping.")
#                         continue
#                     first_chunk, _, _ = chunks[0]
#                     course_title, course_code, _, _, _ = extract_metadata(first_chunk, path)
#                     for chunk_tuple in chunks:
#                         chunk, is_course_content, is_laboratory_work = chunk_tuple
#                         ct, cc, unit_title, keywords, _ = extract_metadata(chunk, path)
#                         if not cc:
#                             cc = course_code
#                         if not ct:
#                             ct = course_title
#                         emb = embed_text(chunk)  # Updated model
#                         insert_vector(
#                             table,
#                             path,
#                             chunk,
#                             emb,
#                             ct,
#                             cc,
#                             keywords,
#                             unit_title,
#                             is_course_content,
#                             is_laboratory_work
#                         )
#                 else:  # question_vectors
#                     questions = extract_question_chunks(path)
#                     if not questions:
#                         print(f"Warning: No questions found in {path}. Skipping.")
#                         continue
#                     # Use file name as course_title fallback
#                     course_title = os.path.basename(path).replace(".txt", "")
#                     course_code = ""
#                     for question in questions:
#                         ct, cc, unit_title, keywords, year = extract_metadata(question, path)
#                         if not ct:
#                             ct = course_title
#                         if not cc:
#                             cc = course_code
#                         emb = embed_text(question)  # Updated model
#                         insert_question_vector(
#                             table,
#                             path,
#                             question,
#                             emb,
#                             ct,
#                             cc,
#                             keywords,
#                             year
#                         )

# if __name__ == "__main__":
#     print("Embedding syllabus...")
#     embed_folder("syllabus", "pdf_vectors", "syllabus_path")
#     print("Embedding questions...")
#     embed_folder("questions", "question_vectors", "question_path")
#     print("Embedding complete.")


import os
import re
from db import insert_vector, insert_question_vector
from ollama_client import embed_text 

# Add chunk size constants
MAX_CHUNK_SIZE = 2000
CHUNK_OVERLAP = 200 

def split_large_chunk(chunk, max_size=MAX_CHUNK_SIZE, overlap=CHUNK_OVERLAP):
    """Split a chunk that exceeds max_size into smaller chunks with overlap"""
    if len(chunk) <= max_size:
        return [chunk]
    
    chunks = []
    start = 0
    
    while start < len(chunk):
        end = start + max_size
        
        # Try to break at a sentence or paragraph boundary
        if end < len(chunk):
            # Look for sentence endings near the boundary
            for delimiter in ['\n\n', '.\n', '.\n\n', '\n']:
                last_break = chunk.rfind(delimiter, start, end)
                if last_break != -1:
                    end = last_break + len(delimiter)
                    break
        
        chunk_text = chunk[start:end].strip()
        if chunk_text:
            chunks.append(chunk_text)
        
        # Move start position with overlap
        start = end - overlap
        if start >= len(chunk):
            break
    
    return chunks

def extract_metadata(chunk, path):
    course_title = ""
    course_code = ""
    unit_title = ""
    keywords = []
    year = ""

    course_title_match = re.search(r'Course Title:\s*(.+)', chunk)
    course_code_match = re.search(r'Course Code:\s*(\S+)', chunk)
    unit_title_match = re.search(r'Unit\s*\d+\s*([^\n]*)', chunk)
    year_match = re.search(r'(19|20)\d{2}', chunk)
     
    if course_title_match:
        course_title = course_title_match.group(1).strip()
    else:
        course_title = os.path.basename(path).replace(".txt", "")

    if course_code_match:
        course_code = course_code_match.group(1).strip()
    else:
        course_code = ""

    if unit_title_match:
        unit_title = unit_title_match.group(1).strip()
    else:
        unit_title = chunk.split('\n', 1)[0].strip()

    if year_match:
        year = year_match.group(0)
    else:
        filename_year = re.search(r'(19|20)\d{2}', os.path.basename(path))
        if filename_year:
            year = filename_year.group(0)

    if course_title:
        keywords.append(course_title)
    if course_code:
        keywords.append(course_code)
    if unit_title:
        keywords.append(unit_title)
    for word in ["syllabus", "unit", "overview", "introduction", "topics", "list", "fundamentals", "applications", "technology", "network", "database", "software", "system"]:
        if word.lower() in chunk.lower():
            keywords.append(word)
    keywords_str = ", ".join(set(keywords))

    return course_title, course_code, unit_title, keywords_str, year

def extract_syllabus_chunks(txt_path):
    with open(txt_path, "r", encoding="utf-8") as f:
        text = f.read()
    chunks = []
    # Extract Course Contents section
    course_contents_match = re.search(r'Course Contents\s*:(.*?)(?=Unit \d+)', text, re.DOTALL)
    if course_contents_match:
        course_contents = course_contents_match.group(0).strip()
        # Split if too large
        for sub_chunk in split_large_chunk(course_contents):
            chunks.append((sub_chunk, True, False))  # Mark as course content
    current_section = None
    unit_buffer = ""
    found_unit = False
    for line in text.splitlines():
        if "Course Contents" in line:
            current_section = "course_content"
        elif "Laboratory Works" in line:
            current_section = "laboratory_work"
        elif line.strip().startswith("Unit"):
            found_unit = True
            if unit_buffer:
                is_course_content = current_section == "course_content"
                is_laboratory_work = current_section == "laboratory_work"
                # Split large units into smaller chunks
                for sub_chunk in split_large_chunk(unit_buffer.strip()):
                    chunks.append((sub_chunk, is_course_content, is_laboratory_work))
                unit_buffer = ""
            unit_buffer = line
        elif unit_buffer:
            unit_buffer += "\n" + line
    if unit_buffer:
        is_course_content = current_section == "course_content"
        is_laboratory_work = current_section == "laboratory_work"
        # Split large units into smaller chunks
        for sub_chunk in split_large_chunk(unit_buffer.strip()):
            chunks.append((sub_chunk, is_course_content, is_laboratory_work))
    if not found_unit and text.strip():
        # Split the entire text if no units found
        for sub_chunk in split_large_chunk(text.strip()):
            chunks.append((sub_chunk, False, False))
    return chunks

def extract_question_chunks(txt_path):
    with open(txt_path, "r", encoding="utf-8") as f:
        text = f.read()
    # Split by lines that look like questions (start with number or bullet)
    question_pattern = re.compile(r'^\s*(\d+\.|\([a-zA-Z]\)|[a-zA-Z]\))\s+', re.MULTILINE)
    lines = text.splitlines()
    questions = []
    buffer = ""
    for line in lines:
        if re.match(r'^\s*\d+\.', line) or re.match(r'^\s*\([a-zA-Z]\)', line) or re.match(r'^[a-zA-Z]\)', line):
            if buffer:
                # Split large questions
                for sub_chunk in split_large_chunk(buffer.strip()):
                    questions.append(sub_chunk)
                buffer = ""
            buffer = line
        else:
            if buffer:
                buffer += "\n" + line
    if buffer:
        # Split large questions
        for sub_chunk in split_large_chunk(buffer.strip()):
            questions.append(sub_chunk)
    # If no questions found, treat whole file as chunks
    if not questions and text.strip():
        for sub_chunk in split_large_chunk(text.strip()):
            questions.append(sub_chunk)
    return questions

def embed_folder(folder, table, path_col):
    for root, dirs, files in os.walk(folder):
        for file in files:
            if file.endswith(".txt"):
                path = os.path.join(root, file)
                if table == "pdf_vectors":
                    chunks = extract_syllabus_chunks(path)
                    if not chunks:
                        print(f"Warning: No units found in {path}. Skipping.")
                        continue
                    first_chunk, _, _ = chunks[0]
                    course_title, course_code, _, _, _ = extract_metadata(first_chunk, path)
                    for chunk_tuple in chunks:
                        chunk, is_course_content, is_laboratory_work = chunk_tuple
                        ct, cc, unit_title, keywords, _ = extract_metadata(chunk, path)
                        if not cc:
                            cc = course_code
                        if not ct:
                            ct = course_title
                        emb = embed_text(chunk)  # Updated model
                        insert_vector(
                            table,
                            path,
                            chunk,
                            emb,
                            ct,
                            cc,
                            keywords,
                            unit_title,
                            is_course_content,
                            is_laboratory_work
                        )
                else:  # question_vectors
                    questions = extract_question_chunks(path)
                    if not questions:
                        print(f"Warning: No questions found in {path}. Skipping.")
                        continue
                    # Use file name as course_title fallback
                    course_title = os.path.basename(path).replace(".txt", "")
                    course_code = ""
                    for question in questions:
                        ct, cc, unit_title, keywords, year = extract_metadata(question, path)
                        if not ct:
                            ct = course_title
                        if not cc:
                            cc = course_code
                        emb = embed_text(question)  # Updated model
                        insert_question_vector(
                            table,
                            path,
                            question,
                            emb,
                            ct,
                            cc,
                            keywords,
                            year
                        )

if __name__ == "__main__":
    print("Embedding syllabus...")
    embed_folder("syllabus", "pdf_vectors", "syllabus_path")
    print("Embedding questions...")
    embed_folder("questions", "question_vectors", "question_path")
    print("Embedding complete.")