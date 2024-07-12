# Makefile

# Define variables for commands
#DOCKER_COMPOSE = docker-compose # v1 syntax
DOCKER_COMPOSE = docker compose
DOCKER_BUILD = $(DOCKER_COMPOSE) build
DOCKER_UP = $(DOCKER_COMPOSE) up -d

# Default target
all: build up

# Build the Docker image
build:
	@echo "Building Docker image..."
	@$(DOCKER_BUILD)

# Bring up the container
up:
	@echo "Starting Docker container..."
	@$(DOCKER_UP)

# Stop and remove containers, networks, images, and volumes
down:
	@echo "Stopping and removing Docker containers..."
	@$(DOCKER_COMPOSE) down

# Help
help:
	@echo "Makefile for managing the Docker container"
	@echo ""
	@echo "Usage:"
	@echo "  make build  - Build the Docker image"
	@echo "  make up     - Start the Docker container"
	@echo "  make down   - Stop and remove the Docker container"
	@echo "  make help   - Display this help message"
	@echo ""

.PHONY: build up down help

