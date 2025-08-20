# Makefile for gpt-terminal-plus

# Default target
.PHONY: all
all: lint test build

# Defaults for smoke-hosting target
BASES ?= $(HOST_BASES)
ECHO_MSG ?= SMOKE_OK

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

# Hosted smoke checks (Fly/Vercel/etc.)
# Usage examples:
#  make smoke-hosting BASES="https://gpt-terminal-plus.fly.dev https://gpt-terminal-plus.vercel.app" SKIP_PROTECTED=1
#  make smoke-hosting BASES="https://gpt-terminal-plus.fly.dev" TOKEN=$$API_TOKEN ECHO_MSG=OK TIMEOUT=20
.PHONY: smoke-hosting
smoke-hosting:
	@echo "Running hosted smoke with BASES=$(BASES) TOKEN=$(if $(TOKEN),***,unset) SKIP_PROTECTED=$(SKIP_PROTECTED)"
	npm run -s smoke:hosting -- $(foreach b,$(BASES),--base $(b)) $(if $(TOKEN),--token $(TOKEN),$(if $(SKIP_PROTECTED),--skip-protected,)) $(if $(ECHO_MSG),--echo-msg $(ECHO_MSG),) $(if $(TIMEOUT),--timeout $(TIMEOUT),)
