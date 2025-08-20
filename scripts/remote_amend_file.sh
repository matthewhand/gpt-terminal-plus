#!/bin/bash

# Usage: ./remote_amend_file.sh <file_path> "<content>" [backup=true]

set -euo pipefail

FILE_PATH="$1"
CONTENT="$2"
BACKUP="${3:-true}"

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

# Append content to the file using cat << 'EOF' >>
cat << 'EOC' >> "$FILE_PATH"
$CONTENT
EOC

echo "Content appended to $FILE_PATH"
