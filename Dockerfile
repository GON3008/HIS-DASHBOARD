# Multi-stage Dockerfile for Vite React SPA

# === Build stage ===
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# === Runtime stage ===
FROM nginx:alpine

# SPA-friendly nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose container port 80 (we'll map host:8005 -> container:80)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
