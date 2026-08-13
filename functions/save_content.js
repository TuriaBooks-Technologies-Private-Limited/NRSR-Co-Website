export async function onRequestPost(context) {
  const { request, env } = context;
  const token = env.GITHUB_PAT;
  const repo = env.GITHUB_REPO || 'NRSR_Coc/NRSR_Co-website';

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
    const { path: filePath, content, message } = await request.json();
    if (!filePath || !content) {
      return new Response(JSON.stringify({ error: "Missing path or content parameter." }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 1. Get file SHA if it exists (so we can update/overwrite it)
    const fileUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;
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

    // 2. Commit back to GitHub
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
        branch: 'Main'
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
