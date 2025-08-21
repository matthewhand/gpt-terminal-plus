#!/bin/bash
set -e
URL="http://localhost:5004/openapi.json"
echo "Fetching OpenAPI spec from $URL..."
curl -s $URL | jq '.paths | keys' 
