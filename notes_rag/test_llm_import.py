from llama_index.llms import HuggingFaceLLM

llm = HuggingFaceLLM(model_name="tiiuae/falcon-7b-instruct")
print("LLM loaded successfully.")
