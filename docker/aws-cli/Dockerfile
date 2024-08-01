FROM gpt-terminal-plus AS builder

WORKDIR /app

# Install AWS SDK
RUN npm install --legacy-peer-deps aws-sdk

COPY . .

RUN npm run build

FROM gpt-terminal-plus AS builder-image

WORKDIR /app

COPY --from=builder /app .

# CMD ["node", "dist/index.js"] inherited from Dockerfile.base
