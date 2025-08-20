# Installation Instructions

This guide provides comprehensive installation instructions for setting up the GPT Terminal Plus project using various methods, including Fly.io, Docker, and npm.

## Fly.io Installation

### Prerequisites

1. **Install the Fly.io CLI**:
    - Follow the instructions at [Fly.io CLI Installation](https://fly.io/docs/hands-on/install-flyctl/).

2. **Authenticate the Fly.io CLI**:
    ```bash
    flyctl auth login
    ```

3. **Ensure Docker is Installed and Running**:
    - Follow the instructions at [Docker Installation](https://docs.docker.com/get-docker/).

### Steps

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/matthewhand/gpt-terminal-plus.git
    cd gpt-terminal-plus
    ```

2. **Create a New Fly.io App**:
    ```bash
    flyctl apps create gpt-terminal-plus
    ```

3. **Initialize Fly.io Configuration**:
    ```bash
    flyctl launch
    ```

4. **Deploy the App to Fly.io**:
    ```bash
    flyctl deploy
    ```

5. **Check Status and Logs**:
    ```bash
    flyctl status
    flyctl logs
    ```

### Configuration

- **Update the `fly.toml` File**:
    - Customize as necessary for your deployment needs.
  
- **Set Environment Variables**:
    - Configure environment variables in the Fly.io dashboard for your app.

### Verification

After deploying the app, confirm the installation by checking the following:

1. **Check Application Status**:
    ```bash
    flyctl status -a gpt-terminal-plus
    ```

2. **Check Logs**:
    ```bash
    flyctl logs -a gpt-terminal-plus
    ```

3. **Verify Application Directory**:
    ```bash
    flyctl ssh console -a gpt-terminal-plus -C "ls -la /app"
    ```

4. **Check Node.js Process**:
    ```bash
    flyctl ssh console -a gpt-terminal-plus -C "ps aux | grep node"
    ```

### Troubleshooting

Refer to the troubleshooting section in the [Fly.io Documentation](https://fly.io/docs/).

## Local Docker Installation

### Prerequisites

- Docker installed on your machine.
- Docker Compose installed on your machine.

### Setup

1. **Clone the repository**:
    ```sh
    git clone https://github.com/your-repo/gpt-terminal-plus.git
    cd gpt-terminal-plus
    ```

2. **Create a `.env` file**:
    ```sh
    cp .env.example .env
    ```

3. **Configure environment variables** in the `.env` file.

4. **Optional: Map volumes for specific services**.

5. **Build and run the containers**:
    ```sh
    docker-compose up --build
    ```

6. **Verify the setup**:
    - Access the application at `http://localhost:YOUR_PORT`.
    - Check the logs for any errors or issues.

## Local Installation using npm

### Prerequisites

- Node.js and npm installed on your machine.
- Clone the repository:
  ```sh
  git clone https://github.com/your-repo/project-name.git
  cd project-name
  ```

### Installation

1. Install dependencies:
   ```sh
   npm install
   ```

2. Create a `.env` file in the root directory and add the following:
   ```env
   API_TOKEN=your_unique_api_token_here
   DEBUG=false
   PORT=5005
   ENABLE_FILE_MANAGEMENT=true
   ```

### Running the Application

To start the server, run:
```sh
npm start
```

The server will run on the port specified in the `.env` file.

## Environment Variables

Refer to `docs/CONFIGURATION.md` for detailed information on configuring environment variables.

