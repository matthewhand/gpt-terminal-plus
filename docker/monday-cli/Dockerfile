FROM mhand79/gpt-terminal-plus:latest

WORKDIR /app

# Install monday sdk for JS
RUN npm install monday-sdk-js

# Install graphql
RUN npm install graphql

# Set NODE_PATH to include /app/node_modules
ENV NODE_PATH=/app/node_modules

# Set up bash as the default shell
SHELL ["/bin/bash", "-c"]

# Add this to Dockerfile to source all scripts at the start of each session
RUN echo "for script in /scripts/*.sh; do source \$script; done" >> ~/.bashrc

# CMD ["node", "dist/index.js"] inherited from Dockerfile.base
