#!/bin/bash

# deploy_gcloud_app.sh
# A script to deploy the Google Cloud application

# Enable debugging
set -ex

# Define variables
PROJECT_ROOT=$(pwd)

# Check if Google Cloud SDK is installed
if ! command -v gcloud &> /dev/null; then
  echo "Google Cloud SDK not found, installing..."
  curl https://sdk.cloud.google.com | bash
  exec -l $SHELL
  gcloud init
fi

# Navigate to the project root directory
cd "$PROJECT_ROOT"

# Login to Google Cloud (requires user interaction)
gcloud auth login

# Initialize a new Google Cloud project or link to an existing project
gcloud projects create gpt-terminal-plus --set-as-default

# Deploy the application to Google Cloud
gcloud app deploy

# Output the status of the deployment
gcloud app describe

# Navigate back to the original directory
cd -

# Deployment complete
echo "Google Cloud app deployment complete."
