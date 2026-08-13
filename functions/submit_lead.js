export async function onRequestPost(context) {
  const { request, env } = context;
  const token = env.GITHUB_PAT;
  if (!token) {
    return new Response(JSON.stringify({ error: "Missing GITHUB_PAT environment variable on Cloudflare. Please configure it." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const leadData = await request.json();
    const timestamp = Date.now();
    const filename = `lead-${timestamp}.json`;

    const repo = env.GITHUB_REPO || 'NRSR_Coc/NRSR_Co-website';

    // 1. Fetch ERP settings from data/settings.json in repository
    const settingsUrl = `https://api.github.com/repos/${repo}/contents/data/settings.json`;
    const settingsRes = await fetch(settingsUrl, {
      headers: { 
        'Authorization': `token ${token}`,
        'User-Agent': 'Cloudflare-Pages-Worker'
      }
    });
    
    let erpUrl = '';
    let erpKey = '';
    let googleScriptUrl = '';
    let notificationEmails = '';
    if (settingsRes.ok) {
      const settingsFile = await settingsRes.json();
      
      // Decode base64 using Web Worker API compatibility
      const binaryString = atob(settingsFile.content.replace(/\s/g, ''));
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const decoder = new TextDecoder('utf-8');
      const contentString = decoder.decode(bytes);
      
      const config = JSON.parse(contentString);
      erpUrl = config.settings?.erp_api_url || '';
      erpKey = config.settings?.erp_api_key || '';
      googleScriptUrl = config.settings?.google_script_url || '';
      notificationEmails = config.settings?.notification_emails || '';
    }

    // 2. Commit lead to GitHub repository under data/leads/
    const leadUrl = `https://api.github.com/repos/${repo}/contents/data/leads/${filename}`;
    const fileContent = JSON.stringify(leadData, null, 2);
    
    // Encode base64 using Web Worker API compatibility
    const encoder = new TextEncoder();
    const u8 = encoder.encode(fileContent);
    let binary = "";
    for (let i = 0; i < u8.byteLength; i++) {
      binary += String.fromCharCode(u8[i]);
    }
    const base64Content = btoa(binary);

    const gitRes = await fetch(leadUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Cloudflare-Pages-Worker'
      },
      body: JSON.stringify({
        message: `lead: add contact inquiry from ${leadData.name}`,
        content: base64Content,
        branch: 'Main'
      })
    });

    if (!gitRes.ok) {
      const errText = await gitRes.text();
      throw new Error(`Failed to save lead in GitHub: ${errText}`);
    }

    // 3. Post to ERP if configured
    let erpSyncStatus = 'disabled';
    if (erpUrl) {
      try {
        const erpHeaders = { 
          'Content-Type': 'application/json',
          'User-Agent': 'Cloudflare-Pages-Worker'
        };
        if (erpKey) {
          erpHeaders['Authorization'] = `Bearer ${erpKey}`;
        }
        
        const erpRes = await fetch(erpUrl, {
          method: 'POST',
          headers: erpHeaders,
          body: JSON.stringify({
            email: leadData.email,
            contactpersonname: leadData.name,
            contactnumber: leadData.phone,
            referredby: "Website: " + (leadData.service || "General"),
            createdon: String(timestamp),
            currencycode: "INR"
          })
        });
        
        erpSyncStatus = erpRes.ok ? 'success' : `failed_status_${erpRes.status}`;
      } catch (erpErr) {
        console.error('ERP posting error:', erpErr);
        erpSyncStatus = `error_${erpErr.message}`;
      }
    }

    // 4. Post to Google Apps Script for Email Dispatch
    let emailSyncStatus = 'disabled';
    if (googleScriptUrl) {
      try {
        const emailRes = await fetch(googleScriptUrl, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'User-Agent': 'Cloudflare-Pages-Worker'
          },
          body: JSON.stringify({
            recipients: notificationEmails,
            name: leadData.name,
            email: leadData.email,
            phone: leadData.phone,
            service: leadData.service,
            message: leadData.message
          })
        });
        emailSyncStatus = emailRes.ok ? 'success' : `failed_status_${emailRes.status}`;
      } catch (err) {
        console.error("Google Script email dispatch error:", err);
        emailSyncStatus = `error_${err.message}`;
      }
    }

    return new Response(JSON.stringify({ 
      result: 'success', 
      erp_sync: erpSyncStatus,
      email_sync: emailSyncStatus
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Error submitting lead:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
