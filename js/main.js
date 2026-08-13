/* 
   M/s NRSR & Co - Main Client Script (v3.2 Enterprise SEO Engine)
   Handles:
   - Featured Cover Photos rendering for Blogs & Case Studies
   - Schema.org JSON-LD Structured Data Injection for BlogPosting & Article Types
   - Canonical Tags & Social Share Widgets (LinkedIn, Twitter, WhatsApp)
   - Dynamic Breadcrumbs (Home > Category > Title)
   - Team Photos, Page Placement Filtering, SEO Tag Injection
*/

// Registered first (and kept synchronous, independent of gmStore) so the
// disclaimer blocks the page as early as possible on a first visit,
// rather than waiting behind the data fetch below.
document.addEventListener('DOMContentLoaded', initDisclaimerGate);

document.addEventListener('DOMContentLoaded', async () => {
  if (window.gmStore && typeof window.gmStore.loadData === 'function') {
    await window.gmStore.loadData();
  }
  initStickyHeader();
  initMobileMenu();
  initCookieBanner();
  renderDynamicContent();
  initContactForm();
  renderDetailPages();
  initWhatsAppWidget();
  initFooterDisclaimer();
});

/* 0. Mandatory Disclaimer Gate — required under the ICAI Code of Ethics /
   Chartered Accountants Act, 1949 restrictions on solicitation and
   advertising: a first-time visitor must acknowledge that nothing on
   this site is an advertisement or invitation before viewing it. Shown
   once per browser (localStorage), on every page. */
function initDisclaimerGate() {
  if (localStorage.getItem('gm_disclaimer_ack')) return;

  const overlay = document.createElement('div');
  overlay.className = 'disclaimer-gate';
  overlay.innerHTML = `
    <div class="disclaimer-box">
      <h3>Disclaimer</h3>
      <p>As per the provisions of the Chartered Accountants Act, 1949, we are not permitted to solicit work and advertise. By clicking on "Accept & Continue", the user acknowledges that:</p>
      <ul>
        <li>There has been no advertisement, personal communication, invitation or inducement of any sort whatsoever from us or any of our members to solicit any work through this website;</li>
        <li>The user wishes to gain more information about us for his/her own information and use;</li>
        <li>The information about us is provided to the user only on his/her specific request, and any information obtained or materials downloaded from this website is completely at the user's own volition, and any transmission, receipt or use of this website does not constitute solicitation or advertisement.</li>
      </ul>
      <button id="disclaimerAcceptBtn" class="btn btn-primary">Accept & Continue</button>
    </div>
  `;
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  document.getElementById('disclaimerAcceptBtn').addEventListener('click', () => {
    localStorage.setItem('gm_disclaimer_ack', 'true');
    overlay.remove();
    document.body.style.overflow = '';
  });
}

/* 0b. Footer Disclaimer — the same acknowledgement, kept as permanent
   small print at the bottom of every page (not just the one-time gate).
   Collapsed to a single line by default with a click-to-expand toggle,
   so it doesn't sit as a permanent wall of text in the footer. */
function initFooterDisclaimer() {
  const footerBottom = document.querySelector('footer .footer-bottom');
  if (!footerBottom || document.querySelector('.footer-disclaimer')) return;

  const wrap = document.createElement('div');
  wrap.className = 'footer-disclaimer';
  wrap.innerHTML = `
    <button type="button" class="footer-disclaimer-toggle" aria-expanded="false">
      Disclaimer <span class="footer-disclaimer-caret">▾</span>
    </button>
    <p class="footer-disclaimer-text">As per the provisions of the Chartered Accountants Act, 1949, we are not permitted to solicit work and advertise. By viewing this website, the user acknowledges that there has been no advertisement, personal communication, invitation or inducement of any sort whatsoever from us; the user wishes to gain more information about us for his/her own information and use; and the information about us is provided to the user only on his/her specific request.</p>
  `;
  footerBottom.parentElement.insertBefore(wrap, footerBottom);

  const toggle = wrap.querySelector('.footer-disclaimer-toggle');
  toggle.addEventListener('click', () => {
    const expanded = wrap.classList.toggle('expanded');
    toggle.setAttribute('aria-expanded', String(expanded));
  });
}

