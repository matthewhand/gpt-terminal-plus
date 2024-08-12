#!/bin/bash

# Description: This script manages Nginx configurations and SSL certificates using Certbot.
# Usage: ./enable_nginx_certbot.sh [options]
# Options:
#   --enable-nginx                Enable Nginx configurations in /etc/nginx/sites-enabled/
#   --enable-certbot              Request SSL certificates for the services using Certbot
#   --domain-name <domain>        Override the domain name used in Nginx configurations and Certbot verification
#   --service <service>           Specify which service to create Nginx config for
#   --deploy-all                  Deploy Nginx config for all available services
#   --skip-checks                 Skip connectivity and protocol checks (default: false)
#   --find-next-port              Find and use the next available port
#   --debug                       Enable debug mode for verbose output

# Function to display usage information
usage() {
  echo "Usage: $0 [options]"
  echo "Options:"
  echo "  --enable-nginx                Enable Nginx configurations"
  echo "  --enable-certbot              Request SSL certificates for the services using Certbot"
  echo "  --domain-name <domain>        Specify the domain name"
  echo "  --service <service>           Specify which service to create Nginx config for"
  echo "  --deploy-all                  Deploy Nginx config for all available services"
  echo "  --skip-checks                 Skip connectivity and protocol checks (default: false)"
  echo "  --find-next-port              Find and use the next available port"
  echo "  --debug                       Enable debug mode for verbose output"
  exit 1
}

# Initialize variables
ENABLE_NGINX=false
ENABLE_CERTBOT=false
DOMAIN_NAME=""
SERVICE=""
DEPLOY_ALL=false
SKIP_CHECKS=false
FIND_NEXT_PORT=false
DEBUG=false

# Parse command line options
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --enable-nginx) ENABLE_NGINX=true ;;
        --enable-certbot) ENABLE_CERTBOT=true ;;
        --domain-name) DOMAIN_NAME="$2"; shift ;;
        --service) SERVICE="$2"; shift ;;
        --deploy-all) DEPLOY_ALL=true ;;
        --skip-checks) SKIP_CHECKS=true ;;
        --find-next-port) FIND_NEXT_PORT=true ;;
        --debug) DEBUG=true ;;
        *) usage ;;
    esac
    shift
done

# Debugging function
debug() {
  if [ "$DEBUG" = true ]; then
    echo "DEBUG: $*"
  fi
}

# Function to extract the port from a Docker Compose file
extract_port() {
  local service_name=$1
  local compose_file="docker/$service_name/docker-compose.yml"

  if [[ -f "$compose_file" ]]; then
    grep -A 1 'ports:' "$compose_file" | grep -oE '[0-9]+' | head -n 1
  else
    echo "Error: $compose_file not found."
    exit 1
  fi
}

# Function to find the next available port
find_next_port() {
  ports=$(grep -roP 'ports:\s*\[\s*"\d+:\d+"' docker/ | grep -oP '\d+(?=:\d+")' | sort -n)
  highest_port=$(echo "$ports" | tail -n 1)
  next_port=$((highest_port + 1))
  echo $next_port
}

# Check if --find-next-port is specified before other options
if [ "$FIND_NEXT_PORT" = true ]; then
  debug "Finding next available port..."
  find_next_port
  exit 0
fi

# Check if domain name is provided
if [ -z "$DOMAIN_NAME" ]; then
  echo "Error: Domain name must be specified with --domain-name."
  usage
fi

# Function to check if Docker is installed
check_docker() {
  if ! command -v docker &> /dev/null; then
    echo "Docker not found. Please install Docker."
    exit 1
  fi
  debug "Docker is installed."
}

# Function to check if Certbot is installed
check_certbot() {
  if ! command -v certbot &> /dev/null; then
    echo "Certbot not found. Please install Certbot."
    exit 1
  fi
  debug "Certbot is installed."
}

# Function to check if Nginx is installed
check_nginx() {
  if [ ! -d /etc/nginx ]; then
    echo "Nginx not found. Please install Nginx."
    exit 1
  fi
  debug "Nginx is installed."
}

