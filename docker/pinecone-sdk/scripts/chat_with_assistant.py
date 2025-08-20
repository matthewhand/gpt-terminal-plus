import os
from pinecone import Pinecone
import traceback

# Load environment variables
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

# Initialize the Pinecone client
pc = Pinecone(api_key=PINECONE_API_KEY)

# Function to interact with the assistant
def chat_with_assistant(assistant_name, message):
    try:
        assistant = pc.assistant.Assistant(assistant_name=assistant_name)
        response = assistant.chat(message=message)
        print(f"Assistant '{assistant_name}' response: {response['text']}")
    except Exception as e:
        print(f"An error occurred: {e}")
        traceback.print_exc()

# Example usage
if __name__ == "__main__":
    assistant_name = "custom-assistant"
    message = "What is Pinecone?"
    chat_with_assistant(assistant_name, message)
