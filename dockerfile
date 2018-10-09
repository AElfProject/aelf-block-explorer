FROM node:10.11-alpine

LABEL author="Long.phinome@gmail.com"
LABEL description="AELF Explore FrontEnd"

RUN mkdir -p /opt/aelf/explore

WORKDIR /opt/aelf/explore
COPY . /opt/aelf/explore/

RUN apk update \
    && apk add git \
    && cd . \
    && npm i \
    && npm run build