/// <reference types="@cloudflare/workers-types" />
import LZString from 'lz-string';

function escapeHTML(str: string): string {
  return str.replace(/[&<>"']/g, (match) => {
    const escapeMap: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return escapeMap[match] || match;
  });
}

export const onRequest: PagesFunction = async (context) => {
  const { request, next } = context;

  const response = await next();
  const contentType = response.headers.get("Content-Type");

  if (!contentType || !contentType.includes("text/html")) {
    return response;
  }

  const url = new URL(request.url);
  const title = url.searchParams.get("title") || "(非公式)キノコ伝説ビルドシミュレーター";
  const description = LZString.decompressFromEncodedURIComponent(url.searchParams.get("description") || '') || "ビルドを作って共有しよう！"
  const date = new Date().toISOString().split('T')[0];

  const html = await response.text();
  const modifiedHtml = html.replace(
    /<meta property="og:title" content=".*?">/,
    `<meta property="og:title" content="${escapeHTML(title)} - (非公式)キノコ伝説ビルドシミュレーター">`
  ).replace(
    /<meta property="og:description" content=".*?">/,
    `<meta property="og:description" content="${escapeHTML(description)}">`
  ).replace(
    /<meta property="og:image" content=".*?">/,
    `<meta property="og:image" content="https://ogp-kino-simu.marumaru-niconico.workers.dev/?title=${encodeURIComponent(escapeHTML(title))}&date=${date}">`
  ).replace(
    /<meta property="twitter:title" content=".*?">/,
    `<meta property="twitter:title" content="${escapeHTML(title)} - (非公式)キノコ伝説ビルドシミュレーター">`
  ).replace(
    /<meta property="twitter:description" content=".*?">/,
    `<meta property="twitter:description" content="${escapeHTML(description)}">`
  ).replace(
    /<meta property="twitter:image" content=".*?">/,
    `<meta property="twitter:image" content="https://ogp-kino-simu.marumaru-niconico.workers.dev/?title=${encodeURIComponent(escapeHTML(title))}&date=${date}">`
  );

  return new Response(modifiedHtml, {
    status: response.status,
    headers: {
      "Content-Type": "text/html",
    },
  });
};
