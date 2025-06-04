# Use official Node.js image
FROM node:20

# Set working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json first for better caching
COPY package*.json ./
COPY ./backend/package*.json ./backend/
COPY ./frontend/package*.json ./frontend/

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose the port your app runs on (optional)
ENV port=4000

EXPOSE 4000

# Start the application
CMD ["npm", "start"]
