#!/bin/bash

# Navigate to the root directory
cd "$(dirname "$0")/.."

# Source the environment variables
source .env

# Build the base image
echo "Building the base image..."
docker build -t common-base-image -f docker/Dockerfile.base .
if [ $? -ne 0 ]; then
  echo "Failed to build the base image."
  exit 1
fi

echo "Base image built successfully."

# Find all docker-compose.yml files and start the services
find docker -name 'docker-compose.yml' | while read -r compose_file; do
  service_name=$(basename "$(dirname "$compose_file")")
  echo "Starting service '$service_name' with configuration from '$compose_file'..."
  docker compose -p "$service_name" -f "$compose_file" up -d --build
...
# Clean up any dangling images to save disk space
docker image prune -f
