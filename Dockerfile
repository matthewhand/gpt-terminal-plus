# Stage 1: Build the application
FROM node:18 AS builder

# Update npm to the latest version
RUN npm install -g npm@latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies, including devDependencies
RUN npm ci

# Install TypeScript globally
RUN npm install -g typescript

# Verify TypeScript installation
RUN tsc -v || echo "tsc not found"
RUN which tsc || echo "tsc path not found"

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

# Copy only the production dependencies
COPY --from=builder /usr/src/app/package*.json ./
RUN npm ci --only=production

# Copy the built application and necessary files
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/config ./config

# Verify copied files
RUN echo "Contents of ./dist in production image:"
RUN ls -la ./dist

# Expose the port the app runs on
EXPOSE 5004

# Run your application
CMD ["npm", "start"]
