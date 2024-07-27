# Installing `gpt-terminal-plus` Locally with Docker

## Prerequisites

1. **Install Docker**:
    - Follow the instructions at [Docker Installation](https://docs.docker.com/get-docker/).

## Steps

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/matthewhand/gpt-terminal-plus.git
    cd gpt-terminal-plus
    ```

2. **Copy and Configure `.env` File**:
    ```bash
    cp .env.sample .env
    # Edit .env to set your configuration values
    ```

3. **Build and Run the Docker Container**:
    ```bash
    docker build -t gpt-terminal-plus .
    docker run -d -p 5004:5004 --env-file .env gpt-terminal-plus
    ```

4. **Check the Status and Logs**:
    ```bash
    docker ps
    docker logs <container_id>
    ```

## Configuration

- **Update the `.env` File**:
    - Ensure the `.env` file contains all necessary configuration values, especially `API_TOKEN`.

## Troubleshooting

- Ensure Docker is running properly.
- Check Docker logs for errors.

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
