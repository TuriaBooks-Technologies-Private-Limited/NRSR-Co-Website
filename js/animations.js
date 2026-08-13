/**
 * NRSR & Co - Motion Graphic & Animation Controller
 * Custom animations including canvas-based flowing curves ("lightning lines"),
 * self-running activity timelines, live accounting ledgers, and scroll reveals.
 */

const PREFERS_REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initCanvasWaves();
  initLedgerSimulation();
  initTimelineSimulation();
  initGlowEffects();
  init3DTilt();
  initServiceRail();
  initServiceSplitPage();
  initServicesHub();
  initCursorGlow();
  initProcessLine();
  initMagneticButtons();
  initHeroEntrance();
  initScrollReveals(); // must run last: earlier steps tag elements with .reveal-on-scroll
});

/* 1. Futuristic Light Preloader */
function initPreloader() {
  return; // Disabled by user request
  const preloader = document.createElement('div');
  preloader.id = 'nrsr-preloader';
  preloader.innerHTML = `
    <div class="preloader-content">
      <div class="preloader-logo">NRSR <span>& Co</span></div>
      <div class="preloader-subtitle">Chartered Accountants & Advisors</div>
      <div class="preloader-bar-bg">
        <div class="preloader-bar"></div>
      </div>
      <div class="preloader-status">Initializing Secure Ledger...</div>
    </div>
  `;
  document.body.appendChild(preloader);
  document.body.style.overflow = 'hidden';

  const statuses = [
    'Establishing Secure Tunnel...',
    'Loading Compliance Modules...',
    'Reconciling Assets...',
    'Welcome to NRSR & Co'
  ];

  let currentStatus = 0;
  const statusEl = preloader.querySelector('.preloader-status');
  
  const statusInterval = setInterval(() => {
    if (currentStatus < statuses.length - 1) {
      currentStatus++;
      statusEl.textContent = statuses[currentStatus];
    }
  }, 350);

  setTimeout(() => {
    clearInterval(statusInterval);
    preloader.classList.add('fade-out');
    document.body.style.overflow = '';
    setTimeout(() => {
      preloader.remove();
    }, 600);
  }, 1600);
}

/* 2. Flowing Wave Trails ("Lightning Lines" Canvas Background) */
function initCanvasWaves() {
  const canvas = document.getElementById('lightning-canvas');
  if (!canvas || PREFERS_REDUCED_MOTION) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.offsetWidth);
  let height = (canvas.height = canvas.offsetHeight);

  window.addEventListener('resize', () => {
    if (!canvas) return;
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  });

  // Curve definition
  const lines = [
    { yOffset: 0.45, speed: 0.008, amplitude: 35, phase: 0, color: 'rgba(22, 24, 29, 0.25)' },
    { yOffset: 0.50, speed: 0.005, amplitude: 45, phase: Math.PI / 4, color: 'rgba(75, 81, 88, 0.2)' },
    { yOffset: 0.55, speed: 0.007, amplitude: 25, phase: Math.PI / 2, color: 'rgba(169, 173, 179, 0.18)' }
  ];

  // Moving energy particles along the waves
  const particles = [
    { lineIndex: 0, progress: 0.1, speed: 0.0015, size: 4, color: '#16181d' },
    { lineIndex: 1, progress: 0.4, speed: 0.0010, size: 5, color: '#4b5158' },
    { lineIndex: 2, progress: 0.7, speed: 0.0020, size: 3, color: '#6b6f75' }
  ];

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw waves
    lines.forEach((line) => {
      ctx.beginPath();
      ctx.strokeStyle = line.color;
      ctx.lineWidth = 1.5;
      
      line.phase += line.speed;
      
      for (let x = 0; x < width; x++) {
        // Curve formula using sin waves
        const y = 
          height * line.yOffset + 
          Math.sin(x * 0.002 + line.phase) * line.amplitude + 
          Math.sin(x * 0.005 + line.phase * 0.5) * (line.amplitude * 0.3);
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    });

    // Draw particles gliding along the waves
    particles.forEach((p) => {
      p.progress += p.speed;
      if (p.progress > 1) p.progress = 0;

      const line = lines[p.lineIndex];
      const x = p.progress * width;
      const y = 
        height * line.yOffset + 
        Math.sin(x * 0.002 + line.phase) * line.amplitude + 
        Math.sin(x * 0.005 + line.phase * 0.5) * (line.amplitude * 0.3);

      // Glow effect for particles
      ctx.beginPath();
      ctx.arc(x, y, p.size * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace(')', ', 0.15)').replace('rgb', 'rgba');
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();
}

/* 3. Live Accounting Ledger Simulation */
function initLedgerSimulation() {
  const table = document.getElementById('ledger-simulator');
  const tag = document.getElementById('ledger-status-tag');
  if (!table || !tag) return;

  const revenueRowVal = table.querySelector('.revenue-val');
  const taxRowVal = table.querySelector('.tax-val');
  const netRowVal = table.querySelector('.net-val');

  let state = 0; // 0: Pending, 1: Under Review, 2: Certified
  
  function runCycle() {
    if (state === 0) {
      // Pending
      tag.className = 'status-tag pending';
      tag.innerHTML = '<span class="pulse-dot"></span> PENDING DATA';
      
      animateValue(revenueRowVal, 0, 0, 500);
      animateValue(taxRowVal, 0, 0, 500);
      animateValue(netRowVal, 0, 0, 500);
      
      state = 1;
      setTimeout(runCycle, 2000);
    } else if (state === 1) {
      // Extracting / Reconciling
      tag.className = 'status-tag review';
      tag.innerHTML = '<span class="pulse-dot"></span> UNDER REVIEW';
      
      animateValue(revenueRowVal, 0, 39842012, 1200);
      animateValue(taxRowVal, 0, 7171562, 1200);
      animateValue(netRowVal, 0, 32670450, 1200);
      
      state = 2;
      setTimeout(runCycle, 4500);
    } else if (state === 2) {
      // Certified
      tag.className = 'status-tag approved';
      tag.innerHTML = '✓ CERTIFIED';
      
      state = 0;
      setTimeout(runCycle, 4500);
    }
  }

  // Value formatting utility
  function formatIndianCurrency(val) {
    if (val === 0) return '₹ 0.00';
    return '₹ ' + val.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  }

  function animateValue(obj, start, end, duration) {
    if (!obj) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const val = Math.floor(progress * (end - start) + start);
      obj.innerHTML = formatIndianCurrency(val);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  runCycle();
}

/* 4. Self-Running Activity Timeline */
function initTimelineSimulation() {
  const listItems = document.querySelectorAll('.timeline-tracker li');
  const progressLine = document.querySelector('.timeline-progress-fill');
  if (!listItems.length) return;

  let currentStep = 0;

  function runTimeline() {
    listItems.forEach(item => item.classList.remove('active', 'completed'));
    
    // Animate progress line
    if (progressLine) {
      progressLine.style.height = '0%';
    }

    function animateStep() {
      if (currentStep < listItems.length) {
        listItems[currentStep].classList.add('active');
        
        // Mark previous as completed
        for (let i = 0; i < currentStep; i++) {
          listItems[i].classList.remove('active');
          listItems[i].classList.add('completed');
        }

        // Fill timeline bar
        if (progressLine) {
          const percent = (currentStep / (listItems.length - 1)) * 100;
          progressLine.style.height = `${percent}%`;
        }

        currentStep++;
        setTimeout(animateStep, 2500);
      } else {
        // Complete state
        listItems.forEach(item => {
          item.classList.remove('active');
          item.classList.add('completed');
        });
        if (progressLine) progressLine.style.height = '100%';
        
        currentStep = 0;
        setTimeout(runTimeline, 4000); // Restart after pause
      }
    }

    animateStep();
  }

  runTimeline();
}

/* 5. Scroll Reveals */
function initScrollReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Optional: stop observing once revealed
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    // Negative bottom margin shrinks the effective viewport, so an element
    // has to actually be well inside view before it reveals — the visitor
    // needs to see it happen as they scroll, not have it already settled
    // by the time it arrives on screen.
    rootMargin: '0px 0px -12% 0px'
  });

  document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

  // main.js renders team/testimonial/etc. content after an async
  // gmStore.loadData() fetch, which can resolve after this function has
  // already scanned the DOM — watch for any .reveal-on-scroll elements
  // added later (e.g. team cards) so they aren't stuck invisible forever.
  const mo = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;
        if (node.matches && node.matches('.reveal-on-scroll')) observer.observe(node);
        node.querySelectorAll && node.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
      });
    }
  });
  mo.observe(document.body, { childList: true, subtree: true });
}

