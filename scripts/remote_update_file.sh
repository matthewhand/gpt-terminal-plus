#!/bin/bash

# Usage: ./remote_update_file.sh <file_path> "<pattern>" "<replacement>" [multiline=false] [backup=true]

set -euo pipefail

FILE_PATH="$1"
PATTERN="$2"
REPLACEMENT="$3"
MULTILINE="${4:-false}"
BACKUP="${5:-true}"

# Function to create backup if required
create_backup() {
  if [ "$BACKUP" = true ]; then
    if [ -f "$FILE_PATH" ]; then
      cp "$FILE_PATH" "${FILE_PATH}.bak"
      echo "Backup created at ${FILE_PATH}.bak"
    fi
  fi
}

# Create backup if necessary
create_backup

# Determine sed flags based on multiline
if [ "$MULTILINE" = true ]; then
  SED_FLAG=""
else
  SED_FLAG=""
fi

# Escape slashes in pattern and replacement
ESCAPED_PATTERN=$(printf '%s\n' "$PATTERN" | sed 's/[\/&]/\\&/g')
ESCAPED_REPLACEMENT=$(printf '%s\n' "$REPLACEMENT" | sed 's/[\/&]/\\&/g')

# Update file using sed
sed -i "${SED_FLAG}s/${ESCAPED_PATTERN}/${ESCAPED_REPLACEMENT}/g" "$FILE_PATH"

echo "File updated at $FILE_PATH"
