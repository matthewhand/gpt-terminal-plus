FROM common-base-image AS builder

WORKDIR /app

# Install flyctl
RUN curl -L https://fly.io/install.sh | sh

# Ensure the flyctl binary is in the PATH
ENV FLYCTL_INSTALL="/root/.fly"
ENV PATH="$FLYCTL_INSTALL/bin:$PATH"

# Create a directory for the Fly CLI config
RUN mkdir -p /root/.fly

# Debug step: Verify flyctl installation
RUN /root/.fly/bin/flyctl version

# CMD ["node", "dist/index.js"] inherited from Dockerfile.base
