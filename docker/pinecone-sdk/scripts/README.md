# Pinecone SDK - Assistant Management Scripts

This directory contains Python scripts to manage Pinecone Assistants, including creating assistants, checking status, chatting, uploading files, and evaluating answers.

## Prerequisites

- Ensure the following environment variable is set:
  - `PINECONE_API_KEY`: Your Pinecone API key for authentication.

## Script List and Usage

### 1. List All Assistants (`list_assistants.py`)

This script lists all the assistants associated with your Pinecone account.

#### Command

```bash
python3 /scripts/list_assistants.py
```

#### Example Output

```bash
Assistant Name: custom-assistant, Status: Ready
Assistant Name: my-assistant, Status: Ready
```

### 2. Check Assistant Status (`check_assistant_status.py`)

This script checks the status of a specific assistant by its name.

#### Command

```bash
python3 /scripts/check_assistant_status.py
```

#### Example Output

```bash
Assistant 'custom-assistant' Status: Ready
```

### 3. Create a New Assistant (`create_assistant.py`)

This script creates a new assistant with optional metadata.

#### Command

```bash
python3 /scripts/create_assistant.py
```

#### Example Output

```bash
Assistant 'new-assistant' created successfully.
```

### 4. Chat with an Assistant (`chat_with_assistant.py`)

This script sends a message to an assistant and returns its response.

#### Command

```bash
python3 /scripts/chat_with_assistant.py
```

#### Example Output

```bash
Assistant 'custom-assistant' response: Pinecone is a vector database for real-time AI applications.
```

### 5. Upload a File to an Assistant (`upload_files.py`)

This script uploads a file to an assistant’s knowledge base.

#### Command

```bash
python3 /scripts/upload_files.py
```

#### Example Output

```bash
File '/tmp/kb_article.txt' uploaded to assistant 'custom-assistant' with status: Available
```

### 6. Describe a File in an Assistant (`describe_file.py`)

This script provides detailed information about a specific file in an assistant's knowledge base.

#### Command

```bash
python3 /scripts/describe_file.py
```

#### Example Output

```bash
File Info: {"name": "kb_article.txt", "status": "Available"}
```

## Notes

- Ensure the `PINECONE_API_KEY` environment variable is correctly set for each script.

