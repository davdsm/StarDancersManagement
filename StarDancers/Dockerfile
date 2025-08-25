# Stage 1: Build
FROM node:18 AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build Vue app
RUN npm run build

# Stage 2: Run with a static server
FROM node:18-alpine
WORKDIR /app

# Install a tiny static file server
RUN npm install -g serve

# Copy build output
COPY --from=build /app/dist ./dist

EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080"]
