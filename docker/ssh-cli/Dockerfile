FROM gpt-terminal-plus AS builder

WORKDIR /app

# Install necessary packages
RUN apt-get update && apt-get install -y openssh-client && apt-get clean

COPY . .

RUN npm run build

FROM gpt-terminal-plus AS builder-image

WORKDIR /app

COPY --from=builder /app .

# CMD ["node", "dist/index.js"] inherited from Dockerfile.base
