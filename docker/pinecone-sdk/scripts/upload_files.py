import os
from pinecone import Pinecone
import traceback

# Load environment variables
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

# Initialize the Pinecone client
pc = Pinecone(api_key=PINECONE_API_KEY)

# Function to upload files to an assistant
def upload_file_to_assistant(assistant_name, file_path):
    try:
        assistant = pc.assistant.Assistant(assistant_name=assistant_name)
        response = assistant.upload_file(file_path)
        print(f"File '{file_path}' uploaded to assistant '{assistant_name}' with status: {response.status}")
    except Exception as e:
        print(f"An error occurred while uploading the file: {e}")
        traceback.print_exc()

# Example usage
if __name__ == "__main__":
    assistant_name = "custom-assistant"
    file_path = "/tmp/kb_article.txt"
    upload_file_to_assistant(assistant_name, file_path)
