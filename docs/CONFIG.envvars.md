# Configuration Environment Variables

This document describes the environment variables used in the project.

## Required Environment Variables

### API_TOKEN
- **Description**: Used to secure `gpt-terminal-plus`.
- **Value**: Generate a unique token and specify it here. This token will be used for Authorization as a Bearer token.
- **Example**: `API_TOKEN=your_unique_api_token_here`

### DEBUG
- **Description**: Set to `true` for detailed logging. Default is `false`.
- **Value**: `true` or `false`
- **Example**: `DEBUG=false`

### PORT
- **Description**: The port on which the application will run.
- **Value**: Integer
- **Example**: `PORT=5004`

### ENABLE_FILE_MANAGEMENT
- **Description**: Enable or disable file management routes.
- **Value**: `true` or `false`
- **Example**: `ENABLE_FILE_MANAGEMENT=true`

## Optional Environment Variables

### NODE_ENV
- **Description**: Specifies the environment in which the application is running. Default is `development`.
- **Value**: `development`, `production`, etc.
- **Example**: `NODE_ENV=development`

### NOTION_TOKEN
- **Description**: Token used for Notion API authentication.
- **Value**: Your Notion API token
- **Example**: `NOTION_TOKEN=your_notion_token_here`

### OCI_COMPARTMENT_ID
- **Description**: OCI Service Configuration - Compartment ID.
- **Value**: Your OCI compartment ID
- **Example**: `OCI_COMPARTMENT_ID=your_oci_compartment_id_here`

### OCI_COMPARTMENT_NAME
- **Description**: OCI Service Configuration - Compartment Name.
- **Value**: Your OCI compartment name
- **Example**: `OCI_COMPARTMENT_NAME=your_oci_compartment_name_here`

### AWS_ACCESS_KEY_ID
- **Description**: AWS Service Configuration - Access Key ID.
- **Value**: Your AWS access key ID
- **Example**: `AWS_ACCESS_KEY_ID=your_aws_access_key_id_here`

### AWS_SECRET_ACCESS_KEY
- **Description**: AWS Service Configuration - Secret Access Key.
- **Value**: Your AWS secret access key
- **Example**: `AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key_here`

### AWS_REGION
- **Description**: AWS Service Configuration - Region.
- **Value**: Your AWS region
- **Example**: `AWS_REGION=your_aws_region_here`

### SUPPRESS_NO_CONFIG_WARNING
- **Description**: Suppress warnings related to missing configuration.
- **Value**: `true` or `false`
- **Example**: `SUPPRESS_NO_CONFIG_WARNING=true`
