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
	timeout 300 npm test

# Build the code
.PHONY: build
build:
	npm run build

# Coverage report
.PHONY: coverage
coverage:
	npx cross-env NODE_CONFIG_DIR=config/test/ NODE_ENV=test jest --coverage --runInBand
