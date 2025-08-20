# Use published container image as the base
FROM mhand79/gpt-terminal-plus:latest

# Set the working directory
WORKDIR /app

# Install Python3 and other necessary tools
RUN apt-get update && \
    apt-get install -y python3 python3-requests python3-venv pipx && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install the llm tool
RUN pipx install llm

# Verify installation of llm and install the OpenRouter plugin
RUN ls -l /root/.local/bin/llm && \
    /root/.local/bin/llm install llm-openrouter

# Create a virtual environment and activate it
RUN python3 -m venv /opt/venv

# Install llama-index within the virtual environment
RUN /opt/venv/bin/pip install --upgrade pip && \
    /opt/venv/bin/pip install llama-index

# Ensure the virtual environment is used by default
ENV PATH="/opt/venv/bin:$PATH"

# CMD ["node", "dist/src/index.js"]