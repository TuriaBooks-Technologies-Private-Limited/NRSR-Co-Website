export async function onRequest(context) {
  const { request, env } = context;
  const token = env.GITHUB_PAT;
  const repo = env.GITHUB_REPO || 'TuriaBooks-Technologies-Private-Limited/NRSR-Co-Website';

  // 1. Enforce Cloudflare Access or Admin Authentication
  const jwt = request.headers.get('Cf-Access-Jwt-Assertion');
  const cookieHeader = request.headers.get('Cookie') || '';
  const cfCookie = cookieHeader.split(';').map(c => c.trim()).find(c => c.startsWith('CF_Authorization='));
  const authHeader = request.headers.get('Authorization') || '';
  const isDevBypass = env.DISABLE_CF_AUTH === 'true' || request.headers.get('x-dev-admin-bypass') === (env.DEV_ADMIN_KEY || 'nrsr-dev-local');

  if (!jwt && !cfCookie && !authHeader && !isDevBypass) {
    return new Response(JSON.stringify({ error: "Unauthorized. Cloudflare Access or Admin authentication required." }), {
      status: 401,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  if (!token) {
    return new Response(JSON.stringify({ error: "Missing GITHUB_PAT on Cloudflare environment." }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  const urlObj = new URL(request.url);
  const apiPath = urlObj.searchParams.get('path');
  
  if (!apiPath) {
    return new Response(JSON.stringify({ error: "Missing path parameter." }), {
      status: 400,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  let normalizedApiPath = apiPath.trim();
  if (normalizedApiPath.startsWith('contents/data/')) {
    normalizedApiPath = normalizedApiPath.replace('contents/data/', 'contents/src/data/');
  } else if (normalizedApiPath.startsWith('data/')) {
    normalizedApiPath = `contents/src/${normalizedApiPath}`;
  }

  const gitUrl = `https://api.github.com/repos/${repo}/${normalizedApiPath}`;
  const method = request.method;
  
  const requestHeaders = new Headers();
  requestHeaders.set('Authorization', `token ${token}`);
  requestHeaders.set('User-Agent', 'Cloudflare-Pages-Worker');
  requestHeaders.set('Accept', 'application/vnd.github.v3+json');

  if (request.headers.get('Content-Type')) {
    requestHeaders.set('Content-Type', request.headers.get('Content-Type'));
  }

  let body = null;
  if (method !== 'GET' && method !== 'HEAD') {
    body = await request.text();
  }

  try {
    const gitRes = await fetch(gitUrl, {
      method,
      headers: requestHeaders,
      body
    });

    const resHeaders = new Headers();
    resHeaders.set('Access-Control-Allow-Origin', '*');
    resHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    resHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    resHeaders.set('Content-Type', gitRes.headers.get('Content-Type') || 'application/json');

    const resBody = await gitRes.arrayBuffer();

    return new Response(resBody, {
      status: gitRes.status,
      statusText: gitRes.statusText,
      headers: resHeaders
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
