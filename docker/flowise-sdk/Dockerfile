# Use the base image for GPT integration
FROM mhand79/gpt-terminal-plus:latest

# Set the working directory
WORKDIR /app

# Install Python3 and other necessary tools
RUN apt-get update && \
    apt-get install -y python3 python3-requests python3-venv pipx && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create a virtual environment and activate it
RUN python3 -m venv /opt/venv

# Install Flowise SDK within the virtual environment
RUN /opt/venv/bin/pip install --upgrade pip && \
    /opt/venv/bin/pip install flowise

# Ensure the virtual environment is used by default
ENV PATH="/opt/venv/bin:$PATH"

# Inherited CMD from base image
# CMD ["node", "dist/src/index.js"]
