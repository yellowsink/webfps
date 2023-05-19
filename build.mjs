import {build} from "esbuild";
import pluginBabel from "esbuild-plugin-babel";

/** @type import('esbuild').BuildOptions */
const commonOpts = {
	bundle: true,
	plugins: [
		pluginBabel({
			filter: /.*/,
			namespace: '',
			config: {
				presets: ["@babel/preset-typescript"],
				plugins: [
					["babel-plugin-jsx-dom-expressions", {moduleName: "dom-expressions/src/client"}]
				]
			}
		})
	]
};

await build({
	...commonOpts,
	entryPoints: ["src/index.tsx"],
	outfile: "dist/index.js",
	format: "esm",
})

await build({
	...commonOpts,
	entryPoints: ["src/snippet.ts"],
	outfile: "dist/snippet.js",
	format: "iife",
})