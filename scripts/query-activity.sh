#!/bin/bash

# Query activity logs

if [ -z "$1" ]; then
  echo "Usage: $0 <pattern>"
  exit 1
fi

PATTERN=$1
ACTIVITY_DIR="data/activity"

if [ ! -d "$ACTIVITY_DIR" ]; then
  echo "Activity directory not found: $ACTIVITY_DIR"
  exit 1
fi

grep -r "$PATTERN" "$ACTIVITY_DIR"
