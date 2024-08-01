FROM mhand79/gpt-terminal-plus:latest

WORKDIR /app

RUN curl -L https://fly.io/install.sh | sh \
    && mkdir -p /root/.fly \
    && echo "Environment Variables:" && env \
    && echo "PATH: $PATH" \
    && echo "Contents of /root/.fly/bin:" && ls -l /root/.fly/bin \
    && if [ -f /root/.fly/bin/flyctl ]; then \
           echo "flyctl found"; \
           /root/.fly/bin/flyctl version; \
       else \
           echo "flyctl not found"; \
           exit 1; \
       fi

# CMD ["node", "dist/index.js"] inherited from Dockerfile.base