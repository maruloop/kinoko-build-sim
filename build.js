require('esbuild').buildSync({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ['esnext']
});

require('esbuild').buildSync({
  entryPoints: ['src/functions/ogp.ts'],
  outdir: 'functions',
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ['esnext'],
  loader: {
    '.wasm': 'file'
  },
  format: 'esm',
  assetNames: '[name]-[hash]',
});
