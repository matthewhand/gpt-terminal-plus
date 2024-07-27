# Stage 1: Build Stage
FROM node:18 AS builder

# Set NODE_ENV to development to install dev dependencies
ENV NODE_ENV=development

# Install the latest version of npm globally
RUN npm install -g npm@latest

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies, including dev dependencies
RUN npm install

# Install TypeScript globally
RUN npm install -g typescript

# Verify tsc installation and version
RUN tsc -v || echo "tsc not found"
RUN which tsc || echo "tsc path not found"

# Copy the rest of the application code
COPY . .

# Compile TypeScript files and capture output in a log file
RUN tsc > tsc_output.log 2>&1 || { echo 'TypeScript compilation failed'; cat tsc_output.log; exit 1; }

# Print the contents of /usr/src/app/dist after compilation
RUN echo "Contents of /usr/src/app/dist after compilation:"
RUN ls -latr /usr/src/app/dist

# Stage 2: Production Stage
FROM node:18-slim

# Set NODE_ENV to production
ENV NODE_ENV=production
ENV SUPPRESS_NO_CONFIG_WARNING=true

# Set the working directory
WORKDIR /usr/src/app

# Copy only the compiled JavaScript files and production dependencies from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./

# Copy configuration files
COPY --from=builder /usr/src/app/config ./config

# Print the contents of /usr/src/app/dist after copying from builder
RUN echo "Contents of /usr/src/app/dist in production stage:"
RUN ls -latr /usr/src/app/dist

# Install only production dependencies
RUN npm install --only=production

# Expose the necessary port
EXPOSE 5004

# Run the application
CMD ["node", "dist/index.js"]
