# Installing `gpt-terminal-plus` Locally with npm

## Prerequisites

1. **Install Node.js and npm**:
    - Follow the instructions at [Node.js Installation](https://nodejs.org/).

## Steps

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/matthewhand/gpt-terminal-plus.git
    cd gpt-terminal-plus
    ```

2. **Copy and Configure `.env` File**:
    ```bash
    cp .env.sample .env
    # Edit .env to set your configuration values
    ```

3. **Install Dependencies**:
    ```bash
    npm install
    ```

4. **Run the Application**:
    - For production:
      ```bash
      npm start
      ```
    - For development:
      ```bash
      npm run start:dev
      ```

5. **Check the Status and Logs**:
    ```bash
    npm run logs
    ```

## Service-Specific Instructions

### Joplin Service and Client

#### Joplin Service Installation

1. **Install Joplin Server**:
    ```sh
    npm install -g joplin
    joplin server start
    ```

2. **Configure Joplin Server**:
    - Ensure persistent storage for the service.

#### Joplin Client Installation

1. **Install Joplin Client**:
    ```sh
    npm install -g joplin
    ```

2. **Configure Joplin Client**:
    - Use the Joplin CLI to interact with the Joplin server.

### OCI Service

1. **Install OCI CLI**:
    ```sh
    bash -c "$(curl -L https://raw.githubusercontent.com/oracle/oci-cli/master/scripts/install/install.sh)"
    ```

2. **Configure OCI CLI**:
    - Set up `~/.oci/config` with necessary configurations.

### AWS Service

1. **Install AWS CLI**:
    ```sh
    curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
    sudo installer -pkg AWSCLIV2.pkg -target /
    ```

2. **Configure AWS CLI**:
    - Set up `~/.aws/credentials` with access keys.

### Notion Service

1. **Install Notion CLI**:
    - There is no official Notion CLI, but you can interact with Notion using their API.

2. **Configure Notion API**:
    - Set up API tokens and environment variables for authentication.

## Configuration

- **Update the `.env` File**:
    - Ensure the `.env` file contains all necessary configuration values, especially `API_TOKEN`.

## Troubleshooting

- Ensure Node.js and npm are installed properly.
- Check npm logs for errors.

## Additional Resources

- [Node.js Documentation](https://nodejs.org/)

