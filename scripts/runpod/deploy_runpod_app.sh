#!/bin/bash

# deploy_runpod_app.sh
# A script to deploy the Runpod application

# Enable debugging
set -ex

# Define variables
PROJECT_ROOT=$(pwd)

# Check if Runpod CLI is installed
if ! command -v runpod &> /dev/null; then
  echo "Runpod CLI not found, installing..."
  npm install -g runpod
fi

# Navigate to the project root directory
cd "$PROJECT_ROOT"

# Login to Runpod (requires user interaction)
runpod login

# Initialize a new Runpod project or link to an existing project
if [ ! -f ".runpod/config.json" ]; then
  runpod init --name gpt-terminal-plus
else
  runpod link
fi

# Deploy the application to Runpod
runpod deploy

# Output the status of the deployment
runpod status

# Navigate back to the original directory
cd -

# Deployment complete
echo "Runpod app deployment complete."
