#!/bin/sh

# Deploy production script
# Triggering by main push


repositoryOwner=$(jq -r '.repository.owner.name' "$GITHUB_EVENT_PATH")
repository=$(jq -r '.repository.name' "$GITHUB_EVENT_PATH")

echo "https://$repositoryOwner.github.io/$repository/" >> package.json

mkdir -p public_html
docker run --rm  -v $PWD:/usr/src/app -w /usr/src/app node:18-alpine npm install
docker run --rm -v $PWD/public_html:/usr/src/app/build -v $PWD:/usr/src/app -w /usr/src/app node:18-alpine npm run build

