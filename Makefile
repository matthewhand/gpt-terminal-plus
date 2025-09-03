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
	# Enable optional prod-route circuit tests for full coverage
	ENABLE_PROD_CIRCUIT_TESTS=1 timeout 300 npm test

# Build the code
.PHONY: build
build:
	npm run build

# Coverage report
.PHONY: coverage
coverage:
	ENABLE_PROD_CIRCUIT_TESTS=1 npx cross-env NODE_CONFIG_DIR=config/test/ NODE_ENV=test jest --coverage --runInBand