/* 1. Sticky Header */
function initStickyHeader() {
  const header = document.querySelector('header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll();
}

/* 2. Mobile Navigation with Overlay Backdrop */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  let backdrop = document.querySelector('.mobile-backdrop');

  if (!toggle || !navMenu) return;

  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'mobile-backdrop';
    document.body.appendChild(backdrop);
  }

  const toggleMenu = (open) => {
    if (open) {
      navMenu.classList.add('active');
      toggle.classList.add('open');
      backdrop.classList.add('active');
    } else {
      navMenu.classList.remove('active');
      toggle.classList.remove('open');
      backdrop.classList.remove('active');
    }
  };

  toggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('active');
    toggleMenu(!isOpen);
  });

  backdrop.addEventListener('click', () => toggleMenu(false));
}

/* 3. Cookie Consent Banner */
function initCookieBanner() {
  if (localStorage.getItem('gm_cookie_consent')) return;

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = `
    <p>We use essential cookies to optimize your browsing experience and analyze corporate site traffic. Read our <a href="contact.html">Privacy Policy</a>.</p>
    <button id="acceptCookieBtn" class="btn btn-primary" style="padding: 6px 18px; font-size: 12px; min-height:36px;">Accept & Continue</button>
  `;

  document.body.appendChild(banner);

  document.getElementById('acceptCookieBtn').addEventListener('click', () => {
    localStorage.setItem('gm_cookie_consent', 'true');
    banner.remove();
  });
}

function getCurrentPageName() {
  const path = window.location.pathname.split('/').pop();
  return path || 'index.html';
}

/* 4. Render Dynamic Content from Store */
function renderDynamicContent() {
  if (!window.gmStore) return;
  const currentPage = getCurrentPageName();

  // Team Grid
  const teamContainer = document.getElementById('teamGrid');
  if (teamContainer) {
    const team = window.gmStore.getTeam();
    renderTeamGrid(team, teamContainer);
  }

  // FAQs Accordion (Filtered by Placement Target Page)
  const faqsContainer = document.getElementById('faqsContainer');
  if (faqsContainer) {
    const allFaqs = window.gmStore.getFaqs();
    const pageFaqs = allFaqs.filter(f => !f.placement || f.placement === 'all' || f.placement === currentPage);
    renderFaqsGrid(pageFaqs.length > 0 ? pageFaqs : allFaqs, faqsContainer);
  }

  // Testimonials Carousel (Filtered by Placement Target Page)
  const testimonialsContainer = document.getElementById('testimonialsContainer');
  if (testimonialsContainer) {
    const allTestimonials = window.gmStore.getTestimonials();
    const pageTestimonials = allTestimonials.filter(t => !t.placement || t.placement === 'all' || t.placement === currentPage);
    renderTestimonials(pageTestimonials.length > 0 ? pageTestimonials : allTestimonials, testimonialsContainer);
  }

  // Blogs Grid
  const blogsContainer = document.getElementById('blogsGrid');
  if (blogsContainer) {
    const blogs = window.gmStore.getBlogs();
    renderBlogs(blogs, blogsContainer);
  }

  // Case Studies Grid
  const csContainer = document.getElementById('caseStudiesGrid');
  if (csContainer) {
    const caseStudies = window.gmStore.getCaseStudies();
    renderCaseStudies(caseStudies, csContainer);
  }
}

