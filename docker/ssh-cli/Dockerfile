FROM mhand79/gpt-terminal-plus:latest

WORKDIR /app

# Install necessary packages
RUN apt-get update && apt-get install -y openssh-client rsync && apt-get clean

# CMD ["node", "dist/index.js"] inherited from Dockerfile.base