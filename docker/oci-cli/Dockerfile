FROM python:3.9-slim

WORKDIR /app

# Set NODE_ENV
ENV NODE_ENV=production

# Install dependencies and OCI CLI
RUN apt-get update && apt-get install -y unzip curl && pip install oci-cli

# Create /home/chatgpt directory and symlink .oci to /root/.oci
RUN mkdir -p /home/chatgpt && ln -s /root/.oci /home/chatgpt/.oci

# Set PATH
ENV PATH="/root/bin:\$PATH"

# Install any other dependencies if needed

