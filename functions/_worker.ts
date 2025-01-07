/// <reference types="@cloudflare/workers-types" />

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
  const title = url.searchParams.get("title") || "キノコ伝説ビルドシミュレーター";
  const date = new Date().toISOString().split('T')[0];

  const html = await response.text();
  const modifiedHtml = html.replace(
    /<meta property="og:title" content=".*?">/,
    `<meta property="og:title" content="${escapeHTML(title)}">`
  ).replace(
    /<meta property="og:image" content=".*?">/,
    `<meta property="og:image" content="https://ogp-kino-simu.marumaru-niconico.workers.dev/?title=${encodeURIComponent(escapeHTML(title))}&date=${date}">`
  );

  return new Response(modifiedHtml, {
    status: response.status,
    headers: {
      "Content-Type": "text/html",
    },
  });
};
