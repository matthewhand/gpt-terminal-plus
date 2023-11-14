# Use an official Node.js runtime as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) into the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of your application's source code
COPY . .

# Expose port 5004 to the outside once the container has launched
EXPOSE 5004

# Define the command to run your app using CMD which defines your runtime
CMD ["npm", "start"]
