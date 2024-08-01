#!/bin/bash

if [ -z "$API_TOKEN" ]; then
  echo -e "\e[31;1m"
  echo "############################################################"
  echo "#                                                          #"
  echo "# WARNING: API_TOKEN is not set in the environment         #"
  echo "#                                                          #"
  echo "# Please ensure that the API_TOKEN is provided via the     #"
  echo "# Docker Compose file (.env) to avoid service disruptions. #"
  echo "#                                                          #"
  echo "############################################################"
  echo -e "\e[0m"
fi