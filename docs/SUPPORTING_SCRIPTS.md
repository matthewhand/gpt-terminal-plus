# Supporting Scripts

This document provides detailed information about the supporting scripts included in the GPT Terminal Plus project. These scripts facilitate various deployment and configuration tasks.

## Scripts Overview

### `deploy_fly_app.sh`

This script launches a Fly.io application based on a provided TOML file and configures secrets for the application based on environment variables.

#### Usage

```sh
./scripts/deploy_fly_app.sh [options]
```

#### Options

- `-h, --help`                   Show help message and exit.
- `-a, --api-token TOKEN`        Set the API token.
- `-n, --node-env ENV`           Set the Node environment (default: development).
- `-d, --debug`                  Enable debug logging.
- `-c, --node-config-dir DIR`    Set the Node configuration directory.
- `-e, --env-file FILE`          Source environment variables from a file.
- `-p, --fly-app-name NAME`      Specify the Fly.io app name.
- `-t, --toml-file FILE`         Specify the TOML file to load the app name from.

### `deploy_to_render.sh`

This script deploys the application to Render. It supports setting various environment variables and making API requests to Render to create the service.

#### Usage

```sh
./scripts/deploy_to_render.sh [options]
```

#### Options

- `--api-token API_TOKEN`             API token.
- `--debug DEBUG`                     Debug setting.
- `--node-env NODE_ENV`               Node environment.
- `--oci-compartment-id OCI_COMPARTMENT_ID`  OCI compartment ID.
- `--oci-compartment-name OCI_COMPARTMENT_NAME`  OCI compartment name.
- `--render-api-key RENDER_API_KEY`   Render API key (required).
- `--repo REPO`                       GitHub repository (default: https://github.com/matthewhand/gpt-terminal-plus.git).
- `--branch BRANCH`                   Branch name (default: main).
- `--health-check-path HEALTH_CHECK_PATH` Path for health checks (default: /health).
- `--num-instances NUM_INSTANCES`     Number of instances to run (default: 1).
- `--render-owner-id RENDER_OWNER_ID` Owner ID (required).

### `launch_docker.sh`

This script provides functions to list subfolders in the `docker` directory, launch a specific Docker Compose file, and launch all Docker Compose files.

#### Usage

```sh
./scripts/launch_docker.sh [option]
```

#### Options

- `-l`            List subfolders in `docker/`.
- `-a <app>`      Launch the compose file in `docker/<app>/docker-compose.yml`.
- `-A`            Launch all Docker Compose files.

### `nginx/enable_nginx_certbot.sh`

This script enables Nginx configurations and requests SSL certificates using Certbot.

#### Usage

```sh
./scripts/nginx/enable_nginx_certbot.sh [options]
```

#### Options

- `--enable-nginx`                Enable Nginx configurations in `/etc/nginx/sites-enabled/`.
- `--enable-certbot`              Request SSL certificates for the services using Certbot.
- `--enable-shared-node-modules`  Use a shared `node_modules` volume across services.
- `--domain-name <domain>`        Override the domain name used in Nginx configurations and Certbot verification.
- `--service <service>`           Specify which service to create Nginx config for.
- `--deploy-all`                  Deploy Nginx config for all available services.
- `--skip-checks`                 Skip connectivity and protocol checks.

