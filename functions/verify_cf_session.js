export async function onRequest(context) {
  const { request } = context;
  
  // 1. Try to read from the header first (injected if the endpoint is protected by Access Policy)
  let jwt = request.headers.get('Cf-Access-Jwt-Assertion');

  // 2. If missing, read from the HttpOnly session cookie (automatically sent by the browser for same-origin requests)
  if (!jwt) {
    const cookieHeader = request.headers.get('Cookie') || '';
    const cfCookie = cookieHeader.split(';').map(c => c.trim()).find(c => c.startsWith('CF_Authorization='));
    if (cfCookie) {
      jwt = cfCookie.substring('CF_Authorization='.length);
    }
  }

  if (!jwt) {
    return new Response(JSON.stringify({ authenticated: false, error: "Missing Cloudflare Access JWT session cookie or header." }), {
      status: 401,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  try {
    const parts = jwt.split('.');
    if (parts.length === 3) {
      const payloadString = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(payloadString);
      return new Response(JSON.stringify({ 
        authenticated: true, 
        email: payload.email,
        expiry: payload.exp
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  } catch (e) {
    // Parse error fallback
  }

  return new Response(JSON.stringify({ authenticated: true }), {
    status: 200,
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cf-Access-Jwt-Assertion'
    }
  });
}
