import {build} from "esbuild";
import pluginBabel from "esbuild-plugin-babel";

/** @type import('esbuild').BuildOptions */
const commonOpts = { bundle: true };

await build({
	...commonOpts,
	entryPoints: ["src/index.tsx"],
	outfile: "dist/index.js",
	format: "esm"
})

await build({
	...commonOpts,
	entryPoints: ["src/snippet.ts"],
	outfile: "dist/snippet.js",
	format: "iife",
})