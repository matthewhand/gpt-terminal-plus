#!/bin/bash

# Function to list subfolders in the docker directory
list_subfolders() {
  echo "Subfolders in docker/:"
  find docker -mindepth 1 -maxdepth 1 -type d -exec basename {} \;
}

# Function to launch a specific docker-compose file
launch_compose() {
  local app=$1
  local compose_file="docker/$app/docker-compose.yml"

  if [ -f "$compose_file" ]; then
    echo "Launching service '$app' with configuration from '$compose_file'..."
    docker compose -p "$app" -f "$compose_file" up -d
  else
    echo "No docker-compose.yml file found for app '$app' in docker/$app/"
  fi
}

# Function to launch all docker-compose files
launch_all() {
  find docker -name 'docker-compose.yml' | while read -r compose_file; do
    service_name=$(basename "$(dirname "$compose_file")")
    echo "Starting service '$service_name' with configuration from '$compose_file'..."
    docker compose -p "$service_name" -f "$compose_file" up -d
  done

  # Clean up any dangling images to save disk space
  docker image prune -f
}

# Display usage information
usage() {
  echo "Usage: $0 [option]"
  echo "Options:"
  echo "  -l            List subfolders in docker/"
  echo "  -a <app>      Launch the compose file in docker/<app>/docker-compose.yml"
  echo "  -A            Launch all docker-compose files"
  exit 1
}

# Parse command-line arguments
if [ $# -eq 0 ]; then
  usage
fi

while getopts "la:A" opt; do
  case $opt in
    l)
      list_subfolders
      ;;
    a)
      launch_compose "$OPTARG"
      ;;
    A)
      launch_all
      ;;
    *)
      usage
      ;;
  esac
done
