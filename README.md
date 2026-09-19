# M/s NRSR & Co — Official Website & Headless CMS

> Modern, high-performance static website (Astro 5 SSG) with serverless Cloudflare Workers, real-time Headless CMS, and GitOps database for **M/s NRSR & Co (Chartered Accountants)**.

---

## 1. What is this Project?

This repository contains the complete production website and Content Management System (CMS) for **M/s NRSR & Co** — an established Chartered Accountancy firm (Est. 2019, ICAI Peer Reviewed & ISO 9001:2015 Certified) operating in **Manipal HQ** and **Bengaluru**.

### Key Architectural Pillars:
- **Zero Server Latency (Astro 5 SSG)**: Pre-rendered static pages hosted on Cloudflare's global edge network.
- **Dynamic Headless CMS (`/admin`)**: Practice managers can add/edit team members, post job vacancies, publish blogs, upload gallery photos, and update services without touching code.
- **GitOps Single Source of Truth**: All website content lives in structured JSON files under `src/data/`.
- **Zero-Trust Serverless API (`/functions`)**: Cloudflare Pages Workers handle CMS commits (`/save_content`), client leads/job applications (`/submit_lead`), and GitHub API proxying (`/github_proxy`).

---

## 2. Why this Architecture?

| Traditional Dynamic CMS (WordPress/PHP) | NRSR & Co Headless GitOps Architecture |
| :--- | :--- |
| Vulnerable to SQL injection & database hacks | **100% Static HTML** — zero database attack surface |
| Slow server response times (500ms – 2s) | **Sub-50ms TTFB** via Cloudflare Global CDN |
| Server hosting costs & maintenance overhead | **Zero infrastructure maintenance** on Cloudflare Pages |
| CMS edits can break database schemas | **Version-controlled JSON database** in Git with rollback history |

---

## 3. How It Works (End-to-End Data Flow)

### A. Publishing Updates from Admin (`/admin`)
1. Practice administrator navigates to `https://nrsrandco.com/admin`.
2. Edits or adds any data (Team Member, Career Opening, Service, Blog, FAQ, Testimonial, or Global Settings).
3. The Admin panel sends the update to `/save_content`.
4. The Cloudflare Pages Worker commits the updated JSON file directly to `src/data/[module].json` in the GitHub repository (`main` branch) using the secure server-side `GITHUB_PAT`.
5. Cloudflare Pages automatically detects the Git commit, runs `npm run build`, and redeploys the updated static website globally in ~30–45 seconds.

### B. Inbound Leads & Career Applications
1. A prospective client or job applicant fills out the form on `/contact` or `/careers`.
2. The form posts the data to `/submit_lead`.
3. The worker creates a new lead entry in `src/data/leads/lead-[timestamp].json` on GitHub.
4. If configured in `settings.json`, an instant email alert is dispatched to `info@nrsrandco.com` (via Google Apps Script / SMTP), and client details are synced to the ERP API.
5. Inquiries appear immediately in `/admin` under **Contact Leads**.

---

## 4. Project Structure

```
├── functions/                    # Cloudflare Pages Serverless Functions
│   ├── save_content.js           # Secure Git committer for CMS updates
│   ├── submit_lead.js            # Inbound contact inquiries & job applications
│   ├── github_proxy.js           # Server-side GitHub API gateway
│   └── verify_cf_session.js      # Cloudflare Access token validator
│
├── public/                       # Static public assets
│   ├── assets/                   # Vector logos, SVGs, and graphics
│   ├── js/                       # Client-side CMS & interaction scripts
│   │   ├── admin.js              # Admin Dashboard controller
│   │   ├── store.js              # Data store & Git synchronization
│   │   ├── main.js               # Mobile nav, forms, modals & interactions
│   │   ├── animations.js         # Interactive diagrams & charts
│   │   └── icons.js              # Vector SVG icon library
│   ├── llms.txt                  # LLM / AI crawler knowledge summary
│   └── llms-full.txt             # Full practice area documentation for AI
│
├── src/
│   ├── components/               # Reusable Astro UI components
│   │   ├── Header.astro          # Dual-tier corporate navigation suite
│   │   ├── Footer.astro          # Comprehensive footer with NAP & portals
│   │   ├── Icon.astro            # Stroke-aware pure vector SVG engine
│   │   └── ...                   # Cards, badges, modals & disclaimers
│   ├── data/                     # CANONICAL CONTENT SINGLE SOURCE OF TRUTH
│   │   ├── services.json         # 16 Specialized practice areas
│   │   ├── team.json             # Practice leaders & staff profiles
│   │   ├── careers.json          # Open job positions & qualifications
│   │   ├── blogs/ & blogs-index  # SEO blog articles & metadata
│   │   ├── case_studies/         # Client success case studies
│   │   ├── gallery.json          # Office & event media gallery
│   │   ├── faqs.json             # Practice FAQs with placement tags
│   │   ├── testimonials.json     # Client reviews & star ratings
│   │   ├── links.json            # Government portals & useful tools
│   │   ├── settings.json         # Firm NAP, branches, WhatsApp & credentials
│   │   └── leads/                # Inbound contact & career inquiries
│   ├── layouts/
│   │   └── Layout.astro          # Global HTML shell, SEO & Schema.org JSON-LD
│   └── pages/                    # 22 Static routes (Home, About, Services, etc.)
│
├── astro.config.mjs              # Astro SSG build configuration
└── package.json                  # Build, check, and data-sync scripts
```

---

## 5. Development & Deployment

### Quick Start
```bash
# Install dependencies
npm install

# Start local dev server (auto-syncs data & launches on http://localhost:3000)
npm run dev

# Run ASTRO code & JS AST syntax check
npm run check

# Build production bundle
npm run build
```

### Cloudflare Pages Production Configuration
Under **Settings > Builds & deployments**:
- **Framework preset**: `Astro`
- **Build command**: `npm run build`
- **Build output directory**: `dist`

Under **Settings > Environment variables**:
- `NODE_VERSION` = `20`
- `GITHUB_PAT` = `<YOUR_GITHUB_PERSONAL_ACCESS_TOKEN>`
- `GITHUB_REPO` = `cashrinidhirao19-code/website`

---

## 6. License & Ownership
Copyright © 2019–2026 **M/s NRSR & Co (Chartered Accountants)**. All rights reserved.
