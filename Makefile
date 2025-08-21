# Makefile for gpt-terminal-plus

# Default target
.PHONY: all
all: lint test build

# Lint the code
.PHONY: lint
lint:
	npm run lint

# Test the code
.PHONY: test
test:
	npm test

# Build the code
.PHONY: build
build:
	npm run build
