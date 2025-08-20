import os
from pinecone import Pinecone
import traceback

# Load environment variables
PINECONE_API_KEY = os.getenv('PINECONE_API_KEY')

# Initialize Pinecone client
pc = Pinecone(api_key=PINECONE_API_KEY)

# Function to delete an assistant
def delete_assistant(assistant_name):
    try:
        pc.assistant.delete_assistant(assistant_name=assistant_name)
        print(f"Assistant '{assistant_name}' deleted successfully.")
    except Exception as e:
        print(f"An error occurred while deleting the assistant: {e}")
        traceback.print_exc()

# Main execution
if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description="Delete a Pinecone assistant.")
    parser.add_argument('--name', type=str, required=True, help="Name of the assistant to delete")
    args = parser.parse_args()

    delete_assistant(args.name)
