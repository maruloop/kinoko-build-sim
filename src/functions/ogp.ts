/// <reference types="@cloudflare/workers-types" />
import { Resvg, initWasm } from '@resvg/resvg-wasm';
import resvgWasm from '../../dist/index_bg.wasm';
const genModuleInit = () => {
  let isInit = false;
  return async () => {
    if (isInit) {
      return;
    }

    await initWasm(resvgWasm);
    isInit = true;
  };
};
const moduleInit = genModuleInit();

export const onRequestGet: PagesFunction = async (context) => {
    const { request } = context;
    const url = new URL(request.url);
    const title = sanitizeTitle(url.searchParams.get('title') || 'キノコ伝説ビルドシミュレーター');
    await moduleInit();
    const resvg = new Resvg(generateSVG(title));

    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    return new Response(pngBuffer, {
        headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=86400',
        }
    });
};

function generateSVG(title: string): string {
    return `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f9f9f9"/>
      <text x="50%" y="50%" font-family="Arial" font-size="64" fill="#333" text-anchor="middle">${escapeHTML(title)}</text>
    </svg>`;
}

function sanitizeTitle(title: string): string {
    return title.length > 25 ? title.slice(0, 25) + '…' : title;
}

function escapeHTML(str: string): string {
    return str.replace(/[&<>"']/g, (match) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[match] || match));
}