/* 6. Mouse Coordinates for Card Border Glow Effects */
function initGlowEffects() {
  const cards = document.querySelectorAll('.glow-card:not([data-glow-bound])');
  if (!cards.length) return;

  cards.forEach(card => {
    card.setAttribute('data-glow-bound', 'true');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* 7. 3D Perspective Tilt on Cards */
function init3DTilt() {
  if (PREFERS_REDUCED_MOTION) return;
  const tiltCards = document.querySelectorAll('.tilt-card:not([data-tilt-bound])');
  tiltCards.forEach(card => {
    card.setAttribute('data-tilt-bound', 'true');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
      card.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2}px 40px rgba(22, 24, 29,0.15)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      card.style.boxShadow = '0 30px 60px -15px rgba(22, 24, 29,0.1)';
    });
  });
}

/* 8. Interactive Split-Showcase with per-service animated diagrams */
const SERVICE_TEMPLATES = {
  'Income Tax': {
    icon: '📋',
    description: 'End-to-end Income Tax filing, assessments & appeals.',
    features: ['ITR Filing (All Types)', 'Tax Planning & Advisory', 'Assessment & Scrutiny', 'Advance Tax Computation', 'Form 15CA / 15CB'],
    renderDiagram: (el) => {
      el.innerHTML = `
        <div class="mock-grid-lines"></div>
        <div class="mock-diagram-container" style="padding:10px;">
          <div style="font-size:11px;color:#16181d;font-weight:700;letter-spacing:1px;margin-bottom:14px;">INCOME TAX WORKFLOW</div>
          ${['Document Collection','TDS Reconciliation','ITR Computation','E-Filing to Portal','Acknowledgement'].map((step,i) => `
            <div class="timeline-step" style="display:flex;align-items:center;gap:12px;margin-bottom:12px;animation:fadeSlideIn 0.4s ease ${i*0.15}s both;">
              <div style="width:28px;height:28px;border-radius:50%;background:${i<2?'#16181d':'rgba(22, 24, 29,0.12)'};display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:${i<2?'#fff':'#16181d'};flex-shrink:0;">${i+1}</div>
              <div style="flex:1;height:6px;background:${i<2?'linear-gradient(90deg,#16181d,#4b5158)':'rgba(22, 24, 29,0.1)'};border-radius:3px;"></div>
              <div style="font-size:11px;color:${i<2?'#16181d':'#94a3b8'};font-weight:${i<2?'600':'400'};min-width:120px;">${step}</div>
            </div>`).join('')}
          <div style="margin-top:16px;padding:10px 14px;background:linear-gradient(90deg,#ecfdf5,#d1fae5);border-radius:10px;font-size:11px;color:#059669;font-weight:700;">✓ ITR Filed Successfully (AY 2024-25)</div>
        </div>`;
    }
  },
  'Goods & Service Tax': {
    icon: '🧾',
    description: 'Complete GST compliance: registration, filing, audits & ITC.',
    features: ['GST Registration', 'Monthly/Quarterly Returns', 'Input Tax Credit', 'GST Audit & Reconciliation', 'E-Way Bill Management'],
    renderDiagram: (el) => {
      const months = ['Apr','May','Jun','Jul','Aug','Sep'];
      const vals = [88,94,79,100,92,97];
      el.innerHTML = `
        <div class="mock-grid-lines"></div>
        <div class="mock-diagram-container" style="padding:10px;">
          <div style="font-size:11px;color:#16181d;font-weight:700;letter-spacing:1px;margin-bottom:14px;">GST COMPLIANCE TRACKER</div>
          <svg viewBox="0 0 300 120" style="width:100%;height:120px;">
            <polyline points="${vals.map((v,i) => `${i*50+25},${120-(v*1.1)}`).join(' ')}" fill="none" stroke="#16181d" stroke-width="2.5" stroke-linecap="round" class="drawing-path"/>
            ${vals.map((v,i) => `<circle cx="${i*50+25}" cy="${120-(v*1.1)}" r="4" fill="#16181d" style="animation:fadeSlideIn 0.3s ease ${i*0.2}s both;"/>`).join('')}
            ${months.map((m,i) => `<text x="${i*50+25}" y="118" font-size="8" fill="#94a3b8" text-anchor="middle">${m}</text>`).join('')}
          </svg>
          <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;">
            ${['GSTR-1 Filed','GSTR-3B Filed','ITC Claimed'].map(t => `<span style="font-size:10px;background:rgba(15,17,20,0.06);color:#4b5158;padding:3px 8px;border-radius:20px;font-weight:600;">${t}</span>`).join('')}
          </div>
        </div>`;
    }
  },
  'Corporate': {
    icon: '🏢',
    description: 'Company incorporation, ROC filings & MCA compliance.',
    features: ['Company Incorporation', 'ROC Annual Filings', 'Board Meeting Compliance', 'Statutory Registers', 'MCA Portal Management'],
    renderDiagram: (el) => {
      el.innerHTML = `
        <div class="mock-grid-lines"></div>
        <div class="mock-diagram-container" style="padding:10px;">
          <div style="font-size:11px;color:#16181d;font-weight:700;letter-spacing:1px;margin-bottom:18px;">INCORPORATION FLOW</div>
          <div style="display:flex;flex-direction:column;gap:14px;">
            ${[['Name Approval','MCA21 Portal','✓ Approved'],['MOA / AOA Drafting','Legal Document','✓ Signed'],['DIN & DSC','Director Credentials','✓ Issued'],['Certificate of Incorporation','Registrar of Companies','✓ Received']].map(([title,sub,status],i)=>`
              <div style="display:flex;align-items:center;gap:14px;animation:fadeSlideIn 0.4s ease ${i*0.15}s both;">
                <div style="width:32px;height:32px;background:${i===3?'#16181d':'rgba(15,17,20,0.06)'};border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;">${['📝','📄','🔑','🏛️'][i]}</div>
                <div style="flex:1;">
                  <div style="font-size:12px;font-weight:700;color:#16181d;">${title}</div>
                  <div style="font-size:10px;color:#94a3b8;">${sub}</div>
                </div>
                <span style="font-size:10px;color:#059669;font-weight:700;">${status}</span>
              </div>`).join('')}
          </div>
        </div>`;
    }
  },
  'Partnerships & LLPs': {
    icon: '🤝',
    description: 'Partnership deed drafting, LLP formation & compliance.',
    features: ['Partnership Deed Drafting', 'LLP Incorporation', 'Partner Capital Accounts', 'Profit Sharing Restructuring', 'Dissolution Support'],
    renderDiagram: (el) => {
      el.innerHTML = `
        <div class="mock-grid-lines"></div>
        <div class="mock-diagram-container" style="padding:10px;">
          <div style="font-size:11px;color:#16181d;font-weight:700;letter-spacing:1px;margin-bottom:14px;">PARTNER CAPITAL LEDGER</div>
          <table style="width:100%;font-size:11px;border-collapse:collapse;">
            <thead><tr style="background:rgba(15,17,20,0.05);">
              <th style="padding:8px;text-align:left;color:#16181d;border-radius:6px 0 0 6px;">Partner</th>
              <th style="padding:8px;text-align:right;color:#16181d;">Capital (₹)</th>
              <th style="padding:8px;text-align:right;color:#16181d;">Profit Share</th>
            </tr></thead>
            <tbody>
              ${[['N. Rao','12,50,000','30%'],['R. Shetty','10,00,000','25%'],['S. Raj','8,75,000','22.5%'],['R. Kumar','7,50,000','22.5%']].map(([n,c,p],i)=>`
                <tr style="animation:fadeSlideIn 0.3s ease ${i*0.15}s both;">
                  <td style="padding:8px;color:#374151;font-weight:600;">${n}</td>
                  <td style="padding:8px;text-align:right;color:#16181d;">₹${c}</td>
                  <td style="padding:8px;text-align:right;"><span style="background:rgba(15,17,20,0.06);color:#4b5158;padding:2px 8px;border-radius:20px;font-weight:700;">${p}</span></td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>`;
    }
  },
  'Internal Control': {
    icon: '🛡️',
    description: 'Risk assessment, internal audit & control systems design.',
    features: ['Risk Matrix Assessment', 'Internal Audit Planning', 'Process Review & Gaps', 'Control Design', 'Management Reports'],
    renderDiagram: (el) => {
      const checks = [['Payroll Controls','Verified','low'],['Vendor Payments','Needs Review','medium'],['Bank Reconciliation','Verified','low'],['Inventory Controls','Verified','low'],['Expense Claims','Flagged','high']];
      el.innerHTML = `
        <div class="mock-grid-lines"></div>
        <div class="mock-diagram-container" style="padding:10px;">
          <div style="font-size:11px;color:#16181d;font-weight:700;letter-spacing:1px;margin-bottom:14px;">INTERNAL AUDIT CHECKLIST</div>
          ${checks.map(([name,status,risk],i)=>`
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;animation:fadeSlideIn 0.4s ease ${i*0.12}s both;">
              <div style="width:18px;height:18px;border-radius:50%;background:${status==='Verified'?'#10b981':status==='Flagged'?'#f43f5e':'#f97316'};display:flex;align-items:center;justify-content:center;font-size:9px;color:white;flex-shrink:0;">${status==='Verified'?'✓':status==='Flagged'?'!':'~'}</div>
              <div style="flex:1;font-size:11px;color:#374151;font-weight:500;">${name}</div>
              <span style="font-size:9px;padding:2px 8px;border-radius:20px;font-weight:700;background:${risk==='low'?'#d1fae5':risk==='high'?'#fee2e2':'#fef3c7'};color:${risk==='low'?'#059669':risk==='high'?'#dc2626':'#d97706'};">${risk.toUpperCase()} RISK</span>
            </div>`).join('')}
        </div>`;
    }
  },
  'Certifications': {
    icon: '🏅',
    description: 'Net worth, turnover, statutory & sector-specific certifications.',
    features: ['Net Worth Certificates', 'Turnover Certificates', 'Export Incentive Certs', 'MSME Certifications', 'Bank/Tender Certificates'],
    renderDiagram: (el) => {
      el.innerHTML = `
        <div class="mock-grid-lines"></div>
        <div class="mock-diagram-container" style="padding:10px;align-items:center;">
          <div style="font-size:11px;color:#16181d;font-weight:700;letter-spacing:1px;margin-bottom:18px;align-self:flex-start;">CERTIFICATE ISSUED</div>
          <div style="width:220px;border:2px solid #16181d;border-radius:16px;padding:20px 24px;text-align:center;position:relative;background:linear-gradient(135deg,#f7f8fa,#eef0f3);" class="stamp-seal">
            <div style="font-size:28px;margin-bottom:8px;">🏅</div>
            <div style="font-size:12px;font-weight:800;color:#16181d;letter-spacing:0.5px;">CERTIFICATE OF NET WORTH</div>
            <div style="font-size:10px;color:#16181d;margin:6px 0;">M/s NRSR & Co</div>
            <div style="font-size:10px;color:#94a3b8;">Chartered Accountants</div>
            <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#16181d,#4b5158);display:flex;align-items:center;justify-content:center;color:white;font-size:10px;font-weight:700;margin:14px auto 0;box-shadow:0 4px 12px rgba(22, 24, 29,0.4);">SEAL</div>
          </div>
        </div>`;
    }
  },
  'Registrations': {
    icon: '📑',
    description: 'GST, MSME, FSSAI, Import-Export and other statutory registrations.',
    features: ['GST Registration', 'MSME / Udyam', 'FSSAI License', 'IEC for Import/Export', 'Shop Act / Trade License'],
    renderDiagram: (el) => {
      const regs = [['GST Registration','Active','#10b981'],['MSME / Udyam','Active','#10b981'],['FSSAI License','Pending Renewal','#f97316'],['IEC Code','Active','#10b981'],['Trade License','Active','#10b981']];
      el.innerHTML = `
        <div class="mock-grid-lines"></div>
        <div class="mock-diagram-container" style="padding:10px;">
          <div style="font-size:11px;color:#16181d;font-weight:700;letter-spacing:1px;margin-bottom:14px;">REGISTRATION STATUS BOARD</div>
          ${regs.map(([name,status,color],i)=>`
            <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(22, 24, 29,0.07);animation:fadeSlideIn 0.3s ease ${i*0.12}s both;">
              <div style="font-size:11px;color:#374151;font-weight:600;">${name}</div>
              <span style="font-size:10px;color:${color};font-weight:700;padding:2px 10px;background:${color}18;border-radius:20px;">● ${status}</span>
            </div>`).join('')}
        </div>`;
    }
  },
  'Financial Accounting': {
    icon: '📊',
    description: 'Bookkeeping, financial statements & MIS reports.',
    features: ['Day-to-Day Bookkeeping', 'P&L and Balance Sheet', 'Cash Flow Statements', 'MIS Reports', 'Payroll Accounting'],
    renderDiagram: (el) => {
      el.innerHTML = `
        <div class="mock-grid-lines"></div>
        <div class="mock-diagram-container" style="padding:10px;">
          <div style="font-size:11px;color:#16181d;font-weight:700;letter-spacing:1px;margin-bottom:10px;">P&L SUMMARY (FY 2024-25)</div>
          <svg viewBox="0 0 280 130" style="width:100%;height:130px;">
            <defs><linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#16181d"/><stop offset="100%" stop-color="#4b5158"/></linearGradient></defs>
            ${[['Revenue','240','Q1'],['COGS','120','Q2'],['Gross Profit','180','Q3'],['Net Profit','90','Q4']].map(([label,h,q],i)=>`
              <rect x="${i*65+15}" y="${130-parseInt(h)}" width="40" height="${h}" rx="6" fill="url(#barGrad)" opacity="${0.5+i*0.15}" style="animation:fadeSlideIn 0.5s ease ${i*0.15}s both;"/>
              <text x="${i*65+35}" y="128" font-size="7" fill="#94a3b8" text-anchor="middle">${label}</text>
              <text x="${i*65+35}" y="${130-parseInt(h)-6}" font-size="8" fill="#16181d" text-anchor="middle" font-weight="700">₹${parseInt(h)*1.2}L</text>`).join('')}
          </svg>
        </div>`;
    }
  },
  'Audits': {
    icon: '🔍',
    description: 'Statutory, tax, bank and concurrent audit services.',
    features: ['Statutory Audit (Companies Act)', 'Tax Audit (Sec 44AB)', 'Bank Branch Audit', 'Internal Concurrent Audit', 'Audit Reports & Certificates'],
    renderDiagram: (el) => {
      const phases = [['Planning & Risk Assessment','✓'],['Internal Controls Review','✓'],['Substantive Testing','✓'],['Analytical Procedures','→'],['Audit Report Issuance','○']];
      el.innerHTML = `
        <div class="mock-grid-lines"></div>
        <div class="mock-diagram-container" style="padding:10px;">
          <div style="font-size:11px;color:#16181d;font-weight:700;letter-spacing:1px;margin-bottom:14px;">STATUTORY AUDIT PROGRESS</div>
          ${phases.map(([phase,status],i)=>`
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:11px;animation:fadeSlideIn 0.4s ease ${i*0.15}s both;">
              <div style="width:24px;height:24px;border-radius:50%;border:2px solid ${status==='✓'?'#10b981':status==='→'?'#16181d':'#e2e8f0'};background:${status==='✓'?'#10b981':status==='→'?'rgba(15,17,20,0.08)':'white'};display:flex;align-items:center;justify-content:center;font-size:10px;color:${status==='✓'?'white':status==='→'?'#16181d':'#94a3b8'};flex-shrink:0;font-weight:700;">${status}</div>
              <div style="flex:1;">
                <div style="font-size:11px;color:${status==='○'?'#94a3b8':'#374151'};font-weight:${status!=='○'?'600':'400'};">${phase}</div>
              </div>
              ${status==='→'?`<span style="font-size:9px;background:rgba(15,17,20,0.08);color:#4b5158;padding:2px 8px;border-radius:20px;font-weight:700;">IN PROGRESS</span>`:''}
            </div>`).join('')}
          <div style="height:4px;background:#f1f5f9;border-radius:2px;margin-top:8px;"><div style="width:65%;height:100%;background:linear-gradient(90deg,#16181d,#4b5158);border-radius:2px;"></div></div>
          <div style="font-size:10px;color:#94a3b8;margin-top:6px;">65% Complete</div>
        </div>`;
    }
  }
};

/* Generic workflow diagram — the scalable fallback for ANY service that
   doesn't have a hand-crafted entry in SERVICE_TEMPLATES. Built entirely
   from data already in the admin CMS (name + features), so a service added
   from the backend gets an animated workflow with zero code changes. */
function renderGenericWorkflow(svc, el) {
  const steps = (svc.features && svc.features.length ? svc.features : [svc.shortDesc || svc.description || 'Handled end-to-end']).slice(0, 6);
  el.innerHTML = `
    <div class="mock-grid-lines"></div>
    <div class="mock-diagram-container" style="padding:10px;">
      <div style="font-size:11px;color:#16181d;font-weight:700;letter-spacing:1px;margin-bottom:14px;">${svc.name.toUpperCase()} WORKFLOW</div>
      ${steps.map((step, i) => `
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;animation:fadeSlideIn 0.4s ease ${i * 0.15}s both;">
          <div style="width:28px;height:28px;border-radius:50%;background:${i < steps.length - 1 ? '#16181d' : 'rgba(22, 24, 29,0.12)'};display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:${i < steps.length - 1 ? '#fff' : '#16181d'};flex-shrink:0;">${i + 1}</div>
          <div style="flex:1;height:6px;background:${i < steps.length - 1 ? 'linear-gradient(90deg,#16181d,#4b5158)' : 'rgba(22, 24, 29,0.1)'};border-radius:3px;"></div>
          <div style="font-size:11px;color:#16181d;font-weight:600;min-width:140px;">${step}</div>
        </div>`).join('')}
      <div style="margin-top:16px;padding:10px 14px;background:linear-gradient(90deg,#ecfdf5,#d1fae5);border-radius:10px;font-size:11px;color:#059669;font-weight:700;">✓ ${svc.category || 'Handled'}, End to End</div>
    </div>`;
}

function initServiceRail() {
  const rail = document.getElementById('svcRail');
  if (!rail || !window.gmStore) return;

  const services = window.gmStore.getServices();
  if (!services || !services.length) return;

  function buildCard(svc, i) {
    const template = SERVICE_TEMPLATES[svc.name];
    const card = document.createElement('a');
    card.href = `services.html?service=${encodeURIComponent(svc.id)}`;
    card.className = 'svc-card glow-card reveal-on-scroll' + (i % 2 ? ' reveal-down' : '');
    // A slower, more visible cascade than the default stagger — the user
    // should be able to watch each card settle in as they land on/scroll
    // past this section, not have them all appear at once.
    card.style.transitionDelay = `${(i % 6) * 0.14}s`;
    card.style.transitionDuration = '0.7s';
    card.innerHTML = `
      <div class="svc-top">
        <div class="svc-cat">${svc.category || ''}</div>
        <h4>${template ? template.icon + ' ' : ''}${svc.name}</h4>
        <p>${svc.shortDesc || svc.description || ''}</p>
        <div class="svc-open">See the workflow <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 1l6 4-6 4" stroke="currentColor" stroke-width="1.6" fill="none"/></svg></div>
      </div>
    `;
    return card;
  }

  services.forEach((svc, i) => rail.appendChild(buildCard(svc, i)));

  // Duplicate the full set once, right after the first: this lets the
  // auto-scroll loop seamlessly (jump back exactly one copy's width the
  // instant it finishes the first) instead of visibly bouncing at the end.
  services.forEach((svc, i) => {
    const clone = buildCard(svc, i);
    clone.setAttribute('aria-hidden', 'true');
    clone.tabIndex = -1;
    rail.appendChild(clone);
  });

  initGlowEffects();

  // Drag-to-scroll. A plain click (no movement) follows the card's link
  // normally via the browser's native anchor behavior; a drag suppresses
  // it so dragging never triggers navigation. Pointer capture is only
  // acquired once real dragging is detected (not on pointerdown) — capturing
  // immediately breaks native click-to-navigate on the anchor underneath.
  let isDown = false, startX, scrollLeft, moved = false, pointerId = null;
  rail.addEventListener('pointerdown', (e) => {
    isDown = true; moved = false; pointerId = e.pointerId;
    startX = e.clientX; scrollLeft = rail.scrollLeft;
  });
  rail.addEventListener('pointerup', () => {
    isDown = false; rail.classList.remove('dragging');
  });
  rail.addEventListener('pointercancel', () => {
    isDown = false; rail.classList.remove('dragging');
  });
  rail.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      rail.classList.add('dragging');
      rail.setPointerCapture(pointerId);
    }
    if (moved) rail.scrollLeft = scrollLeft - dx;
  });
  rail.addEventListener('click', (e) => {
    if (moved) e.preventDefault();
  });

  // Auto-scroll at a gentle, steady pace, one direction only, looping
  // indefinitely through the duplicated set. Hovering pauses it immediately
  // (so a visitor can read/click a card without it drifting under the
  // cursor); a drag, wheel, or touch also pauses it and resumes a couple of
  // seconds after they let go.
  if (!PREFERS_REDUCED_MOTION) {
    let hovering = false;
    let interacting = false;
    let resumeTimer = null;

    const pauseBriefly = () => {
      interacting = true;
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => { interacting = false; }, 2200);
    };
    rail.addEventListener('mouseenter', () => { hovering = true; });
    rail.addEventListener('mouseleave', () => { hovering = false; });
    rail.addEventListener('pointerdown', pauseBriefly);
    rail.addEventListener('wheel', pauseBriefly, { passive: true });
    rail.addEventListener('touchstart', pauseBriefly, { passive: true });

    function autoScrollStep() {
      if (!hovering && !interacting) {
        const loopPoint = rail.scrollWidth / 2;
        if (loopPoint > 0) {
          rail.scrollLeft += 1.1;
          if (rail.scrollLeft >= loopPoint) rail.scrollLeft -= loopPoint;
        }
      }
      requestAnimationFrame(autoScrollStep);
    }
    requestAnimationFrame(autoScrollStep);
  }
}

/* Services page split-pane: left = nav + description, right = animated
   workflow. Deep-linkable via ?service=<id> so homepage cards can jump
   straight to a specific practice. */
function initServiceSplitPage() {
  const container = document.getElementById('serviceDetailPane');
  if (!container || !window.gmStore) return;

  const navPane = container.querySelector('.service-nav-pane');
  const displayEl = container.querySelector('#showcaseDiagram');
  const slideEl = container.querySelector('#serviceDisplaySlide') || displayEl;
  const ctaEl = container.querySelector('#serviceCtaPanel');
  if (!navPane || !displayEl) return;

  const services = window.gmStore.getServices();
  if (!services || !services.length) return;

  const requestedId = new URLSearchParams(window.location.search).get('service');
  let activeId = services.some(s => s.id === requestedId) ? requestedId : services[0].id;

  services.forEach((svc, i) => {
    const template = SERVICE_TEMPLATES[svc.name];
    const item = document.createElement('div');
    item.className = 'service-nav-item reveal-on-scroll' + (i % 2 ? ' reveal-down' : '') + (svc.id === activeId ? ' active' : '');
    item.style.transitionDelay = `${(i % 5) * 0.07}s`;
    item.dataset.id = svc.id;
    item.innerHTML = `
      <h4><span class="icon-wrapper">${template ? template.icon : '📁'}</span> ${svc.name}</h4>
      <p>${svc.shortDesc || svc.description || ''}</p>
      <ul class="features-list">
        ${(svc.features || []).map(f => `<li>${f}</li>`).join('')}
      </ul>`;
    item.addEventListener('click', () => {
      selectService(svc);
      if (!PREFERS_REDUCED_MOTION) scheduleAuto();
    });
    navPane.appendChild(item);
  });

  function selectService(svc) {
    navPane.querySelectorAll('.service-nav-item').forEach(el => el.classList.remove('active'));
    const item = navPane.querySelector(`[data-id="${svc.id}"]`);
    if (item) item.classList.add('active');
    activeId = svc.id;
    history.replaceState(null, '', `?service=${encodeURIComponent(svc.id)}`);
    renderDiagram(svc);
  }

  // Auto-advance through every service on a timer once the pane has
  // scrolled into view, so a visitor doesn't have to click "see the
  // workflow" to discover what's here — it walks itself through all of
  // them and loops back to the first. Hovering the pane pauses it; moving
  // away resumes; a manual click just restarts the clock on the new item.
  let autoTimer = null;
  let autoPaused = false;

  function scheduleAuto() {
    clearTimeout(autoTimer);
    if (PREFERS_REDUCED_MOTION || autoPaused) return;
    autoTimer = setTimeout(() => {
      const idx = services.findIndex(s => s.id === activeId);
      selectService(services[(idx + 1) % services.length]);
      scheduleAuto();
    }, 3800);
  }

  navPane.addEventListener('mouseenter', () => { autoPaused = true; clearTimeout(autoTimer); });
  navPane.addEventListener('mouseleave', () => { autoPaused = false; scheduleAuto(); });

  function renderCtaPanel(svc) {
    if (!ctaEl) return;
    const featureCount = (svc.features || []).length;
    ctaEl.innerHTML = `
      <div class="cta-copy">
        <strong>${featureCount ? `${featureCount} areas covered under ${svc.name}` : svc.name}</strong>
        <p>Further information on this service is available on request.</p>
      </div>
      <a href="contact.html" class="btn btn-primary">Contact Us</a>
    `;
  }

  function renderDiagram(svc) {
    const template = SERVICE_TEMPLATES[svc.name];
    renderCtaPanel(svc);
    // Slide the ENTIRE card (border, shadow, glow-ring included) out to the
    // left and off-screen, not just the text inside it.
    slideEl.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    slideEl.style.opacity = '0';
    slideEl.style.transform = 'translateX(-60px)';
    setTimeout(() => {
      if (template) template.renderDiagram(displayEl);
      else renderGenericWorkflow(svc, displayEl);
      init3DTilt();
      // Then the whole card re-enters from the right with the freshly
      // selected service's data already inside it.
      slideEl.style.transition = 'none';
      slideEl.style.transform = 'translateX(70px)';
      void slideEl.offsetWidth; // force reflow so the entry transition kicks in
      slideEl.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      slideEl.style.opacity = '1';
      slideEl.style.transform = 'translateX(0)';
    }, 250);
  }

  const active = services.find(s => s.id === activeId);
  renderDiagram(active);

  if (!PREFERS_REDUCED_MOTION) {
    const autoStart = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          scheduleAuto();
          autoStart.disconnect();
        }
      });
    }, { threshold: 0.4 });
    autoStart.observe(container);
  }
}

/* 9. Magnetic Buttons — CTA buttons gently pull toward the cursor */
/* 8b. Cursor Glow — a soft ambient highlight that trails the pointer
   across the whole page, reinforcing the monochrome palette instead of
   fighting it. Skipped on touch devices (no real cursor) and under
   reduced-motion. */
function initCursorGlow() {
  if (PREFERS_REDUCED_MOTION) return;
  if (window.matchMedia('(hover: none)').matches) return;

  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  let active = false;

  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    if (!active) { active = true; glow.classList.add('active'); }
  });
  document.addEventListener('mouseleave', () => {
    active = false;
    glow.classList.remove('active');
  });

  function loop() {
    currentX += (targetX - currentX) * 0.09;
    currentY += (targetY - currentY) * 0.09;
    glow.style.transform = `translate(${currentX}px, ${currentY}px)`;
    requestAnimationFrame(loop);
  }
  loop();
}

function initMagneticButtons() {
  if (PREFERS_REDUCED_MOTION) return;
  const buttons = document.querySelectorAll('.btn-primary, .btn-accent, .btn-outline');
  buttons.forEach(btn => {
    let raf = null;
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        btn.style.transition = 'background-color 0.4s, box-shadow 0.4s, transform 0.15s ease-out';
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
    });
    btn.addEventListener('mouseleave', () => {
      if (raf) cancelAnimationFrame(raf);
      btn.style.transition = 'background-color 0.4s, box-shadow 0.4s, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

/* 10. Hero Entrance — staggered fade/slide-in for the hero content on load */
function initHeroEntrance() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const targets = hero.querySelectorAll('.hero-tag, h1, .hero p, .hero-actions, .ledger-preview-card, .timeline-card');
  targets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    if (PREFERS_REDUCED_MOTION) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      return;
    }
    el.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)';
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 120 + i * 110);
  });
}

/* 11b. Services Hub — radial "one firm, every specialization" diagram.
   Node count and positions are computed from the live services list, so
   an admin-added 10th service gets its own spoke automatically instead
   of needing a code change. Coordinates use a 0-100 unit system matching
   the SVG viewBox, so the whole diagram scales with the container. */
function initServicesHub() {
  const hub = document.getElementById('servicesHub');
  if (!hub || !window.gmStore) return;

  const services = window.gmStore.getServices();
  if (!services || !services.length) return;

  const n = services.length;
  const R = 35;
  const nodes = services.map((svc, i) => {
    const angle = (-90 + i * (360 / n)) * (Math.PI / 180);
    return {
      svc,
      x: 50 + R * Math.cos(angle),
      y: 50 + R * Math.sin(angle)
    };
  });

  const lines = nodes.map(node => `<line x1="50" y1="50" x2="${node.x.toFixed(2)}" y2="${node.y.toFixed(2)}" />`).join('');

  const nodeEls = nodes.map((node, i) => {
    const template = SERVICE_TEMPLATES[node.svc.name];
    return `
      <a href="services.html?service=${encodeURIComponent(node.svc.id)}" class="hub-node reveal-on-scroll" style="left:${node.x.toFixed(2)}%; top:${node.y.toFixed(2)}%; transition-delay:${(i % 5) * 0.06}s;">
        <span class="hub-node-icon">${template ? template.icon : '📁'}</span>
        <span class="hub-node-label">${node.svc.name}</span>
      </a>`;
  }).join('');

  const listItems = services.map(svc => `
    <a href="services.html?service=${encodeURIComponent(svc.id)}" class="hub-list-item">
      <span>${SERVICE_TEMPLATES[svc.name] ? SERVICE_TEMPLATES[svc.name].icon : '📁'}</span> ${svc.name}
    </a>`).join('');

  hub.innerHTML = `
    <svg class="hub-lines" viewBox="0 0 100 100">${lines}</svg>
    <div class="hub-center reveal-on-scroll">
      <img src="assets/logo.svg" alt="NRSR & Co">
    </div>
    ${nodeEls}
    <div class="hub-list">${listItems}</div>
  `;
}

/* 12. How We Work — inline scroll-linked process line (not pinned/scroll-jacked) */
/* How We Work — click-to-advance walkthrough. The visitor signs off each
   step by hand rather than watching it auto-play on scroll. */
function initProcessLine() {
  const track = document.getElementById('processTrack');
  const fill = document.getElementById('processFill');
  if (!track || !fill) return;
  const steps = Array.from(track.querySelectorAll('.p-step'));
  if (!steps.length) return;

  steps.forEach((step, idx) => {
    const numEl = step.querySelector('.p-num');
    numEl.dataset.num = numEl.textContent;

    const isLast = idx === steps.length - 1;
    const nextTitle = isLast ? null : steps[idx + 1].querySelector('h4').textContent.trim();

    const teaser = document.createElement('p');
    teaser.className = 'p-teaser';
    teaser.textContent = isLast
      ? "That's the full journey, start to finish."
      : `Curious what happens during ${nextTitle}?`;
    step.appendChild(teaser);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'p-advance';
    btn.textContent = isLast ? "That's a wrap ✓" : `Show me →`;
    step.appendChild(btn);
  });

  // Milestone celebration — a bounce + small particle burst on the
  // just-completed circle, so checking off a step feels like an
  // achievement rather than a silent state flip.
  function celebrateStep(numEl) {
    if (PREFERS_REDUCED_MOTION) return;
    numEl.classList.remove('milestone-pop');
    void numEl.offsetWidth;
    numEl.classList.add('milestone-pop');
    const colors = 6;
    for (let i = 0; i < colors; i++) {
      const p = document.createElement('span');
      p.className = 'milestone-particle';
      const angle = (i / colors) * Math.PI * 2;
      const dist = 26 + Math.random() * 10;
      p.style.setProperty('--mx', `${Math.cos(angle) * dist}px`);
      p.style.setProperty('--my', `${Math.sin(angle) * dist}px`);
      numEl.appendChild(p);
      p.addEventListener('animationend', () => p.remove());
    }
  }

  let current = 0;
  let autoTimer = null;

  function setActive(idx, justCompletedIdx) {
    current = idx;
    steps.forEach((step, i) => {
      step.classList.toggle('active', i === idx);
      const numEl = step.querySelector('.p-num');
      if (i < idx) {
        step.classList.add('done');
        numEl.textContent = '✓';
        if (i === justCompletedIdx) celebrateStep(numEl);
      } else if (i === idx) {
        step.classList.remove('done');
        numEl.textContent = numEl.dataset.num;
      } else {
        step.classList.remove('active', 'done');
        numEl.textContent = numEl.dataset.num;
      }
    });
    // 75% is where the last circle's center actually sits (see the CSS
    // comment on .process-track) — matches the fill to the real geometry
    // instead of overshooting past the final checkmark.
    fill.style.width = (idx / steps.length * 75) + '%';
  }

  function completeStep(idx) {
    if (idx < steps.length - 1) {
      setActive(idx + 1, idx);
    } else {
      // Final step: mark everything done, celebrate it, and fill the line completely.
      current = steps.length;
      steps.forEach((step, i) => {
        step.classList.remove('active');
        step.classList.add('done');
        const numEl = step.querySelector('.p-num');
        numEl.textContent = '✓';
        if (i === idx) celebrateStep(numEl);
      });
      fill.style.width = '75%';
    }
  }

  // Walks through the steps on its own, so a visitor doesn't have to
  // click "Show me" to understand the process — clicking still works and
  // just advances immediately instead of waiting for the timer.
  function scheduleAuto() {
    clearTimeout(autoTimer);
    if (current >= steps.length - 1) return;
    autoTimer = setTimeout(() => {
      completeStep(current);
      scheduleAuto();
    }, 3200);
  }

  steps.forEach((step, idx) => {
    step.querySelector('.p-advance').addEventListener('click', () => {
      completeStep(idx);
      if (!PREFERS_REDUCED_MOTION) scheduleAuto();
    });
  });

  setActive(0);

  if (PREFERS_REDUCED_MOTION) return;

  // Only start the walkthrough once the visitor actually scrolls to it,
  // not the instant the page loads.
  const autoStart = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        scheduleAuto();
        autoStart.disconnect();
      }
    });
  }, { threshold: 0.4 });
  autoStart.observe(track);
}

/* 13. Testimonial Carousel — cycles through all testimonials with dots, arrows & swipe */
/* Renders every testimonial as a flat card in a horizontally-scrollable,
   snap-aligned row — 2-3 cards visible at a time depending on viewport,
   with the rest reachable by scrolling instead of hidden behind a
   one-at-a-time carousel. */
function initTestimonialCarousel(container, testimonials) {
  if (!container || !testimonials.length) return;

  const scrollable = testimonials.length > 2;

  const cardHTML = (t) => `
    <div class="testimonial-card card-hover glow-card">
      <div class="stars">${'★'.repeat(t.rating || 5)}</div>
      <div class="testimonial-text">"${t.review}"</div>
      <div class="testimonial-byline">
        ${t.image ? `
          <div class="testimonial-avatar" style="background:none; overflow:hidden;"><img src="${t.image}" alt="${t.name}" style="width:100%; height:100%; object-fit:cover;"></div>
        ` : `
          <div class="testimonial-avatar">${t.name.charAt(0)}</div>
        `}
        <div>
          <div class="testimonial-author">${t.name}</div>
          <div class="testimonial-role">${t.designation || ''}${t.company ? ' · ' + t.company : ''}${t.date ? ' · ' + t.date : ''}</div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = `
    <div class="testimonial-scroll-wrap">
      ${scrollable ? '<button class="testimonial-scroll-btn prev" aria-label="Scroll testimonials left">‹</button>' : ''}
      <div class="testimonial-scroll-row">
        ${testimonials.map(cardHTML).join('')}
        ${scrollable ? testimonials.map(cardHTML).join('') : ''}
      </div>
      ${scrollable ? '<button class="testimonial-scroll-btn next" aria-label="Scroll testimonials right">›</button>' : ''}
    </div>
  `;

  if (scrollable) {
    const row = container.querySelector('.testimonial-scroll-row');
    const prev = container.querySelector('.testimonial-scroll-btn.prev');
    const next = container.querySelector('.testimonial-scroll-btn.next');

    // Mark the second (duplicated) set of cards as decorative so screen
    // readers and tab order only ever encounter each testimonial once —
    // same seamless-loop trick as the homepage service rail.
    const cards = row.querySelectorAll('.testimonial-card');
    cards.forEach((card, i) => {
      if (i >= testimonials.length) {
        card.setAttribute('aria-hidden', 'true');
        card.querySelectorAll('a, button').forEach(el => el.tabIndex = -1);
      }
    });

    const scrollByCard = (dir) => {
      const card = row.querySelector('.testimonial-card');
      const amount = card ? (card.getBoundingClientRect().width + 20) * dir : 300 * dir;
      row.scrollBy({ left: amount, behavior: PREFERS_REDUCED_MOTION ? 'auto' : 'smooth' });
    };

    if (!PREFERS_REDUCED_MOTION) {
      let hovering = false;
      let interacting = false;
      let resumeTimer = null;
      const pauseBriefly = () => {
        interacting = true;
        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(() => { interacting = false; }, 2200);
      };
      row.addEventListener('mouseenter', () => { hovering = true; });
      row.addEventListener('mouseleave', () => { hovering = false; });
      row.addEventListener('pointerdown', pauseBriefly);
      row.addEventListener('wheel', pauseBriefly, { passive: true });
      row.addEventListener('touchstart', pauseBriefly, { passive: true });
      prev.addEventListener('click', pauseBriefly);
      next.addEventListener('click', pauseBriefly);

      function autoScrollStep() {
        if (!hovering && !interacting) {
          const loopPoint = row.scrollWidth / 2;
          if (loopPoint > 0) {
            row.scrollLeft += 1.4;
            if (row.scrollLeft >= loopPoint) row.scrollLeft -= loopPoint;
          }
        }
        requestAnimationFrame(autoScrollStep);
      }
      requestAnimationFrame(autoScrollStep);
    }

    prev.addEventListener('click', () => scrollByCard(-1));
    next.addEventListener('click', () => scrollByCard(1));
  }

  initGlowEffects();
}
