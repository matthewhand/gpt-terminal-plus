FROM common-base-image AS builder

WORKDIR /app

# Install flyctl
RUN curl -L https://fly.io/install.sh | sh

# Ensure the flyctl binary is in the PATH
ENV FLYCTL_INSTALL="/root/.fly"
ENV PATH="$FLYCTL_INSTALL/bin:$PATH"

# Create a directory for the Fly CLI config
RUN mkdir -p /root/.fly

# Debug steps: Output environment variables, verify flyctl installation and PATH, and check file existence
RUN echo "Environment Variables:" && env \
    && echo "PATH: $PATH" \
    && echo "Contents of /root/.fly/bin:" && ls -l /root/.fly/bin \
    && if [ -f /root/.fly/bin/flyctl ]; then \
           echo "flyctl found"; \
           /root/.fly/bin/flyctl version; \
       else \
           echo "flyctl not found"; \
           exit 1; \
       fi

# CMD ["node", "dist/index.js"] inherited from Dockerfile.base