/* 7. Render Team with Photo */
function renderTeamGrid(team, container) {
  container.innerHTML = team.map((m, i) => `
    <div class="member-card card-hover reveal-on-scroll" style="transition-delay:${(i % 3) * 0.1}s;">
      ${m.image ? `
        <div class="member-avatar reveal-on-scroll reveal-develop" style="background:none; border:2px solid var(--color-primary); overflow:hidden;">
          <img src="${m.image}" alt="${m.name}" style="width:100%; height:100%; object-fit:cover;">
        </div>
      ` : `
        <div class="member-avatar reveal-on-scroll reveal-develop">${m.name.charAt(0)}</div>
      `}
      <h3>${m.name}</h3>
      <div class="member-role">${m.role}</div>
      <div class="member-qual">${m.qualification}</div>
      <div class="member-expertise"><strong>Key Focus:</strong> ${m.expertise}</div>
      <div class="member-bio">${m.bio}</div>
      ${(m.linkedin || m.phone) ? `
        <div class="member-social">
          ${m.linkedin ? `
            <a href="${m.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="${m.name} on LinkedIn" title="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.11 20.45H3.56V9h3.55v11.45z"/></svg>
            </a>
          ` : ''}
          ${m.phone ? `
            <a href="tel:${m.phone.replace(/\s+/g, '')}" aria-label="Call ${m.name}" title="${m.phone}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </a>
          ` : ''}
        </div>
      ` : ''}
    </div>
  `).join('');
}

