# Fly.io Deployment

This guide provides instructions for deploying the project to Fly.io.

## Prerequisites

- Fly.io account.
- Fly CLI installed on your machine.

## Setup

### Configuring Fly.io Secrets (One-time Setup)

Use the `set_fly_secrets.sh` script to configure Fly.io secrets. This script sets the necessary environment variables for your Fly.io app.

1. **Edit the `.env` file**: Ensure you have a `.env` file with the necessary environment variables.

2. **Run the script**: Execute the script to set up Fly.io secrets.

    ```sh
    bash scripts/set_fly_secrets.sh -e /path/to/.env -p your-app-name
    ```

### Deploying to Fly.io

1. **Login to Fly.io**:

    ```sh
    flyctl auth login
    ```

2. **Create and launch your app**:

    During this step, you will be prompted to define a unique app name. The app name used in the configuration is already taken, so you must choose a unique name. This will result in a generated FQDN as a Fly.io subdomain.

    ```sh
    flyctl launch
    ```

3. **Deploy your app**:

    ```sh
    flyctl deploy
    ```

### Customizing the Deployment

For customized builds and additional configuration, refer to the `fly_configs/` directory for examples.

For more information, refer to the [Configuration Details](docs/CONFIGURATION.md) documentation.

### Note

The app name used in the configuration is already taken. You will need to define your own unique app name during the `flyctl launch` step, which will result in a generated FQDN as a Fly.io subdomain. Ensure to update the helper scripts to reflect your chosen app name for Let's Encrypt encryption with nginx reverse proxy.

