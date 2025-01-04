const esbuild = require('esbuild')

esbuild.buildSync({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ['esnext']
});
