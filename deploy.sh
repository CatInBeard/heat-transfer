#!/bin/sh

# Deploy production script
# Triggering by main push


echo "heat-transfer" >> package.json

mkdir -p public_html
docker run --rm  -v $PWD:/usr/src/app -w /usr/src/app node:18-alpine npm install
docker run --rm -v $PWD/public_html:/usr/src/app/build -v $PWD:/usr/src/app -w /usr/src/app node:18-alpine npm run build

