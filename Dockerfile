FROM node:22-alpine AS south-africa
WORKDIR /build
COPY south-africa/ .
RUN node build.mjs

FROM nginx:alpine
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY cinque-terre/ /usr/share/nginx/html/cinque-terre/
COPY algarve/ /usr/share/nginx/html/algarve/
COPY --from=south-africa /build/dist/ /usr/share/nginx/html/south-africa/
