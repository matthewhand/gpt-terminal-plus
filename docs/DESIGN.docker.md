# Docker Design Principles

## Overview

This document outlines the design principles and configurations for Docker services in the project. Each Docker Compose file is tailored to a specific service, ensuring a single purpose for each endpoint.

## Docker Compose Files

### `docker-compose.terminal.yml`

- **Purpose**: Provides the configuration for the `terminal` service, primarily for SSH operations.
- **Ports**: Maps port `5005` on the host to port `5004` in the container.
- **Volumes**:
  - **SSH Directory**: `../.ssh:/root/.ssh:rw`
  - The SSH directory is mapped for the 'terminal' service to update host keys.

### Other Docker Compose Files

- **OCI**: `docker-compose.oci.yml`
  - Port: `5006`
  - Includes OCI-specific configurations and volumes.
- **AWS**: `docker-compose.aws.yml`
  - Port: `5007`
  - Includes AWS-specific configurations and volumes.
- **Notion**: `docker-compose.notions.yml`
  - Port: `5008`
- **Joplin**: `docker-compose.joplin.yml`
  - Port: `5009`
  - Includes Joplin-specific configurations and persistent storage.

## Environment Variables

Refer to `docs/CONFIG.envvars.md` for detailed information on configuring environment variables.

## Notes

- Ensure each service is started with incrementally numbered ports to avoid conflicts.
- The `launch_services.sh` script facilitates the launching and configuration of services.
