FROM zenika/alpine-chrome

LABEL maintainer="Adis Durakovic <adis.durakovic@gmail.com>"
USER root

RUN apk add --no-cache --update \
     nodejs npm graphicsmagick ghostscript

WORKDIR /app

COPY package.json .
RUN npm install
COPY . .
RUN npm run build
COPY startup.sh /app
ENTRYPOINT ["sh", "startup.sh"]
