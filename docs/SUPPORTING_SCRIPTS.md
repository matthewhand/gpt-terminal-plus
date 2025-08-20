# Supporting Scripts

## deploy_fly_app.sh
- **Purpose**: Launches a Fly.io application and configures secrets based on environment variables.
- **Usage**: Supports setting environment variables like `API_TOKEN`, `NODE_ENV`, `DEBUG`, and `NODE_CONFIG_DIR`. Options for specifying the Fly.io app name and TOML file.
- **Example Commands**:
  - `./deploy_fly_app.sh -a your_api_token -n production -d -c /path/to/config -p your-app-name`
  - `./deploy_fly_app.sh -e /path/to/.env -p your-app-name`
  - `./deploy_fly_app.sh -e /path/to/.env -t /path/to/fly.toml`

## deploy_to_render.sh
- **Purpose**: Deploys an application to Render.com, setting up necessary environment variables and configurations.
- **Usage**: Supports setting environment variables and options like `API_TOKEN`, `DEBUG`, `NODE_ENV`, `OCI_COMPARTMENT_ID`, `OCI_COMPARTMENT_NAME`, `RENDER_API_KEY`, `REPO`, `BRANCH`, `HEALTH_CHECK_PATH`, `NUM_INSTANCES`, and `OWNER_ID`.
- **Example Commands**:
  - `./deploy_to_render.sh --api-token your_api_token --debug true --node-env production --render-api-key your_render_api_key --render-owner-id your_owner_id`
  - `./deploy_to_render.sh --render-api-key your_render_api_key --render-owner-id your_owner_id`

## launch_docker.sh
- **Purpose**: Manages Docker Compose services, allowing listing of subfolders, launching specific Docker Compose files, and launching all Docker Compose files.
- **Usage**: Supports options to list subfolders, launch a specific Docker Compose service, and launch all Docker Compose services.
- **Example Commands**:
  - `./launch_docker.sh -l` (List subfolders in `docker/`)
  - `./launch_docker.sh -a <app>` (Launch the compose file in `docker/<app>/docker-compose.yml`)
  - `./launch_docker.sh -A` (Launch all Docker Compose files)

## deploy_codesandbox_app.sh
- **Purpose**: Deploys the application to CodeSandbox.
- **Usage**: Checks for the CodeSandbox CLI, installs it if necessary, initializes or links to a CodeSandbox project, and deploys the application.
- **Example Commands**:
  - `./deploy_codesandbox_app.sh`

## deploy_gcloud_app.sh
- **Purpose**: Deploys the application to Google Cloud.
- **Usage**: Checks for the Google Cloud SDK, installs it if necessary, initializes or links to a Google Cloud project, and deploys the application.
- **Example Commands**:
  - `./deploy_gcloud_app.sh`

## deploy_netlify_app.sh
- **Purpose**: Deploys the application to Netlify.
- **Usage**: Checks for the Netlify CLI, installs it if necessary, initializes or links to a Netlify site, and deploys the application.
- **Example Commands**:
  - `./deploy_netlify_app.sh`

## enable_nginx_certbot.sh
- **Purpose**: Configures and enables Nginx and Certbot for SSL certificates, with options to deploy configurations for specific services or all available services.
- **Usage**: Supports options like `--enable-nginx`, `--enable-certbot`, `--enable-shared-node-modules`, `--domain-name`, `--service`, `--deploy-all`, and `--skip-checks`.
- **Example Commands**:
  - `./enable_nginx_certbot.sh --enable-nginx --domain-name example.com --service my-service`
  - `./enable_nginx_certbot.sh --enable-certbot --domain-name example.com --deploy-all`
