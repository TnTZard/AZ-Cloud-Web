FROM nginx:1.14.2
MAINTAINER andy 562966183@qq.com

COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/ /etc/nginx/html
