# docker/ Directory Overview

## Purpose
The `docker/` directory contains various Docker configurations for integrating CLI tools and SDKs into the chatbot’s execution environment. These configurations allow for custom environments tailored to specific tools and services, providing isolated and consistent execution environments.

## How This is Used as a GPT Action Endpoint

### Overview
Each Docker container within this directory is designed to function as an action endpoint for a GPT-based chatbot. These containers leverage the Node.js Express web service, provided by the base image (`gpt-terminal-plus`), to expose HTTP endpoints that the GPT can interact with.

### How It Works
1. **Containerization**: Each integration (e.g., Netlify CLI, Notion SDK) is containerized using Docker. The Docker containers provide isolated environments that ensure the CLI tools operate consistently, regardless of the underlying host system.

2. **Express Web Service**: The base image (`gpt-terminal-plus`) includes a Node.js Express server that runs within each container. This server is configured to listen for HTTP requests and route them to the appropriate command or service within the container.

3. **HTTP Endpoints**: The containers expose HTTP endpoints through the Express server, which the GPT can call as actions. These endpoints are defined in the `docker-compose.yml` files and are mapped to specific ports on the host machine.

4. **GPT Integration**: The GPT is configured to interact with these endpoints. When a user makes a request that requires interaction with an external service (e.g., deploying a site via Netlify, querying data from Notion), the GPT sends an HTTP request to the appropriate endpoint. The container processes the request using the CLI tool and returns the result to the GPT, which then formats the response for the user.

### Example Workflow
- **User Request**: "Deploy my website using Netlify."
- **GPT Action**: The GPT recognizes this as an action that requires the Netlify CLI. It sends an HTTP request to the `netlify-cli` container's endpoint.
- **Container Execution**: The Express server in the `netlify-cli` container receives the request, executes the required command using the Netlify CLI, and returns the result.
- **GPT Response**: The GPT formats the output and responds to the user with the deployment status.

### Setup for GPT Action Endpoints
To set up these containers as action endpoints for your GPT chatbot:
1. **Build and Run Containers**: Navigate to the subfolder of the desired integration (e.g., `netlify-cli`) and run `docker-compose up -d` to start the container.
2. **Configure GPT**: Ensure that the GPT is configured to call the correct HTTP endpoints corresponding to the running containers.
3. **Environment Variables**: Use the `.env.sample` files to set up necessary environment variables, ensuring that API keys and tokens are securely provided.

## Structure

The subfolders in the `docker/` directory are organized based on the installation method used to set up the tools:

### **1. Node.js-based Installations**
These Dockerfiles use Node.js and npm to install CLI tools and SDKs. They are suitable for tools distributed via npm.

| Subfolder       | Description                       |
|-----------------|-----------------------------------|
| `netlify-cli`   | Installs the Netlify CLI.         |
| `notion-sdk`    | Installs the Notion SDK.          |
| `vercel-cli`    | Installs the Vercel CLI.          |
| `monday-cli`    | CLI for Monday.com integrations.  |
| `codesandbox-cli`| CLI for CodeSandbox.             |
| `openrouter`    | Router configurations, likely npm.|

### **2. apt-get-based Installations**
These setups use apt-get to install software packages, typically for tools available in Linux package repositories.

| Subfolder       | Description                                     |
|-----------------|-------------------------------------------------|
| `gcloud-cli`    | Google Cloud SDK installation via apt-get.      |
| `fly-cli`       | CLI for Fly.io, likely installed via apt-get.   |
| `oci-cli`       | Oracle Cloud Infrastructure CLI.                |
| `ssh-cli`       | Standard SSH tools likely installed via apt-get.|
| `ssm-and-ssh`   | Plus AWS SSM access to firewalled servers.      |

### **3. pipx-based Installations**
Dockerfiles using pipx are designed for Python-based CLI tools. Pipx allows the installation of Python applications in isolated environments, preventing dependency conflicts.

| Subfolder   | Description                                     |
|-------------|-------------------------------------------------|
| `joplin`    | Joplin CLI, potentially using pipx.             |

## Adding a New Integration
When adding a new integration, consider the following steps:

1. **Determine the Installation Method**: Choose between Node.js (npm), apt-get, or pipx based on the tool’s distribution.
2. **Create the Dockerfile**: Use an existing Dockerfile as a template, adjusting the installation steps as needed.
3. **Set Up docker-compose.yml**: Configure the service, including ports, environment variables, and volumes.
4. **Test the Integration**: Build and run the Docker container to ensure it works as expected.

## Current Focus and Future Work

### **Current Focus**
The primary focus has been on integrating Node.js-based CLI tools, such as Netlify, Notion, and Vercel. These integrations allow the chatbot to interact with these services directly from within a Docker container.

### **Future Work (TODO)**
The next steps include creating completely private environments using tools like n8n integrated with Ollama and LLaMA 3.1. This will ensure greater privacy and control over the execution environment, especially for sensitive operations.

## How to Use
To use any of the integrations, navigate to the respective subfolder (e.g., `netlify-cli`) and follow the instructions provided in the local `README.md` file. Each subfolder contains a `Dockerfile`, a `docker-compose.yml` configuration, and often a `.env.sample` file to guide environment variable setup.

## Contributing
If you’d like to contribute a new integration or improve an existing one, please follow the guidelines provided in the [Contributing Guidelines](CONTRIBUTING.md) (add a link if you have one).

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
