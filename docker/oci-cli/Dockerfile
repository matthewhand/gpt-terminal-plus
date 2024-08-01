FROM mhand79/gpt-terminal-plus:latest

WORKDIR /app

# Install OCI CLI
RUN pip install --upgrade pip && pip install --no-cache-dir oci-cli

# Add OCI CLI to PATH
ENV PATH="/app/../../../bin:$PATH"

# CMD ["node", "dist/index.js"] inherited from Dockerfile.base