/* 8. Render FAQs Accordion Dynamic */
function renderFaqsGrid(faqs, container) {
  container.innerHTML = faqs.map((f, index) => `
    <div class="faq-item reveal-on-scroll ${index % 2 ? 'reveal-down' : ''} ${index === 0 ? 'active' : ''}" style="transition-delay:${(index % 4) * 0.08}s;">
      <div class="faq-question">${f.question}</div>
      <div class="faq-answer" style="${index === 0 ? 'max-height: 200px;' : ''}">
        <p>${f.answer}</p>
      </div>
    </div>
  `).join('');

  const items = container.querySelectorAll('.faq-item');
  items.forEach(item => {
    const q = item.querySelector('.faq-question');
    const a = item.querySelector('.faq-answer');

    q.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      items.forEach(i => {
        i.classList.remove('active');
        const ans = i.querySelector('.faq-answer');
        if (ans) ans.style.maxHeight = null;
      });

      if (!isActive && a) {
        item.classList.add('active');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });
}

/* 9. Render Testimonials */
function renderTestimonials(testimonials, container) {
  if (testimonials.length === 0) return;
  if (typeof initTestimonialCarousel === 'function') {
    initTestimonialCarousel(container, testimonials);
    return;
  }
  // Fallback if animations.js hasn't loaded yet
  const t = testimonials[0];
  container.innerHTML = `
    <div class="testimonial-card card-hover">
      <div class="stars">${'★'.repeat(t.rating || 5)}</div>
      <div class="testimonial-text">"${t.review}"</div>
      <div class="testimonial-author">${t.name}</div>
      <div class="testimonial-role">${t.designation} ${t.company ? '• ' + t.company : ''}</div>
    </div>
  `;
}

/* 10. Render Blogs with Featured Cover Photo */
/* Same flat content-card pattern as case studies — one card component
   for any "grid of stories" section, rather than a bespoke style per page. */
function renderBlogs(blogs, container) {
  container.innerHTML = blogs.map((b, i) => `
    <a href="blog-detail.html?slug=${b.slug || b.id}" class="content-card reveal-on-scroll ${i % 2 ? 'reveal-down' : ''}" style="transition-delay:${(i % 3) * 0.08}s;">
      <div class="content-card-top">
        <span class="content-card-client">${b.category}</span>
        <span class="content-card-industry">${b.date}</span>
      </div>
      <h3 class="content-card-headline">${b.title}</h3>
      <p class="content-card-quote" style="font-style:normal;">${b.summary}</p>
      <div class="content-card-footer">
        <div class="content-card-byline">
          <span class="content-card-avatar">${(b.author || 'N').charAt(0)}</span>
          <span>By ${b.author}</span>
        </div>
        <span class="content-card-link">Read Article →</span>
      </div>
    </a>
  `).join('');
}

/* 11. Render Case Studies with Featured Banner Photo */
/* Flat, hairline-bordered case study grid — company/industry as the
   "logo" row, the headline metric standing in for a stat header, quote,
   then an avatar-initial + "Read case study" footer row. */
function renderCaseStudies(caseStudies, container) {
  container.innerHTML = caseStudies.map((c, i) => {
    const headline = c.metrics && c.metrics[0] ? `${c.metrics[0].val} ${c.metrics[0].label}` : c.title;
    const initial = (c.client || c.industry || 'N').charAt(0);
    return `
    <a href="case-study-detail.html?slug=${c.slug || c.id}" class="content-card reveal-on-scroll ${i % 2 ? 'reveal-down' : ''}" style="transition-delay:${(i % 3) * 0.08}s;">
      <div class="content-card-top">
        <span class="content-card-client">${c.client || c.industry}</span>
        <span class="content-card-industry">${c.industry}</span>
      </div>
      <h3 class="content-card-headline">${headline}</h3>
      ${c.quote ? `<p class="content-card-quote">"${c.quote}"</p>` : ''}
      <div class="content-card-footer">
        <div class="content-card-byline">
          <span class="content-card-avatar">${initial}</span>
          <span>${c.industry}</span>
        </div>
        <span class="content-card-link">Read case study →</span>
      </div>
    </a>
  `;
  }).join('');
}

/* 12. Detail Reader Pages Renderer + Enterprise SEO Engine & Schema.org JSON-LD */
function renderDetailPages() {
  const urlParams = new URLSearchParams(window.location.search);
  const idOrSlug = urlParams.get('slug') || urlParams.get('id');

  // BLOG DETAIL READER
  const blogDetailContainer = document.getElementById('blogDetailContent');
  if (blogDetailContainer && window.gmStore) {
    window.gmStore.getBlogDetails(idOrSlug).then(blog => {
      if (blog) {
      const canonicalUrl = `${window.location.origin}${window.location.pathname}?slug=${blog.slug || blog.id}`;

      // Dynamic Meta Tags & Canonical Link
      document.title = `${blog.metaTitle || blog.title} | NRSR & Co`;
      updateMetaTag('description', blog.metaDesc || blog.summary);
      if (blog.metaKeywords) updateMetaTag('keywords', blog.metaKeywords);
      updateMetaTag('og:title', blog.metaTitle || blog.title);
      updateMetaTag('og:description', blog.metaDesc || blog.summary);
      if (blog.image) updateMetaTag('og:image', blog.image);
      updateCanonicalLink(canonicalUrl);

      // Dynamically Inject Schema.org BlogPosting JSON-LD for Google Search
      injectJsonLd({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": blog.title,
        "description": blog.metaDesc || blog.summary,
        "author": { "@type": "Person", "name": blog.author },
        "publisher": { "@type": "Organization", "name": "M/s NRSR & Co", "logo": { "@type": "ImageObject", "url": "https://nrsrcoconsultants.com/assets/logo.svg" } },
        "datePublished": blog.date,
        "mainEntityOfPage": canonicalUrl
      });

      blogDetailContainer.innerHTML = `
        <div style="background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:var(--card-shadow); border:var(--card-border);">
          <!-- Breadcrumb Navigation -->
          <div style="background:var(--bg-alt); padding:14px 48px; border-bottom:1px solid rgba(15,17,20,0.08); font-size:12px; color:var(--text-muted);">
            <a href="index.html">Home</a> &nbsp;›&nbsp; <a href="blogs.html">Insights & Blogs</a> &nbsp;›&nbsp; <span style="color:var(--color-primary); font-weight:600;">${blog.title}</span>
          </div>

          ${blog.image ? `
            <div style="max-height:380px; width:100%; overflow:hidden;">
              <img src="${blog.image}" alt="${blog.title}" style="width:100%; height:100%; object-fit:cover;">
            </div>
          ` : ''}

          <div style="padding:48px;">
            <div class="service-badge" style="font-size:13px;">${blog.category} • ${blog.date} ${blog.readTime ? '• ' + blog.readTime : ''}</div>
            <h1 style="font-size:34px; color:var(--color-slate); margin:16px 0 20px 0; line-height:1.25;">${blog.title}</h1>
            
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; border-bottom:1px solid rgba(15,17,20,0.1); padding-bottom:20px; flex-wrap:wrap; gap:16px;">
              <div style="display:flex; align-items:center; gap:12px;">
                <div style="width:42px; height:42px; border-radius:50%; background:var(--color-primary); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700;">${blog.author.charAt(0)}</div>
                <div>
                  <div style="font-weight:700; font-size:14px; color:var(--color-slate);">${blog.author}</div>
                  <div style="font-size:12px; color:var(--text-muted);">NRSR & Co Advisory Practitioner</div>
                </div>
              </div>

              <!-- Social Share Buttons -->
              <div style="display:flex; gap:10px; align-items:center;">
                <span style="font-size:12px; font-weight:700; color:var(--text-muted);">Share Article:</span>
                <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}" target="_blank" class="btn btn-outline" style="padding:4px 10px; font-size:11px; min-height:30px;">LinkedIn</a>
                <a href="https://wa.me/?text=${encodeURIComponent(blog.title + ' ' + canonicalUrl)}" target="_blank" class="btn btn-outline" style="padding:4px 10px; font-size:11px; min-height:30px; color:#25d366; border-color:#25d366;">WhatsApp</a>
              </div>
            </div>

            <div style="font-size:16px; color:var(--text-main); line-height:1.8; white-space:pre-line;">
              ${formatMarkdownContent(blog.content)}
            </div>

            <div style="margin-top:40px; padding-top:30px; border-top:1px solid rgba(15,17,20,0.1); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px;">
              <div>
                <h4 style="font-size:16px; color:var(--color-slate);">Need Financial or Compliance Advisory?</h4>
                <p style="font-size:13px; color:var(--text-muted); margin:0;">Book a direct consultation with our Chartered Accountants & Tech Leads.</p>
              </div>
              <a href="contact.html" class="btn btn-primary">Schedule Advisory Call →</a>
            </div>
          </div>
        </div>
      `;
      }
    });
  }

  // CASE STUDY DETAIL READER
  const csDetailContainer = document.getElementById('caseStudyDetailContent');
  if (csDetailContainer && window.gmStore) {
    window.gmStore.getCaseStudyDetails(idOrSlug).then(cs => {
      if (cs) {
      const canonicalUrl = `${window.location.origin}${window.location.pathname}?slug=${cs.slug || cs.id}`;

      // Dynamic Meta Tags & Canonical Link
      document.title = `${cs.metaTitle || cs.title} | NRSR & Co Case Study`;
      updateMetaTag('description', cs.metaDesc || cs.summary || cs.challenge);
      if (cs.metaKeywords) updateMetaTag('keywords', cs.metaKeywords);
      updateMetaTag('og:title', cs.metaTitle || cs.title);
      updateMetaTag('og:description', cs.metaDesc || cs.summary);
      if (cs.image) updateMetaTag('og:image', cs.image);
      updateCanonicalLink(canonicalUrl);

      // Dynamically Inject Schema.org Article JSON-LD for Google Search
      injectJsonLd({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": cs.title,
        "description": cs.metaDesc || cs.challenge,
        "author": { "@type": "Organization", "name": "M/s NRSR & Co" },
        "publisher": { "@type": "Organization", "name": "M/s NRSR & Co", "logo": { "@type": "ImageObject", "url": "https://nrsrcoconsultants.com/assets/logo.svg" } },
        "mainEntityOfPage": canonicalUrl
      });

      csDetailContainer.innerHTML = `
        <div style="background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:var(--card-shadow); border:var(--card-border);">
          <!-- Breadcrumb Navigation -->
          <div style="background:var(--bg-alt); padding:14px 48px; border-bottom:1px solid rgba(15,17,20,0.08); font-size:12px; color:var(--text-muted);">
            <a href="index.html">Home</a> &nbsp;›&nbsp; <a href="case-studies.html">Case Studies</a> &nbsp;›&nbsp; <span style="color:var(--color-primary); font-weight:600;">${cs.title}</span>
          </div>

          ${cs.image ? `
            <div style="max-height:380px; width:100%; overflow:hidden;">
              <img src="${cs.image}" alt="${cs.title}" style="width:100%; height:100%; object-fit:cover;">
            </div>
          ` : ''}

          <div style="padding:48px;">
            <div class="service-badge" style="font-size:13px;">${cs.industry}</div>
            <h1 style="font-size:32px; color:var(--color-slate); margin:16px 0 24px 0; line-height:1.25;">${cs.title}</h1>

            ${cs.metrics ? `
              <div style="display:grid; grid-template-columns:repeat(${cs.metrics.length}, 1fr); gap:20px; margin-bottom:40px;">
                ${cs.metrics.map(m => `
                  <div style="background:var(--bg-main); padding:20px; border-radius:12px; border:1px solid rgba(15,17,20,0.15); text-align:center;">
                    <div style="font-size:18px; font-weight:800; color:var(--color-primary);">${m.val}</div>
                    <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">${m.label}</div>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <div style="display:flex; flex-direction:column; gap:28px; font-size:15px; color:var(--text-main); line-height:1.7;">
              <div>
                <h3 style="font-size:20px; color:var(--color-primary-dark); margin-bottom:8px;">Overview</h3>
                <p style="color:var(--text-muted);">${cs.summary || cs.title}</p>
              </div>

              <div>
                <h3 style="font-size:20px; color:var(--color-primary-dark); margin-bottom:8px;">Situation</h3>
                <p style="color:var(--text-muted);">${cs.challenge}</p>
              </div>

              <div>
                <h3 style="font-size:20px; color:var(--color-primary-dark); margin-bottom:8px;">Scope of Work</h3>
                <p style="color:var(--text-muted);">${cs.solution}</p>
              </div>

              ${cs.execution ? `
                <div>
                  <h3 style="font-size:20px; color:var(--color-primary-dark); margin-bottom:8px;">Approach</h3>
                  <p style="color:var(--text-muted);">${cs.execution}</p>
                </div>
              ` : ''}
            </div>

            <div style="margin-top:40px; padding-top:30px; border-top:1px solid rgba(15,17,20,0.1);">
              <a href="contact.html" class="btn btn-primary">Contact Us</a>
            </div>
          </div>
        </div>
      `;
      }
    });
  }
}

function updateMetaTag(name, content) {
  if (!content) return;
  let meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    if (name.startsWith('og:')) meta.setAttribute('property', name);
    else meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function updateCanonicalLink(url) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

function injectJsonLd(data) {
  let script = document.getElementById('dynamicJsonLd');
  if (!script) {
    script = document.createElement('script');
    script.id = 'dynamicJsonLd';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

function formatMarkdownContent(text) {
  if (!text) return '';
  return text
    .replace(/^### (.*$)/gim, '<h3 style="font-size:20px; color:var(--color-slate); margin:24px 0 10px 0;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="font-size:24px; color:var(--color-slate); margin:28px 0 12px 0;">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

/* 13. Contact Form Validation */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('formName').value.trim();
    const email = document.getElementById('formEmail').value.trim();
    const phone = document.getElementById('formPhone').value.trim();
    const message = document.getElementById('formMessage').value.trim();

    // Message is optional: only validate name, email, and phone
    if (!name || !email || !phone) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    // Phone number must be exactly 10 digits
    const phoneDigits = phone.replace(/[^0-9]/g, '');
    if (phoneDigits.length !== 10) {
      showToast('Phone number must contain exactly 10 digits.', 'error');
      return;
    }

    if (!validateEmail(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const origText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting Inquiry...';
    submitBtn.disabled = true;

    const leadData = {
      name: name,
      email: email,
      phone: phone,
      service: document.getElementById('formService')?.value || 'General Inquiry',
      message: message,
      submitted_at: new Date().toISOString()
    };

    const submitUrl = "/submit_lead";

    fetch(submitUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leadData)
    })
    .then(async (res) => {
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }
      showToast('Thank you! Your message has been received by NRSR & Co. We will contact you at ' + phone + ' shortly.', 'success');
      form.reset();
      submitBtn.textContent = origText;
      submitBtn.disabled = false;
    })
    .catch((error) => {
      console.error("Lead submission failed:", error);
      showToast('An error occurred. Please try again later.', 'error');
      submitBtn.textContent = origText;
      submitBtn.disabled = false;
    });
  });
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showToast(msg, type = 'success') {
  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.bottom = '30px';
  toast.style.right = '30px';
  toast.style.padding = '14px 24px';
  toast.style.borderRadius = '8px';
  toast.style.color = '#fff';
  toast.style.fontWeight = '600';
  toast.style.fontSize = '14px';
  toast.style.zIndex = '99999';
  toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
  toast.style.backgroundColor = type === 'success' ? '#059669' : '#e11d48';
  toast.textContent = msg;

  document.body.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 4000);
}

/* 14. Dynamic WhatsApp Widget Routing */
function initWhatsAppWidget() {
  const waButtons = document.querySelectorAll('.floating-whatsapp');
  if (waButtons.length === 0) return;

  waButtons.forEach(btn => {
    btn.removeAttribute('href');
    btn.removeAttribute('target');
    btn.style.cursor = 'pointer';
    
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerWhatsAppAction();
    });
  });
}

function triggerWhatsAppAction() {
  if (!window.gmStore) return;
  const settings = window.gmStore.getSettings();
  const numbers = settings.whatsapp_numbers || [];

  if (numbers.length === 0) {
    // Fallback default number
    window.open('https://wa.me/919108599083?text=Hello%20NRSR%20%26%20Co', '_blank');
    return;
  }

  if (numbers.length === 1) {
    // Direct redirect
    window.open(`https://wa.me/${numbers[0].number}?text=Hello%20NRSR%20%26%20Co,%20I%20would%20like%20to%20inquire%20about%20your%20services.`, '_blank');
    return;
  }

  // Multiple contacts: render floating popup menu card
  let popup = document.getElementById('floatingWaPopup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'floatingWaPopup';
    popup.style.cssText = `
      position: fixed;
      bottom: 90px;
      right: 30px;
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid rgba(15,17,20,0.15);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      width: 280px;
      z-index: 10000;
      padding: 16px;
      font-family: sans-serif;
      display: none;
    `;
    document.body.appendChild(popup);
  }

  popup.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(15,17,20,0.1); padding-bottom:8px; margin-bottom:12px; font-weight:700;">
      <span style="font-weight:700; font-size:13px; color:#1e293b;">Chat with our Advisors</span>
      <button onclick="document.getElementById('floatingWaPopup').style.display='none'" style="background:none; border:none; font-size:18px; cursor:pointer; color:#94a3b8;">&times;</button>
    </div>
    <div style="display:flex; flex-direction:column; gap:8px;">
      ${numbers.map(n => `
        <a href="https://wa.me/${n.number}?text=Hello%20NRSR%20%26%20Co,%20I%20would%20like%20to%20inquire%20about%20your%20services." target="_blank" style="display:flex; align-items:center; gap:10px; background:#f8fafc; padding:10px; border-radius:8px; text-decoration:none; color:#1e293b; transition:background 0.2s;" onmouseover="this.style.background='rgba(15,17,20,0.06)'" onmouseout="this.style.background='#f8fafc'">
          <div style="width:32px; height:32px; border-radius:50%; background:#25d366; display:flex; align-items:center; justify-content:center; color:#fff; font-size:16px;">💬</div>
          <div style="flex:1;">
            <div style="font-size:12px; font-weight:700;">${n.name}</div>
            <div style="font-size:10px; color:#64748b;">Online on WhatsApp</div>
          </div>
        </a>
      `).join('')}
    </div>
  `;

  // Toggle visibility
  popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
}
