# Stage 1: Build the application
FROM node:18 AS builder

# Update npm
RUN npm install -g npm@latest

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Install TypeScript globally (if not already installed)
RUN npm install -g typescript

# Copy the rest of your application's source code
COPY . .

# Build the application
RUN npm run build

# Verify build output
RUN echo "Contents of ./dist after build:"
RUN ls -la ./dist

# Stage 2: Set up the production environment
FROM node:18-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY --from=builder /usr/src/app/package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy built application
COPY --from=builder /usr/src/app/dist ./dist

# Verify copied files
RUN echo "Contents of ./dist in production image:"
RUN ls -la ./dist

# Expose the port the app runs on
EXPOSE 5004

# Run your application
CMD ["npm", "start"]

