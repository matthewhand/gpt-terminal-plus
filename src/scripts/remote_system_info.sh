#!/bin/bash
echo "{
  \"homeFolder\": \"$HOME\",
  \"type\": \"$(uname -o | tr -d '\n')\",
  \"release\": \"$(uname -r | tr -d '\n')\",
  \"platform\": \"$(uname -m | tr -d '\n')\",
  \"architecture\": \"$(lscpu | grep Architecture | awk '{print $2}' | tr -d '\n')\",
  \"totalMemory\": \"$(free -m | grep Mem: | awk '{print $2}' | tr -d '\n')\",
  \"freeMemory\": \"$(free -m | grep Mem: | awk '{print $7}' | tr -d '\n')\",
  \"uptime\": \"$(awk '{print $1}' /proc/uptime | tr -d '\n')\",
  \"currentFolder\": \"$(pwd | tr -d '\n')\"
}"

