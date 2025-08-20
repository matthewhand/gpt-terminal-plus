### CustomGPT-instructions.md for Flowise-SDK

User has authorized the use of the Flowise SDK.

## Golden Rule
- Prioritize immediate action over discussion.
- Always validate API keys and ensure environment variables are correctly set before running the service.
- Store any useful scripts in `/scripts/`, ensuring they are verified as working before being used.

## Advice
- **Environment Variables**: Ensure that `API_TOKEN`, `FLOWISE_API_KEY`, and `FLOWISE_URL` are properly set in your `.env` file.
- **Flowise Operations**: Interact with the Flowise service through the Python SDK. The SDK supports creating and querying predictions, charts, and streaming results.
- **Error Handling**: Always check for valid API responses, and handle any missing or incorrect tokens with clear error messages.

### Flowise SDK Scripts
The following Python scripts are available to manage and interact with Flowise services:
  1. **create_prediction.py**: Use the SDK to create a prediction based on a chatflow ID and question.
  2. **query_chart_data.py**: Use the SDK to query data that can be used to generate charts.
  3. **test_streaming_prediction.py**: Test streaming predictions with real-time output.

### Envvars Provided
- `API_TOKEN` (for authentication)
- `FLOWISE_API_KEY` (for accessing the Flowise service)
- `FLOWISE_URL` (for specifying the base URL of the Flowise service)

## Known Working Scripts
- `create_prediction.py`
- `query_chart_data.py`
- `test_streaming_prediction.py`
