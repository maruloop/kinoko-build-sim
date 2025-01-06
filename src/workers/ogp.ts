/// <reference types="@cloudflare/workers-types" />

import satori, { init as initSatori } from 'satori/wasm';
import initYoga from 'yoga-wasm-web';
import { Resvg, initWasm } from '@resvg/resvg-wasm';
import { loadGoogleFont } from './fonts';

import resvgWasm from '@resvg/resvg-wasm/index_bg.wasm';
import yogaWasm from 'yoga-wasm-web/dist/yoga.wasm';

let isWasmInitialized = false;
const cache = caches.default;

const initResvgWasm = async () => {
  if (isWasmInitialized) return;

  try {
    const yoga = await initYoga(yogaWasm);
    initSatori(yoga);
    await initWasm(resvgWasm as WebAssembly.Module);
    isWasmInitialized = true;
    console.log('✅ WASM Loaded Successfully');
  } catch (err) {
    console.error('❌ WASM Load Error:', err);
    throw err;
  }
};

export default {
  async fetch(
    request: Request,
    env: Record<string, any>,
    ctx: ExecutionContext
  ): Promise<Response> {
    const cacheKey = new Request(request.url, request);
    const cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }

    const title = new URL(request.url).searchParams.get('title') || 'キノコ伝説ビルドシミュレーター';

    try {
      await initResvgWasm();

      const svg = await generateSVG(title);
      console.log(svg);
      const png = (new Resvg(svg)).render().asPng();

      const response = new Response(png, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400',
          'CF-Cache-Status': 'BYPASS',
        },
      });

      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    } catch (err) {
      console.error('❌ Rendering Error:', err);
      return new Response('Failed to generate OGP image', {
        status: 500,
      });
    }
  },
};

async function generateSVG(title: string): Promise<string> {
  const notoSans = await loadGoogleFont({
    family: 'Noto Sans JP',
    weight: 100,
  });

  try {
    const svg = await satori(
      {
        type: 'div',
        props: {
          style: {
            width: '1200px',
            height: '630px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f9f9f9',
            fontFamily: 'NotoSansJP, sans-serif',
          },
          children: [
            {
              type: 'span',
              props: {
                style: {
                  fontSize: '64px',
                  fontWeight: 700,
                  color: '#333',
                },
                children: title,
              },
            },
          ],
        },
      }, {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'NotoSansJP',
          data: notoSans,
          weight: 100,
          style: 'normal',
        },
      ],
    });

    return svg;
  } catch (err) {
    console.error('❌ Rendering JSX to SVG Error:', err);
    throw err;
  }
}
