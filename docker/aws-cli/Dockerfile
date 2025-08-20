FROM mhand79/gpt-terminal-plus:latest

WORKDIR /app

# Install apt-utils and AWS CLI, then clean up
RUN apt-get update && \
    apt-get install -y apt-utils awscli && \
    rm -rf /var/lib/apt/lists/*

# Install JS AWS SDK without legacy-peer-deps
RUN npm install aws-sdk

# CMD ["node", "dist/index.js"] inherited from Dockerfile.base
