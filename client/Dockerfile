# Use an official Node runtime for building the application
FROM node:18 AS build

# Set the working directory in the container
WORKDIR /

# Copy package.json and package-lock.json
COPY package*.json ./
# COPY .env.local ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
# COPY app ./
# COPY next.config.mjs ./
# COPY tsconfig.json ./
# COPY postcss.config.js ./
# COPY tailwind.config.ts ./

COPY . .

# Build the Next.js app
# RUN npm run build

# Expose the port your Next.js app runs on
EXPOSE 3000

# Run the Next.js app
CMD npm run dev