import os
import requests
import traceback

# Load environment variables
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

# Function to list files using the Pinecone Assistant API
def list_files_in_assistant(assistant_name):
    try:
        url = f"https://api.pinecone.io/v1/assistant/files/{assistant_name}"
        headers = {
            "Api-Key": PINECONE_API_KEY
        }

        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            files = response.json().get("files", [])
            if files:
                for file in files:
                    print(f"File Name: {file['name']}, File ID: {file['id']}, Status: {file['status']}")
            else:
                print(f"No files found for assistant '{assistant_name}'.")
        else:
            print(f"Failed to list files: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"An error occurred: {e}")
        traceback.print_exc()

# Example usage
if __name__ == "__main__":
    assistant_name = "custom-assistant"
    list_files_in_assistant(assistant_name)
