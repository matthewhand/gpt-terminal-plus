#!/bin/bash

# ecs-deploy.sh
# A script to deploy a Docker application to AWS ECS using Fargate

# Enable debugging
set -ex

# Default values for variables
CLUSTER_NAME="gpt-terminal-plus-cluster"
SERVICE_NAME="gpt-terminal-plus-service"
TASK_DEFINITION_NAME="gpt-terminal-plus-task"
CONTAINER_NAME="gpt-terminal-plus-container"
DOCKER_IMAGE="mhand79/gpt-terminal-plus:latest"
AWS_REGION="us-west-2"
MEMORY="256"
CPU="256"

# Function to display usage
usage() {
    echo "Usage: $0 -s <subnet-id> -g <security-group-id> [-c <cluster-name>] [-v <service-name>] [-t <task-definition-name>] [-n <container-name>] [-i <docker-image>] [-r <aws-region>] [-m <memory>] [-p <cpu>]"
    echo "  -s  Subnet ID (required)"
    echo "  -g  Security Group ID (required)"
    echo "  -c  ECS Cluster Name (default: $CLUSTER_NAME)"
    echo "  -v  ECS Service Name (default: $SERVICE_NAME)"
    echo "  -t  ECS Task Definition Name (default: $TASK_DEFINITION_NAME)"
    echo "  -n  ECS Container Name (default: $CONTAINER_NAME)"
    echo "  -i  Docker Image (default: $DOCKER_IMAGE)"
    echo "  -r  AWS Region (default: $AWS_REGION)"
    echo "  -m  Memory (default: $MEMORY)"
    echo "  -p  CPU (default: $CPU)"
    exit 1
}

# Parse arguments
while getopts "s:g:c:v:t:n:i:r:m:p:h" opt; do
    case ${opt} in
        s) SUBNET_ID=${OPTARG} ;;
        g) SECURITY_GROUP_ID=${OPTARG} ;;
        c) CLUSTER_NAME=${OPTARG} ;;
        v) SERVICE_NAME=${OPTARG} ;;
        t) TASK_DEFINITION_NAME=${OPTARG} ;;
        n) CONTAINER_NAME=${OPTARG} ;;
        i) DOCKER_IMAGE=${OPTARG} ;;
        r) AWS_REGION=${OPTARG} ;;
        m) MEMORY=${OPTARG} ;;
        p) CPU=${OPTARG} ;;
        h) usage ;;
        *) usage ;;
    esac
done

# Check for required arguments
if [ -z "${SUBNET_ID}" ] || [ -z "${SECURITY_GROUP_ID}" ]; then
    echo "Error: Subnet ID and Security Group ID are required."
    usage
fi

# Create ECS cluster
aws ecs create-cluster --cluster-name $CLUSTER_NAME --region $AWS_REGION

# Register task definition
cat << EOF > task-definition.json
{
  "family": "$TASK_DEFINITION_NAME",
  "networkMode": "awsvpc",
  "containerDefinitions": [
    {
      "name": "$CONTAINER_NAME",
      "image": "$DOCKER_IMAGE",
      "memory": $MEMORY,
      "cpu": $CPU,
      "essential": true,
      "portMappings": [
        {
          "containerPort": 80,
          "hostPort": 80
        }
      ]
    }
  ],
  "requiresCompatibilities": [
    "FARGATE"
  ],
  "cpu": "$CPU",
  "memory": "$MEMORY"
}
