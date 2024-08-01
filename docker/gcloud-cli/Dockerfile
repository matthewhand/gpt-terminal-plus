FROM gpt-terminal-plus AS builder

WORKDIR /app

# Install Google Cloud CLI
RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list \
    && curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg \
    && apt-get update -y \
    && apt-get install google-cloud-cli -y

COPY . .

RUN npm run build

FROM gpt-terminal-plus AS builder-image

WORKDIR /app

COPY --from=builder /app .

# Set up Google Cloud configuration directory
VOLUME ["/root/.config/gcloud"]

# CMD ["node", "dist/index.js"] inherited from Dockerfile.base