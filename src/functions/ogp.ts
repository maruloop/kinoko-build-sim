/// <reference types="@cloudflare/workers-types" />
import { ImageResponse } from 'workers-og';

export const onRequestGet: PagesFunction<{ OGP_CACHE: KVNamespace }> = async (context) => {
    const { request, env } = context;
    const url = new URL(request.url);

    const title = sanitizeTitle(url.searchParams.get('title') || 'キノコ伝説ビルドシミュレーター');
    const cacheKey = `ogp-${url.searchParams.get('title') || 'default'}`;

    const cachedResponse = await env.OGP_CACHE.get(cacheKey, 'stream');
    if (cachedResponse) {
        return new Response(cachedResponse, {
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=86400',
            }
        });
    }

    const response = new ImageResponse(generateHTML(title), {
        width: 1200,
        height: 630
    });

    const blob = await response.blob();
    await env.OGP_CACHE.put(cacheKey, blob.stream(), {
        expirationTtl: 86400,
    });

    return new Response(blob, {
        headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=86400'
        }
    });
};

function generateHTML(title: string): string {
    return `
    <html>
      <head>
        <style>
          body {
            width: 1200px;
            height: 630px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Arial', sans-serif;
            background-color: #f9f9f9;
            margin: 0;
          }
          .container {
            text-align: center;
          }
          .title {
            font-size: 64px;
            color: #333;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="title">${escapeHTML(title)}</h1>
        </div>
      </body>
    </html>
  `;
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
