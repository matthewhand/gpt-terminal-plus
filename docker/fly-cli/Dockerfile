FROM mhand79/gpt-terminal-plus:latest

# Define build arguments
ARG NODE_ENV
ARG DEBUG

# Use build arguments
RUN echo "NODE_ENV=$NODE_ENV" 
RUN echo "DEBUG=$DEBUG" 

WORKDIR /app

# Install Fly CLI and create entrypoint script
RUN curl -L https://fly.io/install.sh | sh \
    && mkdir -p /root/.fly \
    && echo "Environment Variables:" && env \
    && echo "PATH: $PATH" \
    && echo "Contents of /root/.fly/bin:" && ls -l /root/.fly/bin \
    && echo "flyctl path: /root/.fly/bin/flyctl" \
    && echo '#!/bin/sh\nexport PATH="/root/.fly/bin:\$PATH"\necho "flyctl path: /root/.fly/bin/flyctl"\nexec /root/.fly/bin/flyctl "\$@"' > /app/entrypoint.sh \
    && chmod +x /app/entrypoint.sh

# CMD ["node", "dist/index.js"] inherited from Dockerfile.base