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

# Copy the rest of your application's source code
COPY . .

# Build your application if necessary
# RUN npm run build

# Stage 2: Set up the production environment
# Use a smaller base image
FROM node:18-slim

# Update npm
RUN npm install -g npm@latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy only the necessary files from the builder stage
COPY --from=builder /usr/src/app ./

# Expose the port the app runs on
EXPOSE 5004

# Run your application
#CMD ["npm", "start"]
CMD ["npx", "ts-node", "src/index.ts"].