# Function to check if envsubst is installed
check_envsubst() {
  if ! command -v envsubst &> /dev/null; then
    echo "envsubst not found. Please install gettext-base using the following command:"
    echo "  sudo apt-get install -y gettext-base"
    exit 1
  fi
  debug "envsubst is installed."
}

# Function to start a service with a specific docker-compose file if not already running
start_service_if_needed() {
  local name=$1
  local compose_file=$2

  if ! docker ps | grep -q "$name"; then
    echo "Starting Docker service for '$name'..."
    docker-compose -p $name -f $compose_file up -d --build
    echo "Service '$name' started with configuration from '$compose_file'."
  else
    echo "Service '$name' is already running."
  fi
  debug "Checked and handled service '$name'."
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
  debug "Enabled Nginx configuration for ${domain}."
}

# Function to request an SSL certificate for a domain using Certbot
request_certbot() {
  local domain=$1
  sudo certbot --nginx -n -d ${domain}
  if [ $? -eq 0 ]; then
    echo "SSL certificate for ${domain} has been successfully requested."
  else
    echo "Failed to request SSL certificate for ${domain}."
  fi
  debug "Requested SSL certificate for ${domain}."
}

# Function to generate Nginx configuration using envsubst
generate_nginx_config() {
  local service_name=$1
  local port=$2

  export service_name
  export port
  export DOMAIN_NAME

  # Use envsubst for substitution
  envsubst '${service_name},${port},${DOMAIN_NAME}' < scripts/nginx/nginx_conf.template | sudo tee /etc/nginx/sites-available/${service_name}.conf > /dev/null
  debug "Generated Nginx config for ${service_name} on port ${port}."
}

# Ensure dependencies are installed
check_docker
check_nginx
check_certbot
check_envsubst

# Function to perform connectivity and protocol checks
perform_checks() {
  local domain=$1
  local url="https://${domain}"

  echo "Checking connectivity and protocol for ${domain}..."
  if curl -s -o /dev/null -w "%{http_code}" ${url}; then
    echo "Successfully connected to ${url}."
  else
    echo "Failed to connect to ${url}."
  fi
  debug "Performed connectivity check for ${domain}."
}

# Dynamically retrieve the list of services
services=()
for dir in docker/*; do
  if [ -d "$dir" ] && [ -f "$dir/docker-compose.yml" ]; then
    services+=("$(basename "$dir")")
  fi
done
debug "Available services: ${services[*]}"

# Deploy configurations for specified service or all services
if [ "$SERVICE" != "" ]; then
  for service in "${services[@]}"; do
    if [ "$service" = "$SERVICE" ]; then
      start_service_if_needed "$service" "docker/$service/docker-compose.yml"
      port=$(extract_port "$service")
      generate_nginx_config "$service" "$port"
      enable_nginx "$service"
      sudo nginx -t && sudo systemctl reload nginx
      request_certbot "$service.$DOMAIN_NAME"
      if [ "$SKIP_CHECKS" = false ]; then
        perform_checks "$service.$DOMAIN_NAME"
      fi
      break
    fi
  done
elif [ "$DEPLOY_ALL" = true ]; then
  for service in "${services[@]}"; do
    start_service_if_needed "$service" "docker/$service/docker-compose.yml"
    port=$(extract_port "$service")
    generate_nginx_config "$service" "$port"
    enable_nginx "$service"
    sudo nginx -t && sudo systemctl reload nginx
    request_certbot "$service.$DOMAIN_NAME"
    if [ "$SKIP_CHECKS" = false ]; then
      perform_checks "$service.$DOMAIN_NAME"
    fi
  done
else
  usage
fi

# Enable Nginx configurations if --enable-nginx is provided
if [ "$ENABLE_NGINX" = true ]; then
  sudo nginx -t
  sudo systemctl reload nginx
  debug "Nginx configuration reloaded."
fi

