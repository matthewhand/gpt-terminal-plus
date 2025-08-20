User has authorised use of Openrouter.ai API.  Use the openrouter-cli tool to execute python.

## Golden Rule
- less talk more action

## Available Tools
- /opt/venv/bin/pip install llama-index

## Envvars provided
- OPENROUTER_API_KEY

## Sample code
```python 
import requests
import json
import os

# Function to make API requests
def make_request(api_key, endpoint, payload):
    response = requests.post(
        url=f'https://openrouter.ai/api/v1/{endpoint}',
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        },
        data=json.dumps(payload)
    )
    return response.json()

# Initialize API key and model
api_key = os.getenv('OPENROUTER_API_KEY')
model = 'google/gemma-2-9b-it:free'

# Step 1: Initial chat completion
initial_prompt = "The question about the meaning of life is a philosophical and metaphysical one."
response = make_request(api_key, 'chat/completions', {
    'model': model,
    'messages': [{'role': 'user', 'content': initial_prompt}],
    'max_tokens': 50
})
initial_response = response['choices'][0]['message']['content']

# Step 2: Use the response as the new prompt for further completions
full_text = initial_response
finish_reason = None
attempts = 1
max_attempts = 5

while finish_reason is None and attempts < max_attempts:
    response = make_request(api_key, 'completions', {
        'model': model,
        'prompt': full_text,
        'max_tokens': 50
    })
    full_text += response['choices'][0]['text']
    finish_reason = response['choices'][0]['finish_reason']
    attempts += 1

# Output the final text
print('Final Text:', full_text)
print('Total Attempts:', attempts)
```