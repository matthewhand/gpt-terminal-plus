# Docker Setup

This guide provides instructions for setting up the GPT Terminal Plus project using Docker.

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
docker run -d -p 5005:5005 --env-file .env gpt-terminal-plus
```

### Customizing the Docker Image

For custom builds based on the base image, you can include additional software and configuration. Refer to the examples in the `docker/` directory for guidance.

### Running Custom Docker Containers

Refer to the `docs/SUPPORTING_SCRIPTS.md` for information on launching and managing custom Docker containers.

For more information, refer to the [Configuration Details](docs/CONFIGURATION.md) documentation.

### Environment Variables

Ensure you have the required environment variables set in the `.env` file. Refer to the [Configuration Details](docs/CONFIGURATION.md) documentation for more information.

### Using Docker Compose

If you prefer using Docker Compose, you can create a `docker-compose.yml` file with the necessary configuration. An example is provided below:

```yaml
version: 3.8

services:
  gpt-terminal-plus:
    image: gpt-terminal-plus
    ports:
      - "5005:5005"
    env_file:
      - .env
    volumes:
      - ./config:/app/config
```

To start the application using Docker Compose, run:

```sh
docker-compose up -d
```

