# Stage 1: Build the application
FROM node:18 AS builder

# Update npm to the latest version
RUN npm install -g npm@latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies, including devDependencies
RUN npm install

# Install TypeScript and ts-node globally
RUN npm install -g typescript ts-node

# Verify TypeScript and ts-node installation
RUN tsc -v || echo "tsc not found"
RUN ts-node -v || echo "ts-node not found"
RUN which tsc || echo "tsc path not found"
RUN which ts-node || echo "ts-node path not found"

# Copy the rest of your application's source code
COPY . .

# Verify application source files
RUN echo "Contents of /usr/src/app:"
RUN ls -la /usr/src/app

# Stage 2: Set up the production environment
FROM node:18-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy only the necessary files
COPY --from=builder /usr/src/app /usr/src/app

# Install production dependencies only
RUN npm ci --only=production

# Set NODE_ENV to production
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 5004

# Run your application using ts-node
CMD ["ts-node", "src/index.ts"]
