#!/bin/sh
rm -rf dist

npm exec tsc

npm run build:snippet
mv dist/assets/*.js tsdist/snippet.js
rm tsdist/snippet.d.ts
rm -rf dist

mv tsdist dist