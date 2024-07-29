# Installation Instructions

## Joplin Service and Client

### Joplin Service Installation

1. **Install Joplin Server**:
    ```sh
    npm install -g joplin
    joplin server start
    ```

2. **Configure Joplin Server**:
    - Ensure persistent storage for the service.

### Joplin Client Installation

1. **Install Joplin Client**:
    ```sh
    npm install -g joplin
    ```

2. **Configure Joplin Client**:
    - Use the Joplin CLI to interact with the Joplin server.

## OCI Service

1. **Install OCI CLI**:
    ```sh
    bash -c "$(curl -L https://raw.githubusercontent.com/oracle/oci-cli/master/scripts/install/install.sh)"
    ```

2. **Configure OCI CLI**:
    - Set up `~/.oci/config` with necessary configurations.

## AWS Service

1. **Install AWS CLI**:
    ```sh
    curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
    sudo installer -pkg AWSCLIV2.pkg -target /
    ```

2. **Configure AWS CLI**:
    - Set up `~/.aws/credentials` with access keys.

## Notion Service

1. **Install Notion CLI**:
    - There is no official Notion CLI, but you can interact with Notion using their API.

2. **Configure Notion API**:
    - Set up API tokens and environment variables for authentication.

# Environment Variables

Refer to `docs/CONFIG.envvars.md` for detailed information on configuring environment variables.
