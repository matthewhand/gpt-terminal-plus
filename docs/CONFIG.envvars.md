# Environment Variables Configuration

This document outlines the environment variables used across the Docker services.

## Common Environment Variables

### .env File

- **NODE_ENV**: Specifies the environment in which the application is running. Default is `development`.
- **DEBUG**: Enables debug logging.
- **API_TOKEN**: Token used for API authentication.

## Service-Specific Environment Variables

### OCI Service

- **OCI_COMPARTMENT_ID**: OCI Compartment ID.
- **OCI_COMPARTMENT_NAME**: OCI Compartment Name.

### Notion Service

- **NOTION_TOKEN**: Token used for Notion API authentication.

### AWS Service

- **AWS_ACCESS_KEY_ID**: AWS Access Key ID
- **AWS_SECRET_ACCESS_KEY**: AWS Secret Access Key
- **AWS_REGION**: AWS Region

## Additional Configuration Variables

### NODE_CONFIG_DIR
- **Impact**: Overrides the directory where `globalState.json` is persisted.
- **Usage**:
  - **Ephemeral Storage**: Ensures `globalState.json` is preserved between scaled containers.
  - **RW Storage**: Ensures `globalState.json` is preserved across system outages.
  - **Server Configuration**: Directory also used for the file containing a list of server endpoints/hosts/targets.

## Environment Variable Impacts and Interdependencies

### NODE_ENV
- **Impact**: Determines the mode in which the application runs (development, production, etc.).
- **Interdependencies**: May affect logging levels and configuration settings.

### DEBUG
- **Impact**: When set to `true`, enables detailed logging for debugging purposes.
- **Interdependencies**: Works with logging configurations to control the verbosity of logs.

### API_TOKEN
- **Impact**: Used for authenticating API requests.
- **Interdependencies**: Must match the token configured in external systems to ensure successful authentication.

### OCI_COMPARTMENT_ID & OCI_COMPARTMENT_NAME
- **Impact**: Identifies the specific OCI compartment to operate within.
- **Interdependencies**: Both variables must be correctly set to access the desired OCI resources.

### NOTION_TOKEN
- **Impact**: Authenticates requests to the Notion API.
- **Interdependencies**: Must be kept secure to prevent unauthorized access to Notion data.

### AWS_ACCESS_KEY_ID & AWS_SECRET_ACCESS_KEY
- **Impact**: Credentials for accessing AWS services.
- **Interdependencies**: Must be used together to authenticate requests to AWS.

### AWS_REGION
- **Impact**: Specifies the AWS region for operations.
- **Interdependencies**: Must match the region where AWS resources are hosted.

### NODE_CONFIG_DIR
- **Impact**: Determines the directory for persisting `globalState.json`.
- **Interdependencies**: Ensures state is preserved across container scaling and system outages, and used for server configuration.

By understanding the impact and interdependencies of each environment variable, you can ensure proper configuration and avoid potential issues.

