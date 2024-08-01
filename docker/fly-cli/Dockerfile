# Use a base image with necessary tools
FROM ubuntu:latest

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install flyctl
RUN curl -L https://fly.io/install.sh | sh

# Ensure the flyctl binary is in the PATH
ENV FLYCTL_INSTALL="/root/.fly"
ENV PATH="$FLYCTL_INSTALL/bin:$PATH"

# Create a directory for the Fly CLI config
RUN mkdir -p /root/.fly

# Debug step: Verify flyctl installation
RUN /root/.fly/bin/flyctl version

# Set the entrypoint to flyctl
ENTRYPOINT ["/root/.fly/bin/flyctl"]
