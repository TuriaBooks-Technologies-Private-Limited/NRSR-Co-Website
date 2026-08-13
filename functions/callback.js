export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const host = url.host;
  const protocol = request.headers.get('x-forwarded-proto') || (url.protocol === 'https:' ? 'https' : 'http');

  const client_id = env.GITHUB_CLIENT_ID;
  const client_secret = env.GITHUB_CLIENT_SECRET;

  if (!client_id || !client_secret) {
    return new Response(JSON.stringify({ error: "Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET environment variables." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!code) {
    return new Response(JSON.stringify({ error: "Missing authorization code from GitHub callback." }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const redirectUri = `${protocol}://${host}/callback`;
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Cloudflare-Pages-Worker'
      },
      body: JSON.stringify({
        client_id,
        client_secret,
        code,
        redirect_uri: redirectUri
      })
    });

    const data = await response.json();
    if (data.error) {
      return new Response(JSON.stringify({ error: data.error_description || data.error }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <title>Authenticating...</title>
        <script>
          const token = "${data.access_token}";
          if (token) {
            window.opener.postMessage(
              JSON.stringify({ 
                source: "github-oauth", 
                status: "success", 
                token: token 
              }), 
              window.location.origin
            );
            window.close();
          } else {
            document.body.innerHTML = "<h3>Authentication failed. Token not found.</h3>";
          }
        </script>
      </head>
      <body>
        <p style="font-family: sans-serif; text-align: center; margin-top: 50px; color: #555;">
          Connecting to GitHub... You can close this window if it doesn't close automatically.
        </p>
      </body>
      </html>
    `;

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to exchange token: " + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
