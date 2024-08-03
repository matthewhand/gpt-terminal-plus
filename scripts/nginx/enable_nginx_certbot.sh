#!/bin/bash

# Function to display usage information
usage() {
  echo "Usage: $0 [--enable-nginx] [--enable-certbot] [--enable-shared-node-modules] [--domain-name <domain>] [--service <service>] [--deploy-all] [--skip-checks]"
  echo "  --enable-nginx                Enable Nginx configurations in /etc/nginx/sites-enabled/"
  echo "  --enable-certbot              Request SSL certificates for the services using Certbot"
  echo "  --enable-shared-node-modules  Use a shared node_modules volume across services"
  echo "  --domain-name <domain>        Override the domain name used in Nginx configurations and Certbot verification"
  echo "  --service <service>           Specify which service to create Nginx config for"
  echo "  --deploy-all                  Deploy Nginx config for all available services"
  echo "  --skip-checks                 Skip connectivity and protocol checks"
  echo "Available services:"
  for dir in docker/*/; do
    if [ -f "$dir/docker-compose.yml" ]; then
      echo "  - $(basename \"$dir\")"
    fi
  done
  exit 1
}

# Initialize variables
ENABLE_NGINX=false
ENABLE_CERTBOT=false
ENABLE_SHARED_NODE_MODULES=false
DOMAIN_NAME="${DOMAIN_NAME:-}"
SERVICE=""
DEPLOY_ALL=false
SKIP_CHECKS=false

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
    --service)
      SERVICE="$2"
      shift
      ;;
    --deploy-all)
      DEPLOY_ALL=true
      ;;
    --skip-checks)
      SKIP_CHECKS=true
      ;;
    *)
      usage
      ;;
  esac
  shift
done

# Check if domain name is provided
if [ -z "$DOMAIN_NAME" ]; then
  echo "Error: Domain name must be specified with --domain-name."
  usage
fi

# Function to check if Docker is installed
check_docker() {
  if ! command -v docker &> /dev/null; then
    echo "Docker not found. Please install Docker using the following commands:"
    echo "  sudo apt-get update"
    echo "  sudo apt-get install -y docker.io"
    echo "  sudo systemctl start docker"
    echo "  sudo systemctl enable docker"
    exit 1
  fi
}

# Function to check if Certbot is installed
check_certbot() {
  if ! command -v certbot &> /dev/null; then
    echo "Certbot not found. Please install Certbot and its dependencies using the following commands:"
    echo "  sudo apt-get update"
    echo "  sudo apt-get install -y certbot python3-certbot-nginx"
    exit 1
  fi
}

# Function to check if Nginx is installed
check_nginx() {
  if [ ! -d /etc/nginx ]; then
    echo "Nginx not found. Please install Nginx using the following commands:"
    echo "  sudo apt-get update"
    echo "  sudo apt-get install -y nginx"
    echo "  sudo systemctl start nginx"
    echo "  sudo systemctl enable nginx"
    exit 1
  fi
}

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
  sudo certbot --nginx -n -d ${domain}
  if [ $? -eq 0 ]; then
    echo "SSL certificate for ${domain} has been successfully requested."
  else
    echo "Failed to request SSL certificate for ${domain}."
  fi
}

# Function to extract port from docker-compose.yml
extract_port() {
  local compose_file=$1
  local port=$(grep 'ports:' -A 1 $compose_file | tail -n 1 | awk -F '[:-]' '{print $2}' | tr -d ' ')
  echo $port
}

# Generate Nginx configuration for a specific service
generate_nginx_config() {
  local service_name=$1
  local port=$2
  local config_content="
server {
    listen 80;
    server_name ${service_name}.${DOMAIN_NAME};

    location / {
        proxy_pass http://localhost:${port};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
"
  echo "$config_content" | sudo tee /etc/nginx/sites-available/${service_name}.conf > /dev/null
}

# Dynamically retrieve the list of services
services=()
for dir in docker/*/; do
  if [ -f "$dir/docker-compose.yml" ]; then
    services+=("$(basename "$dir")")
  fi
done

# Check if Docker is installed
check_docker

# Check if Nginx is installed
check_nginx

# Check if Certbot is installed
check_certbot

# Function to perform connectivity and protocol checks
perform_checks() {
  local domain=$1
  local url="https://${domain}"

  echo "Checking connectivity and protocol for ${domain}..."
  curl -s -o /dev/null -w "%{http_code}" ${url}
  if [ $? -eq 0 ]; then
    echo "Successfully connected to ${url}."
  else
    echo "Failed to connect to ${url}."
  fi
}

# Deploy configurations for specified service or all services
if [ "$SERVICE" != "" ]; then
  for service in "${services[@]}"; do
    if [ "$service" = "$SERVICE" ]; then
      port=$(extract_port "docker/$service/docker-compose.yml")
      generate_nginx_config "$service" "$port"
      start_service "$service" "docker/$service/docker-compose.yml"
      enable_nginx "$service"
      sudo nginx -t
      sudo systemctl reload nginx
      request_certbot "$service.$DOMAIN_NAME"
      if [ "$SKIP_CHECKS" = false ]; then
        perform_checks "$service.$DOMAIN_NAME"
      fi
      break
    fi
  done
elif [ "$DEPLOY_ALL" = true ]; then
  for service in "${services[@]}"; do
    port=$(extract_port "docker/$service/docker-compose.yml")
    generate_nginx_config "$service" "$port"
    start_service "$service" "docker/$service/docker-compose.yml"
    enable_nginx "$service"
    sudo nginx -t
    sudo systemctl reload nginx
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
fi
