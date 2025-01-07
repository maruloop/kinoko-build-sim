/// <reference types="@cloudflare/workers-types" />

export const onRequestGet: PagesFunction = async (context) => {
  console.log("hello debug");

  const { request, next } = context;

  const response = await next();
  const contentType = response.headers.get("Content-Type");

  if (!contentType || !contentType.includes("text/html")) {
    return response;
  }

  const html = await response.text();
  return new Response(html, {
    status: response.status,
    headers: {
      "Content-Type": "text/html",
    },
  });
};
