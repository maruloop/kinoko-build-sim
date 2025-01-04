/// <reference types="@cloudflare/workers-types" />
import { Resvg, initWasm } from '@resvg/resvg-wasm';

async function loadWasm() {
  const wasmModule = await fetch('/index_bg.wasm');
  const wasmBuffer = await wasmModule.arrayBuffer();
  await initWasm(wasmBuffer);
}

export const onRequestGet: PagesFunction = async () => {
  await loadWasm();

  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f9f9f9"/>
      <text x="50%" y="50%" font-size="64" text-anchor="middle" fill="#333">Dynamic OGP</text>
    </svg>
  `;

  const resvg = new Resvg(svg);
  const png = resvg.render().asPng();

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400'
    }
  });
};
