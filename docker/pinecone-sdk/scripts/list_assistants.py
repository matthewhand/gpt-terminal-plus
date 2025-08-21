import os
from pinecone import Pinecone

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

# Initialize Pinecone client
pc = Pinecone(api_key=PINECONE_API_KEY)

# Function to list all assistants
def list_assistants():
    try:
        assistants = pc.assistant.list_assistants()
        if assistants:
            for assistant in assistants:
                print(f"Assistant Name: {assistant.name}, Status: {assistant.status}")
        else:
            print("No assistants found.")
    except Exception as e:
        print(f"An error occurred: {e}")

# Example usage
if __name__ == "__main__":
    list_assistants()
