#!/bin/sh
rm -rf dist

npm exec tsc

npm run build:snippet
echo "(()=>{" > tsdist/snippet.js
cat dist/assets/*.js >> tsdist/snippet.js
echo "})()" >> tsdist/snippet.js
rm tsdist/snippet.d.ts
rm -rf dist

mv tsdist dist