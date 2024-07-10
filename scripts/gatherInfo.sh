#!/bin/bash
# Output system information in JSON format directly
echo "{
  \"homeFolder\": \"$HOME\",
  \"type\": \"$(uname -o)\",
  \"release\": \"$(uname -r)\",
  \"platform\": \"$(uname -m)\",
  \"architecture\": \"$(uname -i)\",
  \"totalMemory\": $(grep MemTotal /proc/meminfo | awk '{print $2}'),
  \"freeMemory\": $(grep MemFree /proc/meminfo | awk '{print $2}'),
  \"uptime\": $(awk '{print $1}' /proc/uptime),
  \"currentFolder\": \"$(pwd)\"
}"
