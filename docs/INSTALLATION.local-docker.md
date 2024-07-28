cd /home/chatgpt/gpt-terminal-plus

cat << 'EOF' > docs/INSTALLATION.local-docker.md
# Installing `gpt-terminal-plus` Locally with Docker

## Prerequisites

1. **Install Docker**:
    - Follow the instructions at [Docker Installation](https://docs.docker.com/get-docker/).

2. **Install Docker Compose**:
    - Follow the instructions at [Docker Compose Installation](https://docs.docker.com/compose/install/).

## Steps

### Option 1: Deploy Using Docker Compose

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/matthewhand/gpt-terminal-plus.git
    cd gpt-terminal-plus
    ```

2. **Start the Container Using Docker Compose**:
    ```bash
    docker compose up -d
    ```
    Example output:
    ```plaintext
    time="2024-07-28T00:58:20Z" level=warning msg="The \"NODE_ENV\" variable is not set. Defaulting to a blank string."
    time="2024-07-28T00:58:20Z" level=warning msg="The \"PYTHONPATH\" variable is not set. Defaulting to a blank string."
     Container gpt-terminal-plus-app-1  Recreate
     Container gpt-terminal-plus-app-1  Recreated
     Container gpt-terminal-plus-app-1  Starting
     Container gpt-terminal-plus-app-1  Started
    ```

3. **Verify the Container is Running**:
    ```bash
    docker compose ps
    ```
    Example output:
    ```plaintext
    NAME                        COMMAND                  SERVICE             STATUS              PORTS
    gpt-terminal-plus-app-1     "docker-entrypoint.s…"   app                 running             0.0.0.0:5005->5004/tcp
    ```

4. **Check Logs**:
    ```bash
    docker compose logs
    ```
    Example output:
    ```plaintext
    gpt-terminal-plus-app-1  | Starting app...
    gpt-terminal-plus-app-1  | App started successfully
    ```

### Option 2: Deploy Using Dockerfile

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/matthewhand/gpt-terminal-plus.git
    cd gpt-terminal-plus
    ```

2. **Build the Docker Image**:
    ```bash
    docker build -t gpt-terminal-plus .
    ```

3. **Run the Docker Container**:
    ```bash
    docker run -d -p 5004:5004 gpt-terminal-plus
    ```

4. **Verify the Container is Running**:
    ```bash
    docker ps
    ```
    Example output:
    ```plaintext
    CONTAINER ID   IMAGE               COMMAND                  CREATED          STATUS          PORTS                    NAMES
    abcdef123456   gpt-terminal-plus   "docker-entrypoint.s…"   10 seconds ago   Up 5 seconds    0.0.0.0:5004->5004/tcp   loving_morse
    ```

5. **Check Logs**:
    ```bash
    docker logs <CONTAINER_ID>
    ```
    Example output:
    ```plaintext
    Starting app...
    App started successfully
    ```

## Troubleshooting

### Common Errors

1. **Container Fails to Start**:
    - Check the Docker Compose logs for detailed error messages.
    ```bash
    docker compose logs
    ```

2. **Missing Environment Variables**:
    - Ensure all required environment variables are set in the `.env` file.

3. **Docker Issues**:
    - Ensure Docker and Docker Compose are installed and running properly.

### Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
EOF

git add docs/INSTALLATION.local-docker.md
git commit -m "docs: update INSTALLATION.local-docker.md with Docker and Docker Compose instructions and example output"
git push origin main
