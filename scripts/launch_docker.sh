#!/bin/bash

# Build the base image
docker build -f docker/Dockerfile.gpt-terminal-plus -t gpt-terminal-plus:latest .

# Build and run all services
docker compose -f docker/compose/docker-compose.all.yml up --build -d
