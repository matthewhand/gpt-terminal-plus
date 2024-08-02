# Docker Design

This document provides an overview of the Docker design for the GPT Terminal Plus project.

## Design Philosophy

### Modular Design

Each CLI tool runs in a separate Docker container, providing isolation and security. This granular approach ensures that each tool has limited access, tied directly to a custom GPT with specific instructions for that tool.

### Security Considerations

By using separate Docker containers, each tool is isolated from the others, reducing the risk of one compromised tool affecting others. Containerization also limits the potential attack surface for each tool.

## Configuration

### Environment Variables

- **NODE_ENV**: Specifies the environment in which the application is running. Default is `development`.
- **DEBUG**: Enables debug logging.
- **API_TOKEN**: Token used for API authentication.
- **NODE_CONFIG_DIR**: Overrides the directory where `globalState.json` is persisted. Useful for:
  - **Ephemeral Storage**: Ensuring `globalState.json` is preserved between scaled containers.
  - **RW Storage**: Ensuring `globalState.json` is preserved across system outages.
  - **Server Configuration**: Directory also used for the file containing a list of server endpoints/hosts/targets.

### Volume Mapping

- For the AWS CLI service, you can map your existing AWS credentials to the container:
    ```yaml
    version: '3.8'
    services:
      aws-cli:
        image: amazon/aws-cli
        volumes:
          - ~/.aws:/root/.aws
    ```
- Alternatively, you can map to a container volume:
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

## Contribution Guidelines

Contributions are welcome for CLI software that follows a similar architecture of environment variables and volumes for configuration. Each tool should have an exposed HTTP endpoint for ChatGPT custom GPT to access.

- **Examples**: Refer to the `docker/` directory for examples of customized Docker containers.
- **Deployment**: Refer to `.github/workflows/` for CI/CD setup and `fly_configs/` for deployment examples on Fly.io.

By understanding and following these guidelines, you can ensure a consistent and secure implementation of Docker containers in the GPT Terminal Plus project.
