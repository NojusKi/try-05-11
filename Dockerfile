# Use the official Node.js image as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Copy the server build output from dist/server
COPY dist/server ./dist/server

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables
ENV DB_HOST=${DB_HOST}

# Start the application
CMD ["npm", "start"]
