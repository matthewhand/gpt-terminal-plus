# GPT Terminal Plus

## Quickstart

### Run Directly from Docker Hub

1. **Pull the Docker Image**
 ```sh
 docker pull mhand79/gpt-terminal-plus:latest
 ```

2. **Download the Environment Variables File**
 - Download the `.env.sample` file and rename it to `.env`.
 ```sh
 curl -o .env https://raw.githubusercontent.com/matthewhand/gpt-terminal-plus/main/.env.sample
 ```

3. **Set the `API_TOKEN` in the `.env` File**
 - Open the `.env` file and set the `API_TOKEN` to ensure controlled access.
 ```ini
 API_TOKEN=your_secure_api_token
 ```

4. **Run the Docker Container**
 ```sh
 docker run -d -p 5005:5005 --env-file .env mhand79/gpt-terminal-plus:latest
 ```

For more detailed instructions and alternative installation methods, please refer to the sections below.


## Introduction

GPT Terminal Plus provides a secure and isolated environment where system CLI utilities can be accessed via HTTP endpoints. These endpoints allow chatbots, such as custom GPT models, to execute commands and retrieve results, ensuring strong isolation and security.

## Purpose

The primary purpose of GPT Terminal Plus is to grant access to system CLI utilities through HTTP endpoints, enabling chatbots to interact with and execute commands on various system tools. This approach ensures:
- **Isolation and Security**: Each tool runs in its own container, providing strong isolation and reducing the risk of one compromised tool affecting others. Containerisation limits the potential attack surface for each tool.
- **Resource Management**: Docker allows setting resource limits for each container, ensuring one tool does not consume excessive resources, preventing denial-of-service scenarios caused by resource exhaustion.
- **Scalability**: Docker containers are lightweight and can be easily scaled up or down based on demand, allowing for efficient resource utilisation and potential cost savings in cloud environments.

## Key Features
- **File Management**: Create, read, update, and delete files securely.
- **Command Execution**: Run system commands using various shells (Python, PowerShell, Bash).
- **Remote Server Control**: Use SSH or AWS SSM for managing servers.
- **Extensibility with Docker**: Configure using Docker for environment variables and storage.
- **GitHub Workflows for CI/CD**: Automated testing, Docker registry uploads, and Fly.io deployment.
- **Multistage Builds for Performance Optimisation**: Includes a TypeScript compiler to improve performance and optimise the final image size.

## API Overview

- Models: list/select current model via `/model` routes.
- Chat: generate replies via `POST /chat/completions`.
- Streaming: add `"stream": true` for Server‑Sent Events (SSE).

Examples and details in `docs/API.md`.

## Advanced Setup

For more advanced setup options, such as using Docker or deploying to Fly.io, refer to the following documentation:

- [Docker Setup](docs/DOCKER_SETUP.md)
- [Fly.io Deployment](docs/FLY_IO_DEPLOYMENT.md)
- [Configuration Details](docs/CONFIGURATION.md)
- [Supporting Scripts](docs/SUPPORTING_SCRIPTS.md)
- [API Guide](docs/API.md)

## Configuration

### Environment Variables

This document details the environment variables used in the GPT Terminal Plus application. These variables configure various aspects of the application, such as enabling/disabling features and setting up authentication tokens for third-party services.

Refer to [Configuration Details](docs/CONFIGURATION.md) for detailed information.

## Contribution

Contributions are welcome for CLI software that follows a similar architecture. Each tool should have an exposed HTTP endpoint for ChatGPT custom GPT to access.

- **Examples**: Refer to the `docker/` directory for customised Docker container examples.
- **Deployment**: Refer to `.github/workflows/` for CI/CD setup and `fly_configs/` for deployment examples on Fly.io.

## TODO

- Implement `gpt-oss:20b` model support:
  - Add model registration and configuration.
  - Expose selection via config/env and API.
  - Ensure tokenizer/streaming compatibility and tests.
  - Update docs and examples.

For a fuller list, see `docs/TODO.md`.
