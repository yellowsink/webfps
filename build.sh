#!/bin/sh
rm -rf dist

npm run build:snippet
mv dist/assets/*.js dist/snippet.js
rmdir dist/assets
rm dist/index.html

npm exec tsc