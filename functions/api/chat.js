// Cloudflare Pages Function replicating server.py's /api/chat LLM proxy.
// The browser sends X-LLM-API-Key / X-LLM-Auth-Style pseudo-headers; this
// translates them into real provider auth headers and forwards the body.
export async function onRequestPost({ request }) {
  const target = new URL(request.url).searchParams.get("target");
  let targetUrl;
  try {
    targetUrl = new URL(target);
  } catch {
    return new Response("Missing or invalid ?target= URL", { status: 400 });
  }
  if (targetUrl.protocol !== "https:" ||
      ["127.0.0.1", "localhost", "::1", "[::1]"].includes(targetUrl.hostname)) {
    return new Response("Target must be a public https endpoint", { status: 400 });
  }

  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
  };
  const apiKey = request.headers.get("X-LLM-API-Key");
  const authStyle = (request.headers.get("X-LLM-Auth-Style") || "").toLowerCase();
  if (authStyle === "anthropic") {
    headers["anthropic-version"] = "2023-06-01";
    if (apiKey) headers["x-api-key"] = apiKey;
  } else if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  let upstream;
  try {
    upstream = await fetch(targetUrl, {
      method: "POST",
      headers,
      body: request.body
    });
  } catch (error) {
    return new Response(`Could not reach ${targetUrl.hostname}: ${error.message}`, { status: 502 });
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") || "application/json"
    }
  });
}
