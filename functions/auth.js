export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const host = url.host;
  const protocol = request.headers.get('x-forwarded-proto') || (url.protocol === 'https:' ? 'https' : 'http');

  const client_id = env.GITHUB_CLIENT_ID;
  if (!client_id) {
    return new Response(JSON.stringify({ error: "Missing GITHUB_CLIENT_ID environment variable on Cloudflare." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const redirectUri = `${protocol}://${host}/callback`;
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=repo&redirect_uri=${encodeURIComponent(redirectUri)}&state=nrsrco`;

  return new Response(null, {
    status: 302,
    headers: {
      'Location': githubAuthUrl,
      'Cache-Control': 'no-cache'
    }
  });
}
