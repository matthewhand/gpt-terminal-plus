FROM common-base-image AS builder

WORKDIR /app

# Install OCI CLI
RUN pip install --upgrade pip && pip install --no-cache-dir oci-cli

COPY . .

RUN npm run build

FROM common-base-image

WORKDIR /app

COPY --from=builder /app .

# CMD ["node", "dist/index.js"] inherited from Dockerfile.base
