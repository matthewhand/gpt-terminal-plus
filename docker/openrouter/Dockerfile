FROM mhand79/gpt-terminal-plus:latest

WORKDIR /app

# Install Python3
RUN apt-get update && \
    apt-get install -y python3 python3-requests && \
    apt install python3-venv pipx \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN pipx install llm
RUN ls -l /root/.local/bin/llm
RUN /root/.local/bin/llm install llm-openrouter
