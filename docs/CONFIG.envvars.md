# Environment Variables Configuration

This document outlines the environment variables used across the Docker services.

## Common Environment Variables

### `.env` File

- **NODE_ENV**: Specifies the environment in which the application is running. Default is `development`.
- **DEBUG**: Enables debug logging.
- **API_TOKEN**: Token used for API authentication.

## Service-Specific Environment Variables

### OCI Service

- **OCI_COMPARTMENT_ID**: OCI Compartment ID.
- **OCI_COMPARTMENT_NAME**: OCI Compartment Name.

### Notion Service

- **NOTION_TOKEN**: Token used for Notion API authentication.

## AWS Service

- **AWS_ACCESS_KEY_ID**: AWS Access Key ID
- **AWS_SECRET_ACCESS_KEY**: AWS Secret Access Key
- **AWS_REGION**: AWS Region
