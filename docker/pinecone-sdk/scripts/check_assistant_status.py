import os
from pinecone import Pinecone
import traceback

# Load environment variables
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

# Initialize Pinecone client
pc = Pinecone(api_key=PINECONE_API_KEY)

# Function to check the status of an assistant
def check_assistant_status(assistant_name):
    try:
        assistant = pc.assistant.describe_assistant(assistant_name=assistant_name)
        print(f"Assistant '{assistant_name}' Status: {assistant['status']}")
    except Exception as e:
        print(f"An error occurred while checking status: {e}")
        traceback.print_exc()

# Example usage
if __name__ == "__main__":
    assistant_name = "custom-assistant"
    check_assistant_status(assistant_name)
