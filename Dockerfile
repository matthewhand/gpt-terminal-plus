# Stage 1: Build the application
# Use an official Node.js runtime as a parent image
FROM node:18 AS builder

# Update npm
RUN npm install -g npm@latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# After npm install, attempt to fix vulnerabilities
RUN npm audit fix

# Copy the rest of your application's source code
COPY . .

# No build command is specified; include if necessary
# RUN npm run build

# Stage 2: Set up the production environment
# Use a smaller base image
FROM node:18-slim

# Update system and install dependencies
# Includes Python, pip, SSH client, AWS CLI, less, and required libraries for pyautogui
RUN apt-get update && \
    apt-get install -y python3 python3-venv python3-pip openssh-client awscli less \
    python3-tk python3-dev scrot && \
    rm -rf /var/lib/apt/lists/*

# Create a virtual environment and install oci-cli and pyautogui
#RUN python3 -m venv /oci-cli-venv && \
#    /oci-cli-venv/bin/pip install oci-cli pyautogui
RUN python3 -m venv /oci-cli-venv && \
    /oci-cli-venv/bin/pip install oci-cli

# Webapp setup
# Update npm
RUN npm install -g npm@latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy only the necessary files from the builder stage
COPY --from=builder /usr/src/app ./

# Expose the port the app runs on
EXPOSE 5004

# Run your application
CMD ["npm", "start"]
#CMD ["npx", "ts-node", "src/index.ts"]
