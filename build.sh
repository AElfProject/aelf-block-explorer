#!/bin/bash

cat << EOT
            _    _____ _  __       _____            _
           / \  | ____| |/ _|     | ____|_  ___ __ | | ___  _ __ ___ _ __
          / _ \ |  _| | | |_ _____|  _| \ \/ / '_ \| |/ _ \| '__/ _ \ '__|
         / ___ \| |___| |  _|_____| |___ >  <| |_) | | (_) | | |  __/ |
        /_/   \_\_____|_|_|       |_____/_/\_\ .__/|_|\___/|_|  \___|_|
                                             |_|

EOT

NGINX_CONF="/etc/nginx/conf.d"
ROOT_DIR="/opt/aelf/app/explorer"

#当变量a为null或为空字符串时则var=b
start_mode=${1:-"production"}
node_modules_action=${2:-"default"}
nginx_action=${3:-"default"}
echo ${node_modules_action} ${start_mode}

git pull && echo "git pull done"

if [ ${node_modules_action} = "reinstall" ]
then
    echo "npm install"
    npm install && echo "install done"
    sleep 3
    npm install && echo "install check done"
    sleep 3
fi

if [ ${start_mode} = "dev" ]
then
    npm start
    echo "npm start"
else
    #npm i && npm run build
    npm run build
    cp -rf dist/* $ROOT_DIR
    echo "npm run build"
fi

if [ ${nginx_action} = "reload" ]
then
    cp -f explore.conf $NGINX_CONF
    nginx -s reload
    echo "nginx -s reload"
fi
