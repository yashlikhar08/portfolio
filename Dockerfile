# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --include=dev

COPY . .

RUN npm run build


# Production stage
FROM nginx:stable-alpine

# Copy custom nginx config to enable SPA fallback (try_files -> index.html)
# COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy built site
# Copy built site
COPY --from=build /app/dist /usr/share/nginx/html

# Ensure sitemap and robots are available at the site root
COPY sitemap.xml /usr/share/nginx/html/sitemap.xml
COPY robots.txt /usr/share/nginx/html/robots.txt
COPY google3c5a6b41c8407f8a.html /usr/share/nginx/html/robots.txt

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]