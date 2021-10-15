#!/bin/bash
source .env

ENVIRONMENT="$NODE_ENV"

if [ "$ENVIRONMENT" != "production" ] && [ "$ENVIRONMENT" != "staging" ]; then
    echo "improper .env NODE_ENV"
    exit
fi

npm run build || exit

pm2 delete image-compression-service-"$ENVIRONMENT"

pm2 start "npm run start:prod" --name image-compression-service-"$ENVIRONMENT" --log-date-format 'DD-MM HH:mm:ss.SSS'

pm2 logs

