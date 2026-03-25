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
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy built site
# Copy built site
COPY --from=build /app/dist /usr/share/nginx/html

# Ensure sitemap and robots are available at the site root
COPY sitemap.xml /usr/share/nginx/html/sitemap.xml
COPY robots.txt /usr/share/nginx/html/robots.txt
 
# Copy logo assets so favicons and manifest are available at /assets/logo/
COPY assets/logo /usr/share/nginx/html/assets/logo

# Also copy a root favicon so crawlers and browsers can find it at /favicon.ico
COPY assets/logo/favicon.ico /usr/share/nginx/html/favicon.ico
COPY assets/logo/favicon.svg /usr/share/nginx/html/favicon.svg

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]