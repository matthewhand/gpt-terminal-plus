# Docker Setup

This guide provides instructions for setting up the project using Docker.

## Prerequisites

- Docker installed on your machine.
- Docker Compose installed on your machine.

## Setup

### Building the Docker Image

Build the Docker image using the provided Dockerfile:

```sh
docker build -t gpt-terminal-plus .
```

### Running the Docker Container

Run the Docker container:

```sh
docker run -d -p 5004:5004 gpt-terminal-plus
```

### Customizing the Docker Image

For custom builds based on the base image, you can include additional software and configuration. Refer to the examples in the `docker/` directory for guidance.

For more information, refer to the [Configuration Details](docs/CONFIGURATION.md) documentation.
