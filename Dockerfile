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
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]