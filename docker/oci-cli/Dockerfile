FROM mhand79/gpt-terminal-plus:latest

WORKDIR /app

# Set NODE_ENV
ENV NODE_ENV=production

# Install dependencies, Python 3, and OCI CLI
RUN apt-get update && apt-get install -y unzip curl python3 python3-pip && pip install oci-cli

# Create /home/chatgpt directory and symlink .oci to /root/.oci
RUN mkdir -p /home/chatgpt && ln -s /root/.oci /home/chatgpt/.oci

# Set PATH
ENV PATH="/root/bin:$PATH"

