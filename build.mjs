import {build} from "esbuild";

/** @type import('esbuild').BuildOptions */
const commonOpts = { bundle: true };

await build({
	...commonOpts,
	entryPoints: ["src/index.ts"],
	outfile: "dist/index.js",
	format: "esm"
})

await build({
	...commonOpts,
	entryPoints: ["src/snippet.ts"],
	outfile: "dist/snippet.js",
	format: "iife",
})