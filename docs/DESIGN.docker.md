# Docker Design Principles

## Overview

This document outlines the design principles and configurations for Docker services in the project. Each Docker Compose file is tailored to a specific service, ensuring a single purpose for each endpoint.

## Dockerfile.base

The `Dockerfile.base` is a common base image used for building various service-specific Docker images. It includes the following steps:

1. **Use Node 18 as the base image:**
   ```Dockerfile
   FROM node:18 AS builder
   ```

2. **Set the working directory:**
   ```Dockerfile
   WORKDIR /app
   ```

3. **Copy package.json and package-lock.json:**
   ```Dockerfile
   COPY package*.json ./
   ```

4. **Install dependencies:**
   ```Dockerfile
   RUN npm install
   ```

5. **Copy the rest of the application code:**
   ```Dockerfile
   COPY . .
   ```

6. **Build the application:**
   ```Dockerfile
   RUN npm run build
   ```

7. **Production stage:**
   ```Dockerfile
   FROM node:18
   WORKDIR /app
   COPY --from=builder /app .
   EXPOSE 5004
   CMD ["node", "dist/index.js"]
   ```

### Extending Dockerfile.base

Each service-specific Dockerfile extends from the `Dockerfile.base` and adds its own configurations.

#### Dockerfile.oci
```Dockerfile
FROM base AS builder

# Install OCI CLI
RUN apt-get update && apt-get install -y python3-pip && pip3 install oci-cli
```

#### Dockerfile.aws
```Dockerfile
FROM base AS builder

# Install AWS CLI and AWS SDK for Node.js and Python3
RUN apt-get update && apt-get install -y awscli python3-pip && pip3 install boto3 && npm install aws-sdk
```

#### Dockerfile.notions
```Dockerfile
FROM base AS builder

# Install Notion SDK for Node.js
RUN npm install @notionhq/client
```

#### Dockerfile.joplin
```Dockerfile
FROM base AS builder

# Install Joplin CLI
RUN npm install -g joplin
```

## Docker Compose Configurations

The following tables summarize the volumes, environment variables, and other configurations for each Docker Compose file.

### Docker Compose Files Summary

#### Volumes

| Service       | Volume Configuration                         |
|---------------|-----------------------------------------------|
| OCI           | `/mnt/models/lib/oracle-cli:/opt/oracle-cli`  |
| AWS           | `../.aws:/root/.aws:ro`                       |
| Notions       | (None)                                        |
| Joplin        | (None)                                        |

#### Environment Variables

| Service       | Environment Variables                                         |
|---------------|---------------------------------------------------------------|
| OCI           | `NODE_ENV`, `DEBUG`, `API_TOKEN`, `OCI_COMPARTMENT_ID`, `OCI_COMPARTMENT_NAME` |
| AWS           | `NODE_ENV`, `DEBUG`, `API_TOKEN`                              |
| Notions       | `NODE_ENV`, `DEBUG`, `API_TOKEN`, `NOTION_TOKEN`              |
| Joplin        | `NODE_ENV`, `DEBUG`, `API_TOKEN`                              |

#### Port Configurations

| Service       | Port Mapping     |
|---------------|------------------|
| OCI           | `5006:5004`      |
| AWS           | `5007:5004`      |
| Notions       | `5008:5004`      |
| Joplin        | `5009:5004`      |

## Notes

- Ensure each service is started with incrementally numbered ports to avoid conflicts.
- The `launch_services.sh` script facilitates the launching and configuration of services.
