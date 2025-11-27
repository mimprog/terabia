# Build Stage
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Serve with Nginx
FROM nginx:stable-alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Use Vite's output directory
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]