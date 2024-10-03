FROM mhand79/gpt-terminal-plus:latest


# Install Notion SDK
WORKDIR /scripts
RUN npm install @notionhq/client yargs

WORKDIR /app
# CMD ["node", "dist/index.js"] inherited from Dockerfile.base
