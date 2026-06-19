# --- Build Stage ---
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency configs
COPY package*.json ./

# Install dependencies using legacy-peer-deps to avoid React 19 package mismatches
RUN npm ci --legacy-peer-deps

# Copy app source files
COPY . .

# Build application bundle
RUN npm run build

# --- Production Stage ---
FROM nginx:stable-alpine

# Copy built bundles from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx routing config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
