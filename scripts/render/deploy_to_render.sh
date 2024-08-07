#!/bin/bash

# Function to print usage
print_usage() {
  echo "Usage: $0 [options]"
  echo "Options:"
  echo "  --api-token API_TOKEN             API token"
  echo "  --debug DEBUG                     Debug setting"
  echo "  --node-env NODE_ENV               Node environment"
  echo "  --oci-compartment-id OCI_COMPARTMENT_ID  OCI compartment ID"
  echo "  --oci-compartment-name OCI_COMPARTMENT_NAME  OCI compartment name"
  echo "  --render-api-key RENDER_API_KEY   Render API key (required)"
  echo "  --repo REPO                       GitHub repository (default: 'https://github.com/matthewhand/gpt-terminal-plus.git')"
  echo "  --branch BRANCH                   Branch name (default: 'main')"
  echo "  --health-check-path HEALTH_CHECK_PATH Path for health checks (default: '/health')"
  echo "  --num-instances NUM_INSTANCES     Number of instances to run (default: 1)"
  echo "  --render-owner-id RENDER_OWNER_ID Owner ID (required)"
  echo "  --help                            Display this help message"
}

# Function to redact sensitive fields
redact() {
  local value="$1"
  if [[ ${#value} -gt 4 ]]; then
    echo "${value:0:2}$(printf '%*s' $((${#value} - 4)) | tr ' ' '*')${value: -2}"
  else
    echo "$value"
  fi
}

# Load environment variables from .env file if it exists
if [[ -f $(dirname "$0")/../.env ]]; then
  source $(dirname "$0")/../.env
fi

# Set default values
REPO=${REPO:-"https://github.com/matthewhand/gpt-terminal-plus.git"}
BRANCH=${BRANCH:-"main"}
HEALTH_CHECK_PATH=${HEALTH_CHECK_PATH:-"/health"}
NUM_INSTANCES=${NUM_INSTANCES:-1}
OWNER_ID=${RENDER_OWNER_ID}

# Parse arguments
while [[ "$#" -gt 0 ]]; do
  case $1 in
    --api-token) API_TOKEN="$2"; shift ;;
    --debug) DEBUG="$2"; shift ;;
    --node-env) NODE_ENV="$2"; shift ;;
    --oci-compartment-id) OCI_COMPARTMENT_ID="$2"; shift ;;
    --oci-compartment-name) OCI_COMPARTMENT_NAME="$2"; shift ;;
    --render-api-key) RENDER_API_KEY="$2"; shift ;;
    --repo) REPO="$2"; shift ;;
    --branch) BRANCH="$2"; shift ;;
    --health-check-path) HEALTH_CHECK_PATH="$2"; shift ;;
    --num-instances) NUM_INSTANCES="$2"; shift ;;
    --render-owner-id) OWNER_ID="$2"; shift ;;
    --help) print_usage; exit 0 ;;
    *) echo "Unknown parameter passed: $1"; print_usage; exit 1 ;;
  esac
  shift
done

# Check if required variables are set
if [[ -z "$RENDER_API_KEY" || -z "$OWNER_ID" ]]; then
  echo "Error: --render-api-key and --render-owner-id are required."
  print_usage
  exit 1
fi

# Generate a random API token if not provided
if [[ -z "$API_TOKEN" ]]; then
  API_TOKEN=$(LC_ALL=C tr -cd 'a-zA-Z0-9' < /dev/urandom | fold -w 32 | head -n 1)
  echo "Generated API_TOKEN: $(redact "$API_TOKEN")"
fi

# API endpoint and headers
RENDER_API_URL="https://api.render.com/v1/services"
AUTH_HEADER="Authorization: Bearer $RENDER_API_KEY"
CONTENT_TYPE_HEADER="Content-Type: application/json"

# JSON payload
JSON_PAYLOAD=$(cat <<EOF
{
  "type": "web_service",
  "autoDeploy": "yes",
  "repo": "$REPO",
  "branch": "$BRANCH",
  "ownerID": "$OWNER_ID",
  "serviceDetails": {
    "name": "gpt-terminal-plus",
    "env": "docker",
    "plan": "starter",
    "dockerfilePath": "./Dockerfile",
    "dockerCommand": "npm start",
    "region": "oregon",
    "buildCommand": "",
    "healthCheckPath": "$HEALTH_CHECK_PATH",
    "numInstances": $NUM_INSTANCES,
    "envVars": [
      {"key": "NODE_ENV", "value": "$NODE_ENV"},
      {"key": "API_TOKEN", "value": "$API_TOKEN"},
      {"key": "DEBUG", "value": "$DEBUG"},
      {"key": "OCI_COMPARTMENT_ID", "value": "$OCI_COMPARTMENT_ID"},
      {"key": "OCI_COMPARTMENT_NAME", "value": "$OCI_COMPARTMENT_NAME"}
    ]
  }
}
EOF
)

# Print the redacted JSON payload for debugging
REDACTED_JSON_PAYLOAD=$(echo "$JSON_PAYLOAD" | sed \
  -e "s/$RENDER_API_KEY/$(redact "$RENDER_API_KEY")/g" \
  -e "s/$API_TOKEN/$(redact "$API_TOKEN")/g" \
  -e "s/$OWNER_ID/$(redact "$OWNER_ID")/g" \
  -e "s/$OCI_COMPARTMENT_ID/$(redact "$OCI_COMPARTMENT_ID")/g" \
  -e "s/$OCI_COMPARTMENT_NAME/$(redact "$OCI_COMPARTMENT_NAME")/g")
echo "REDACTED_JSON_PAYLOAD:"
echo "$REDACTED_JSON_PAYLOAD"

# Make the API request to create the service and capture the response
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST $RENDER_API_URL \
  -H "$AUTH_HEADER" \
  -H "$CONTENT_TYPE_HEADER" \
  -d "$JSON_PAYLOAD")

# Extract the response body and status code
RESPONSE_BODY=$(echo "$RESPONSE" | sed '$d')
STATUS_CODE=$(echo "$RESPONSE" | tail -n 1)

# Print the response body and status code for debugging
echo "RESPONSE_BODY:"
echo "$RESPONSE_BODY"
echo "STATUS_CODE: $STATUS_CODE"

# Check if the service creation was successful
if [ $STATUS_CODE -eq 200 ]; then
  echo "Service deployment initiated successfully."
  SERVICE_URL=$(echo "$RESPONSE_BODY" | grep -o '"url":"[^"]*' | grep -o '[^"]*$')
  echo "Service URL: $SERVICE_URL"
else
  echo "Service deployment failed with response code $STATUS_CODE."
fi
