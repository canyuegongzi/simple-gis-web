FROM nginx:1.15.0
MAINTAINER canyuegongzi
EXPOSE 8045
COPY ./dist  /usr/share/nginx/html/simple-gis-web/
