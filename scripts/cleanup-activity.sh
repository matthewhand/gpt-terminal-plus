#!/bin/bash

# Cleanup activity logs older than X days

RETENTION_DAYS=${ACTIVITY_RETENTION_DAYS:-30}
ACTIVITY_DIR="data/activity"

if [ ! -d "$ACTIVITY_DIR" ]; then
  echo "Activity directory not found: $ACTIVITY_DIR"
  exit 1
fi

find "$ACTIVITY_DIR" -mindepth 1 -maxdepth 1 -type d -mtime +$RETENTION_DAYS -exec rm -rf {} \;

echo "Activity logs older than $RETENTION_DAYS days have been deleted."
