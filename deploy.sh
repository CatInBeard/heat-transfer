#!/bin/sh

# Deploy production script
# Triggering by main push

mkdir -p public_html
docker run --rm  -v $PWD:/usr/src/app -w /usr/src/app node:18-alpine npm run build
cp build/* public_html
