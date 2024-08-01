#!/bin/bash

# Function to display usage information
usage() {
  echo "Usage: $0 [--enable-nginx] [--enable-certbot] [--enable-shared-node-modules] [--domain-name <domain>]"
  echo "  --enable-nginx                Enable Nginx configurations in /etc/nginx/sites-enabled/"
  echo "  --enable-certbot              Request SSL certificates for the services using Certbot"
  echo "  --enable-shared-node-modules  Use a shared node_modules volume across services"
  echo "  --domain-name <domain>        Override the domain name used in Nginx configurations and Certbot verification"
  exit 1
}

# Initialize variables
ENABLE_NGINX=false
ENABLE_CERTBOT=false
ENABLE_SHARED_NODE_MODULES=false
DOMAIN_NAME="${DOMAIN_NAME:-}"

# Parse command line options
while [[ "$#" -gt 0 ]]; do
  case $1 in
    --enable-nginx)
      ENABLE_NGINX=true
      ;;
    --enable-certbot)
      ENABLE_CERTBOT=true
      ;;
    --enable-shared-node-modules)
      ENABLE_SHARED_NODE_MODULES=true
      ;;
    --domain-name)
      DOMAIN_NAME="$2"
      shift
      ;;
    *)
      usage
      ;;
  esac
  shift
done

# Function to start a service with a specific docker-compose file
start_service() {
  local name=$1
  local compose_file=$2
  if [ "$ENABLE_SHARED_NODE_MODULES" = true ]; then
    docker compose -p $name -f docker/compose/docker-compose.base.yml -f $compose_file up -d --build --volume /usr/src/app/node_modules:/usr/src/app/node_modules
  else
    docker compose -p $name -f docker/compose/docker-compose.base.yml -f $compose_file up -d --build
  fi
  echo "Service '$name' started with configuration from '$compose_file'."
}

# Function to enable Nginx configuration for a domain
enable_nginx() {
  local domain=$1
  local nginx_conf="/etc/nginx/sites-available/${domain}.conf"
  if [ -f ${nginx_conf} ]; then
    sudo ln -sf ${nginx_conf} /etc/nginx/sites-enabled/
    echo "Nginx configuration for ${domain} has been enabled."
  else
    echo "Nginx configuration file ${nginx_conf} not found."
  fi
}

# Function to request an SSL certificate for a domain using Certbot
request_certbot() {
  local domain=$1
  sudo certbot certonly --nginx -d ${domain}
  if [ $? -eq 0 ]; then
    echo "SSL certificate for ${domain} has been successfully requested."
  else
    echo "Failed to request SSL certificate for ${domain}."
  fi
}

# Services to be launched with their respective ports
services=(
  "ssh-cli:5005:docker/compose/docker-compose.ssh-cli.yml"
  "oci-cli:5006:docker/compose/docker-compose.oci-cli.yml"
  "aws-cli:5007:docker/compose/docker-compose.aws-cli.yml"
  "notions:5008:docker/compose/docker-compose.notions.yml"
  "joplin:5009:docker/compose/docker-compose.joplin.yml"
)

# Build the base image
echo "Building the base image..."
docker compose -f docker/compose/docker-compose.base.yml up -d --build
if [ $? -ne 0 ]; then
  echo "Failed to build the base image."
  exit 1
fi

echo "Base image built successfully."

# Launch each service with its friendly name and port mapping
for service in "${services[@]}"; do
  IFS=':' read -r name port compose_file <<< "$service"
  start_service "$name" "$compose_file"
  echo "Service '$name' is bound to host port $port and container port 5004."
done

# Enable Nginx configurations if --enable-nginx is provided
if [ "$ENABLE_NGINX" = true ]; then
  for service in "${services[@]}"; do
    IFS=':' read -r name port compose_file <<< "$service"
    enable_nginx "$name"
  done
  # Test the Nginx configuration
  sudo nginx -t
  # Reload Nginx to apply the changes
  sudo systemctl reload nginx
fi

# Request SSL certificates if --enable-certbot is provided
if [ "$ENABLE_CERTBOT" = true ]; then
  for service in "${services[@]}"; do
    IFS=':' read -r name port compose_file <<< "$service"
    if [ -n "$DOMAIN_NAME" ]; then
      request_certbot "$DOMAIN_NAME"
    else
      request_certbot "$name"
    fi
  done
fi
