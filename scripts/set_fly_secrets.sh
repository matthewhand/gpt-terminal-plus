#!/bin/bash

# Path to your .env file
ENV_FILE=".env"

# Read each line in .env file
while IFS= read -r line || [ -n "$line" ]; do
  # Skip empty lines and comments
  if [[ -n "$line" && ! "$line" =~ ^# ]]; then
    # Export the variable
    export $line
    # Get the variable name
    var_name=$(echo "$line" | cut -d '=' -f 1)
    # Set the secret in Fly.io
    flyctl secrets set "$line"
  fi
done < "$ENV_FILE"

