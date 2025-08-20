#!/bin/bash

# Function to get system information safely
get_info() {
  local value=$(eval $1 2>/dev/null)
  echo -n "\"${value:-N/A}\""  # Returns "N/A" if the command fails
}

# Building JSON output with error handling
echo "{"
echo "  \"homeFolder\": \"$HOME\","
echo "  \"type\": $(get_info "uname -o | tr -d '\n'"),"
echo "  \"release\": $(get_info "uname -r | tr -d '\n'"),"
echo "  \"platform\": $(get_info "uname -m | tr -d '\n'"),"
echo "  \"architecture\": $(get_info "lscpu | grep Architecture | awk '{print \$2}' | tr -d '\n'"),"
echo "  \"totalMemory\": $(get_info "free -m | grep Mem: | awk '{print \$2}' | tr -d '\n'"),"
echo "  \"freeMemory\": $(get_info "free -m | grep Mem: | awk '{print \$7}' | tr -d '\n'"),"
echo "  \"uptime\": $(get_info "awk '{print \$1}' /proc/uptime | tr -d '\n'"),"
echo "  \"currentFolder\": $(get_info "pwd | tr -d '\n'")"
echo "}"

