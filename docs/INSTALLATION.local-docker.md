# Local Docker Installation

This guide provides instructions for setting up the project using Docker locally.

## Prerequisites

- Docker installed on your machine.
- Docker Compose installed on your machine.

## Setup

1. **Clone the repository**:
    ```sh
    git clone https://github.com/your-repo/gpt-terminal-plus.git
    cd gpt-terminal-plus
    ```

2. **Create a `.env` file**:
    ```sh
    cp .env.example .env
    ```

3. **Configure environment variables** in the `.env` file:
    - **NODE_ENV**: Specifies the environment in which the application is running. Default is `development`.
    - **DEBUG**: Enables debug logging.
    - **API_TOKEN**: Token used for API authentication.
    - **NODE_CONFIG_DIR**: Overrides the directory where `globalState.json` is persisted. Useful for:
        - **Ephemeral Storage**: Ensuring `globalState.json` is preserved between scaled containers.
        - **RW Storage**: Ensuring `globalState.json` is preserved across system outages.
        - **Server Configuration**: Directory also used for the file containing a list of server endpoints/hosts/targets.

4. **Optional: Map volumes for specific services**:
    - For the AWS CLI service, map your existing AWS credentials to the container:
        ```yaml
        version: '3.8'
        services:
          aws-cli:
            image: amazon/aws-cli
            volumes:
              - ~/.aws:/root/.aws
        ```
    - You can also map to a container volume if you prefer:
        ```yaml
        version: '3.8'
        services:
          aws-cli:
            image: amazon/aws-cli
            volumes:
              - aws-cli-data:/root/.aws
        volumes:
          aws-cli-data:
        ```

5. **Build and run the containers**:
    ```sh
    docker-compose up --build
    ```

6. **Verify the setup**:
    - Access the application at `http://localhost:YOUR_PORT`.
    - Check the logs for any errors or issues.

By following these steps and using the provided configurations, you can ensure a proper local Docker setup and manage environment variables and volumes effectively.
