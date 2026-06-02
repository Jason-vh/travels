FROM nginx:alpine
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY cinque-terre/ /usr/share/nginx/html/cinque-terre/
COPY algarve/ /usr/share/nginx/html/algarve/
