import os
from pinecone import Pinecone
import traceback

# Load environment variables
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

# Initialize the Pinecone client
pc = Pinecone(api_key=PINECONE_API_KEY)

# Function to create an assistant
def create_assistant(assistant_name, metadata=None):
    try:
        assistant = pc.assistant.create_assistant(assistant_name=assistant_name, metadata=metadata)
        print(f"Assistant '{assistant_name}' created successfully.")
    except Exception as e:
        print(f"An error occurred while creating the assistant: {e}")
        traceback.print_exc()

# Example usage
if __name__ == "__main__":
    assistant_name = "new-assistant"
    metadata = {"description": "This is a new assistant."}
    create_assistant(assistant_name, metadata)
