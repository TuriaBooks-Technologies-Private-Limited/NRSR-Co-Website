export async function onRequestPost(context) {
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
    return new Response(JSON.stringify({ error: "Unauthorized. Cloudflare Access or Admin authentication required to modify content." }), {
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

  try {
    let { path: filePath, content, message } = await request.json();
    if (!filePath || !content) {
      return new Response(JSON.stringify({ error: "Missing path or content parameter." }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Normalize path to canonical src/data/
    let targetPath = filePath.trim();
    if (targetPath.startsWith('data/')) {
      targetPath = `src/${targetPath}`;
    } else if (!targetPath.startsWith('src/')) {
      targetPath = `src/data/${targetPath}`;
    }

    // 2. Get file SHA if it exists (so we can update/overwrite it)
    const fileUrl = `https://api.github.com/repos/${repo}/contents/${targetPath}`;
    const getRes = await fetch(fileUrl, {
      headers: {
        'Authorization': `token ${token}`,
        'User-Agent': 'Cloudflare-Pages-Worker'
      }
    });

    let sha = '';
    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha;
    }

    // 3. Commit back to GitHub
    const jsonString = JSON.stringify(content, null, 2);
    // Encode to base64 using a worker-safe method
    const bytes = new TextEncoder().encode(jsonString);
    const base64Content = btoa(String.fromCharCode(...bytes));

    const putRes = await fetch(fileUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Cloudflare-Pages-Worker'
      },
      body: JSON.stringify({
        message: message || `cms: update ${filePath}`,
        content: base64Content,
        sha: sha || undefined,
        branch: 'main'
      })
    });

    if (!putRes.ok) {
      const errText = await putRes.text();
      throw new Error(`GitHub commit failed: ${errText}`);
    }

    return new Response(JSON.stringify({ result: 'success' }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
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

// Handle OPTIONS preflight requests
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
