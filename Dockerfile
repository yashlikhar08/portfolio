
#FROM nginx
#COPY . /usr/share/nginx/html/

FROM nginx
COPY . /usr/share/nginx/html
EXPOSE 80
# Command to start NGINX when the container is started
CMD ["nginx", "-g", "daemon off;"]
