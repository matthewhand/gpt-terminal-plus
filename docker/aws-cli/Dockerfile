FROM common-base-image AS builder

WORKDIR /app

# Install AWS SDK
RUN npm install --legacy-peer-deps aws-sdk

COPY . .

RUN npm run build

FROM common-base-image

WORKDIR /app

COPY --from=builder /app .

# CMD ["node", "dist/index.js"] inherited from Dockerfile.base
