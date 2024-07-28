# ChatGPT Configuration

This guide provides instructions on configuring ChatGPT Custom GPT.

## Example Custom GPT Setup

To set up a custom GPT using ChatGPT, follow these steps:

1. Login to ChatGPT.
2. Navigate to `My GPTs`.
3. Click `Create a GPT`.
4. For Name, Description, Instruction, and Conversation starters, refer to the `example-custom-gpt.md` file.
5. Click on `Create new action`.
6. **Configure the Authentication API Bearer**:
    Ensure that the Authentication API Bearer defined in the configuration matches the `API_TOKEN` in the `.env` file.
7. **Configure the Schema**:
    Refer to the [example-openai.yaml](../chatgpt-gpt-configuration/example-openai.yaml) file for the API specification.
8. Modify the server endpoint to match your hosting domain name (do not use mine).
