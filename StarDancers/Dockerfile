# Stage 1: Build
FROM node:18 AS build
WORKDIR /app

# Copy only package files first
COPY package*.json ./

# Install all deps (NOT just production)
# we need dev deps like vite, typescript, vue-tsc for building
RUN npm install

# Now copy the rest of the code
COPY . .

# Run the build
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
