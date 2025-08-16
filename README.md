# GPT Terminal Plus

Competition entry: AI-assisted CLI with gpt-oss:20b for automatic error diagnosis and natural-language execution.

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

GPT Terminal Plus provides a secure and isolated environment where system CLI utilities can be accessed via HTTP endpoints. Beyond simple command execution, it performs automatic AI analysis of failures and returns actionable fixes back to the calling AI.

## Purpose

The primary purpose of GPT Terminal Plus is to grant access to system CLI utilities through HTTP endpoints, enabling chatbots to interact with and execute commands on various system tools. This approach ensures:
- **Isolation and Security**: Each tool runs in its own container, providing strong isolation and reducing the risk of one compromised tool affecting others. Containerisation limits the potential attack surface for each tool.
- **Resource Management**: Docker allows setting resource limits for each container, ensuring one tool does not consume excessive resources, preventing denial-of-service scenarios caused by resource exhaustion.
- **Scalability**: Docker containers are lightweight and can be easily scaled up or down based on demand, allowing for efficient resource utilisation and potential cost savings in cloud environments.

## Primary Features (Two Ways We Use gpt-oss:20b)

- AI Error Analysis and Autodiagnostics: when a shell, code, or file execution exits non‑zero, the system invokes `gpt-oss:20b` (if available) to analyze `stderr`, `stdout`, and `exitCode`, returning concise remediation steps and suggested fixes in the response. This provides immediate, high‑value feedback to the calling AI.

See docs/API.md → AI Error Analysis.

## Secondary Features
- Command Execution: Run system commands using Bash; execute code (Python, TypeScript); run files.
- Model Selection: Choose logical models via `/model` routes; providers: Ollama, LM Studio, OpenAI.
- Streaming Chat: `POST /chat/completions` with SSE streaming, heartbeats, and error events.
- File Management: Create, read, update, and delete files securely.
- Remote Server Control: Use SSH or AWS SSM for managing servers.
- Extensibility with Docker: Configure using Docker for environment variables and storage.
- CI/CD and Packaging: GitHub workflows and multistage builds for performance.

## API Overview

- Models: list/select current model via `/model` routes.
- Chat: generate replies via `POST /chat/completions`.
- Streaming: add `"stream": true` for Server‑Sent Events (SSE).

Examples and details in `docs/API.md`.

## Showcase

Sample outputs from a real run are captured in `docs/SHOWCASE.generated.md` (auto‑generated) and the curated `docs/SHOWCASE.md`.

Generate fresh evidence locally:

- `API_TOKEN=secret BASE_URL=http://localhost:5005 OLLAMA_URL=http://localhost:11434 npm run showcase`


- Setup Health Check: see section 1
- Model APIs: see section 2
- Chat (non-stream + stream): see sections 3–4
- AI Error Analysis on failures: see section 5
- NL Execution dry-run and streaming: see sections 6–8
- SSM non-stream execution: see section 9


## Setup UI

Navigate to `/setup` (requires the same API auth) to configure:

- Local/SSH/SSM endpoints that can execute shell, code, and LLM plans.
- Global AI provider defaults (Ollama, LM Studio, OpenAI).
- Optional per-server LLM endpoints (e.g., remote Ollama instances).


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

## Competition Entry and Contribution

This project is repackaged from an original ChatGPT action to emphasize autonomous AI diagnosis and recovery. Contributions are welcome, especially enhancements that improve the error analysis feedback loop, execution safety, and portability.

- **Examples**: Refer to the `docker/` directory for customised Docker container examples.
- **Deployment**: Refer to `.github/workflows/` for CI/CD setup and `fly_configs/` for deployment examples on Fly.io.

## Roadmap

See `docs/ROADMAP.md` for an ambitious, multi‑phase plan and deep TODOs.
