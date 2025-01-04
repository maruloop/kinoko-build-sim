const esbuild = require('esbuild')

esbuild.buildSync({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ['esnext']
});

esbuild.buildSync({
  entryPoints: ['src/functions/ogp.ts'],
  outdir: 'functions',
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ['esnext'],
  format: 'esm',
  loader: {
    '.wasm': 'file'
  },
  assetNames: '[name]-[hash]',
});
