import os
from pinecone import Pinecone

# Load environment variables
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

# Initialize the Pinecone client
try:
    pc = Pinecone(api_key=PINECONE_API_KEY)

    # Function to delete a file from an assistant
    def delete_file_from_assistant(assistant_name, file_id):
        try:
            result = pc.assistant.delete_file(assistant_name=assistant_name, file_id=file_id)
            if result['status'] == 'success':
                print(f"File '{file_id}' deleted successfully from assistant '{assistant_name}'.")
            else:
                print(f"Failed to delete file '{file_id}' from assistant '{assistant_name}'.")
        except Exception as e:
            print(f"An error occurred while deleting the file: {e}")

    # Example usage
    if __name__ == "__main__":
        assistant_name = input("Enter the assistant's name: ")
        file_id = input("Enter the file ID to delete: ")
        delete_file_from_assistant(assistant_name, file_id)

except Exception as e:
    print(f"An error occurred: {e}")
