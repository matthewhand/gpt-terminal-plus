FROM mhand79/gpt-terminal-plus:latest

WORKDIR /app

# Install monday-cli
RUN npm install -g @mondaycom/apps-cli

# Configure monday-cli using MONDAY_TOKEN
#RUN mapps init -t ${MONDAY_TOKEN}

# CMD ["node", "dist/index.js"] inherited from Dockerfile.base
