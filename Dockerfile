# Stage 1: Build the application
FROM node:18 AS builder

# Update npm
RUN npm install -g npm@latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy the rest of your application's source code
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Stage 2: Set up the production environment
FROM node:18-slim

# Update system and install dependencies
RUN apt-get update && \
    apt-get install -y python3 python3-venv python3-pip openssh-client awscli less \
    python3-tk python3-dev scrot && \
    rm -rf /var/lib/apt/lists/*

# Create a virtual environment and install oci-cli
RUN python3 -m venv /oci-cli-venv && \
    /oci-cli-venv/bin/pip install oci-cli

# Webapp setup
RUN npm install -g npm@latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy only the necessary files from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/config ./config
COPY --from=builder /usr/src/app/package*.json ./

# Install only production dependencies
RUN npm ci

# Verify cors installation
RUN ls -l node_modules | grep cors

# Expose the port the app runs on
EXPOSE 5004

# Run your application
CMD ["npm", "run", "start:prod"]
