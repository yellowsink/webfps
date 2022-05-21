import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
});
