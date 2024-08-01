FROM gpt-terminal-plus AS builder-image AS builder

WORKDIR /app

# Install Joplin CLI
RUN npm install --legacy-peer-deps joplin

COPY . .

RUN npm run build

FROM gpt-terminal-plus AS builder-image

WORKDIR /app

COPY --from=builder /app .

# CMD ["node", "dist/index.js"] inherited from Dockerfile.base
