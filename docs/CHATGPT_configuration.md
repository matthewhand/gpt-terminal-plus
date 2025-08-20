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
    Refer to the [../public/openapi.yaml](./../public/openapi.yaml) or [../public/openapi.json](./../public/openapi.json) file for the API specification.
8. Modify the server endpoint to match your hosting domain name (do not use mine).

## Common Configuration Issues

### Issue: Authentication API Bearer Mismatch
- **Solution**: Ensure that the `API_TOKEN` in the `.env` file matches the Authentication API Bearer configured in ChatGPT.

### Issue: Incorrect Server Endpoint
- **Solution**: Verify that the server endpoint matches your hosting domain name.

## Troubleshooting Steps

1. **Check Environment Variables**:
    - Verify that all required environment variables are set in the `.env` file.

2. **Verify System Information Retrieval**:
    - Ensure that the system information retrieval mechanism works correctly by checking the logs for successful retrieval.

3. **Test Command Execution**:
    - Test command execution by running a simple command (e.g., `ls`) and verifying the output in the logs.

By following these steps, you can ensure proper configuration and troubleshoot common issues.

