#!/bin/bash

# deploy_railway_app.sh
# A script to deploy the Railway application

# Enable debugging
set -ex

# Define variables
PROJECT_ROOT=$(pwd)

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
  echo "Railway CLI not found, installing..."
  npm install -g railway
fi

# Navigate to the project root directory
cd "$PROJECT_ROOT"

# Login to Railway (requires user interaction)
railway login

# Initialize a new Railway project or link to an existing project
if [ ! -f ".railway/config.json" ]; then
  railway init --name gpt-terminal-plus
else
  railway link
fi

# Deploy the application to Railway
railway up

# Output the status of the deployment
railway status

# Navigate back to the original directory
cd -

# Deployment complete
echo "Railway app deployment complete."
