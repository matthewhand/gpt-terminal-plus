#!/bin/bash

# Function to display usage information
usage() {
  echo "Usage: $0 [--enable] [--certbot] [--shared-node-modules]"
  echo "  --enable                Enable Nginx configurations in /etc/nginx/sites-enabled/"
  echo "  --certbot               Request SSL certificates for the services using Certbot"
  echo "  --shared-node-modules   Use a shared node_modules volume across services"
  exit 1
}

# Initialize variables
ENABLE=false
CERTBOT=false
SHARED_NODE_MODULES=false

# Parse command line options
while [[ "$#" -gt 0 ]]; do
  case $1 in
    --enable)
      ENABLE=true
      ;;
    --certbot)
      CERTBOT=true
      ;;
    --shared-node-modules)
      SHARED_NODE_MODULES=true
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
  if [ "$SHARED_NODE_MODULES" = true ]; then
    docker compose -p $name -f docker/compose/docker-compose.terminal.yml -f $compose_file up -d --build --volume /usr/src/app/node_modules
  else
    docker compose -p $name -f docker/compose/docker-compose.terminal.yml -f $compose_file up -d --build
  fi
  echo "Service '$name' started with configuration from '$compose_file'."
}

# Function to enable Nginx configuration for a domain
enable_nginx() {
  local domain=$1
  local nginx_conf="/etc/nginx/sites-available/${domain}.conf"
  if [ -f ${nginx_conf} ]; then
    ln -sf ${nginx_conf} /etc/nginx/sites-enabled/
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
  "terminal:5005:docker/compose/docker-compose.terminal.yml"
  "oci:5006:docker/compose/docker-compose.oci.yml"
  "aws:5007:docker/compose/docker-compose.aws.yml"
  "notions:5008:docker/compose/docker-compose.notions.yml"
  "joplin:5009:docker/compose/docker-compose.joplin.yml"
)

# Launch each service with its friendly name and port mapping
for service in "${services[@]}"; do
  IFS=':' read -r name port compose_file <<< "$service"
  start_service "$name" "$compose_file"
  echo "Service '$name' is bound to host port $port and container port 5004."
done

# Enable Nginx configurations if --enable is provided
if [ "$ENABLE" = true ]; then
  for service in "${services[@]}"; do
    IFS=':' read -r name port compose_file <<< "$service"
    enable_nginx "$name"
  done
  # Test the Nginx configuration
  nginx -t
  # Reload Nginx to apply the changes
  systemctl reload nginx
fi

# Request SSL certificates if --certbot is provided
if [ "$CERTBOT" = true ]; then
  for service in "${services[@]}"; do
    IFS=':' read -r name port compose_file <<< "$service"
    request_certbot "$name.teamstinky.duckdns.org"
  done
fi
