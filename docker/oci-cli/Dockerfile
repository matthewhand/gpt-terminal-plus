FROM gpt-terminal-plus AS builder

WORKDIR /app

# Install OCI CLI
RUN pip install --upgrade pip && pip install --no-cache-dir oci-cli

COPY . .

RUN npm run build

FROM gpt-terminal-plus AS builder-image

WORKDIR /app

COPY --from=builder /app .

# Add OCI CLI to PATH
ENV PATH="/app/../../../bin:$PATH"

# CMD ["node", "dist/index.js"] inherited from Dockerfile.base