#!/bin/sh

NGINX_CONF="/etc/nginx/conf.d"
ROOT_DIR="/opt/aelf/app/explorer"

git pull origin master

if [ $2 == 'reinstall' ]
then
    echo 'rm -rf node_modules';
    rm -rf node_modules;
    echo 'npm install';
    npm install;
fi
#npm i && npm run build
npm run build

cp -rf dist/* $ROOT_DIR

cp -f explore.conf $NGINX_CONF

nginx -s reload
