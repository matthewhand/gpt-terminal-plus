import os
from pinecone import Pinecone
import traceback

# Load environment variables
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

# Initialize the Pinecone client
pc = Pinecone(api_key=PINECONE_API_KEY)

# Function to describe a file in an assistant
def describe_file_in_assistant(assistant_name, file_id):
    try:
        assistant = pc.assistant.Assistant(assistant_name=assistant_name)
        file_info = assistant.describe_file(file_id=file_id)
        print(f"File Info: {file_info}")
    except Exception as e:
        print(f"An error occurred: {e}")
        traceback.print_exc()

# Example usage
if __name__ == "__main__":
    assistant_name = "custom-assistant"
    file_id = "your-file-id"  # Replace with the actual file ID
    describe_file_in_assistant(assistant_name, file_id)
