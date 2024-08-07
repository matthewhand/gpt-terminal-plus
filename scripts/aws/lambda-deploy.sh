#!/bin/bash

# lambda-deploy.sh
# A script to deploy an existing Express.js application to AWS Lambda using the Serverless Framework

# Enable debugging
set -ex

# Function to display usage
usage() {
    echo "Usage: $0 [-p <project-name>] [-r <aws-region>]"
    echo "  -p  Project Name (default: gpt-terminal-plus)"
    echo "  -r  AWS Region (default: us-west-2)"
    exit 1
}

# Default values
PROJECT_NAME="gpt-terminal-plus"
AWS_REGION="us-west-2"

# Parse arguments
while getopts "p:r:h" opt; do
    case ${opt} in
        p) PROJECT_NAME=${OPTARG} ;;
        r) AWS_REGION=${OPTARG} ;;
        h) usage ;;
        *) usage ;;
    esac
done

# Initialize Serverless project
serverless create --template aws-nodejs --path $PROJECT_NAME
cd $PROJECT_NAME

# Copy existing application code
cp -R ../src .

# Install dependencies
npm init -y
npm install express serverless-http dotenv config

# Create handler
cat << 'EOH' > handler.js
const serverless = require('serverless-http');
const app = require('./src/index');

module.exports.handler = serverless(app);
EOH

# Update serverless.yml
cat << 'EOS' > serverless.yml
service: $PROJECT_NAME

provider:
  name: aws
  runtime: nodejs20.x
  region: $AWS_REGION

functions:
  app:
    handler: handler.handler
    events:
      - http:
          path: /
          method: any
      - http:
          path: /{proxy+}
          method: any
EOS

# Deploy the service
serverless deploy

cd ..
