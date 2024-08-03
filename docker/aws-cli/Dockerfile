FROM mhand79/gpt-terminal-plus:latest

WORKDIR /app

# AWS CLI
RUN apt -y install awscli

# JS AWS SDK
RUN npm install --legacy-peer-deps aws-sdk

# CMD ["node", "dist/index.js"] inherited from Dockerfile.base