# ChatGPT Actions Setup Guide

This guide explains how to integrate GPT Terminal Plus with ChatGPT Actions for seamless terminal operations.

## Overview

ChatGPT Actions allow you to connect external APIs to ChatGPT, enabling the AI to perform real-world tasks like executing commands, managing files, and running code through your GPT Terminal Plus server.

## Prerequisites

- GPT Terminal Plus server running and accessible
- Valid API token for authentication
- HTTPS endpoint (required for ChatGPT Actions)

## Step 1: Prepare Your OpenAPI Specification

Your GPT Terminal Plus server automatically generates OpenAPI specifications at:

- `https://your-domain.com/openapi.json`
- `https://your-domain.com/openapi.yaml`

## Step 2: Create ChatGPT Action

1. Go to [ChatGPT Actions](https://chat.openai.com/actions)
2. Click "Create a new action"
3. Choose "Import from URL" or "Import from file"
4. Provide your OpenAPI specification URL or upload the file

## Step 3: Configure Authentication

1. In the Action configuration, set authentication to "API Key"
2. Set the authentication method to "Bearer Token"
3. The token should be passed in the `Authorization` header
4. Use your GPT Terminal Plus API token

## Step 4: Test the Integration

1. Test individual endpoints in the ChatGPT Actions interface
2. Verify that commands execute properly
3. Test file operations and code execution

## Step 5: Publish Your GPT

1. Once testing is complete, publish your GPT with Actions enabled
2. Share the GPT with users who need terminal access

## Security Considerations

- Always use HTTPS for production deployments
- Rotate API tokens regularly
- Implement proper rate limiting
- Monitor usage and logs

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check your API token
2. **403 Forbidden**: Verify token permissions
3. **CORS Errors**: Ensure proper CORS configuration
4. **Timeout Errors**: Check server response times

### Debug Steps

1. Test API endpoints directly with curl/Postman
2. Check server logs for errors
3. Verify OpenAPI specification is valid
4. Ensure all required environment variables are set

## Example Usage

Once configured, users can interact with your terminal through ChatGPT:

```
User: Can you check what's in the current directory?
Assistant: I'll check the current directory for you.

[Action: Execute shell command 'ls -la']

The current directory contains:
- README.md
- package.json
- src/
- tests/
- docs/
```

## Advanced Configuration

### Custom Actions

You can create custom GPTs with specific capabilities:

1. **Code Execution GPT**: Focused on running and testing code
2. **File Management GPT**: Specialized in file operations
3. **System Administration GPT**: For server management tasks

### Environment Variables

Set these for optimal ChatGPT integration:

```bash
# Required
API_TOKEN=your_secure_token_here
PUBLIC_BASE_URL=https://your-domain.com

# Optional
CORS_ORIGIN=https://chat.openai.com,https://chatgpt.com
DISABLE_HEALTH_LOG=true
```

## Support

For issues with ChatGPT Actions integration:

1. Check the [GPT Terminal Plus documentation](README.md)
2. Review server logs
3. Test API endpoints directly
4. Contact support with specific error messages

---

*This is a placeholder setup guide. Full implementation details will be added as the ChatGPT Actions integration is completed.*