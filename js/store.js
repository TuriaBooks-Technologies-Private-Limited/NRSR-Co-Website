/* 
   M/s NRSR & Co - Central State Store (v4.1 Clean Store - No Auth)
   Manages data & localStorage persistence for:
   - Services (16 specialized services)
   - Team Members (with Photo Uploads)
   - FAQs (with Placement Dropdowns)
   - Testimonials (with Placement Dropdowns)
   - Blogs (with Featured Photo Upload, Custom Slugs, Meta SEO & JSON-LD)
   - Case Studies (with Featured Banner Photo Upload, Custom Slugs, Meta SEO & JSON-LD)
   Plus Backup Export & Import (JSON)
*/

// Global Configuration for agency skeleton replication
window.GITHUB_REPOSITORY = 'NRSR-Co/nrsr-website';
window.CLOUDFLARE_TEAM_DOMAIN = 'nrsr-co-trust'; // Cloudflare Zero Trust Team Subdomain
window.API_ENGINE = 'cloudflare';
const GITHUB_REPOSITORY = window.GITHUB_REPOSITORY;

const DEFAULT_SERVICES = [
  {
    id: 'srv-1',
    name: 'Income Tax',
    category: 'Direct Taxation',
    shortDesc: 'Income Tax return filing, 12A/80G Applications, TDS compliance, Appeal Filing, Form 15CA/15CB, and assessments.',
    description: 'Our direct taxation team handles full-scope Income Tax compliance, strategic tax planning, assessments, representations before the ITAT, and complex filings.',
    features: ['Income Tax return filing', '12A/80G Applications', 'TDS & Appeal Filing', 'Form 15CA/15CB', 'Assessments'],
    icon: 'dollar-sign'
  },
  {
    id: 'srv-2',
    name: 'Goods & Service Tax',
    category: 'Indirect Taxation',
    shortDesc: 'GST Registrations, periodic filings, refund tracking, closures, and representation before appellate authorities.',
    description: 'We manage end-to-end Goods & Service Tax (GST) compliance, audit reconciliations, state/national refund processing, and dispute resolution.',
    features: ['GST Registrations', 'GST Closures', 'GST Refunds', 'GST Appeals', 'GST Filings'],
    icon: 'percent'
  },
  {
    id: 'srv-3',
    name: 'Corporate',
    category: 'Corporate Advisory',
    shortDesc: 'Company incorporation, statutory certifications, corporate governance advisory, internal reviews, and company audits.',
    description: 'Comprehensive business advisory and compliance management for corporate entities from incorporation and secretarial audits to strategic management.',
    features: ['Company Incorporation', 'Company Certifications', 'Company Internal Audit', 'Corporate Advisory', 'Company Audits'],
    icon: 'briefcase'
  },
  {
    id: 'srv-4',
    name: 'Partnerships & LLPs',
    category: 'Corporate Advisory',
    shortDesc: 'Structuring partnerships & LLPs, partner retirements/admissions, PAN registration, and deed drafting.',
    description: 'Expert structuring and legal compliance for partnerships and Limited Liability Partnerships, including drafting partnership deeds, registration, and restructuring.',
    features: ['Admit / Retire of Partners', 'Firm PAN Applications', 'Firm Registrations', 'Deed Drafting'],
    icon: 'users'
  },
  {
    id: 'srv-5',
    name: 'Internal Control',
    category: 'Audit & Assurance',
    shortDesc: 'Designing financial SOPs, internal control matrices, operational risk assessments, and transaction due diligence.',
    description: 'We safeguard corporate assets and streamline operational efficacy by establishing Standard Operating Procedures (SOPs) and internal auditing controls.',
    features: ['Internal Control Design', 'Risk Assessment', 'Due Diligence', 'Internal Audit'],
    icon: 'shield'
  },
  {
    id: 'srv-6',
    name: 'Certifications',
    category: 'Audit & Assurance',
    shortDesc: 'Turnover & Net worth certificates, receivable audit certifications, statutory compliance, and RERA certifications.',
    description: 'Independent third-party financial certifications required by banking institutions, government bodies, and regulatory frameworks such as RERA.',
    features: ['Turnover / Networth Certificate', 'Receivable Certifications', 'Compliance Certificate', 'RERA Certifications'],
    icon: 'award'
  },
  {
    id: 'srv-7',
    name: 'Registrations',
    category: 'Corporate Advisory',
    shortDesc: 'Co-Operative Society formation, partnership registrations, MSME certificates, and public/private trust setup.',
    description: 'Securing license and entity registrations for multi-state co-operative societies, MSMEs, small businesses, and charitable/private trusts.',
    features: ['Co-Operative Society Formation', 'Partnership Registration', 'MSME Registrations', 'Trust Formation'],
    icon: 'file-text'
  },
  {
    id: 'srv-8',
    name: 'Financial Accounting',
    category: 'Financial Advisory',
    shortDesc: 'Provisional/projected statement preparation, business viability reports, and detailed project reports for bank financing.',
    description: 'Expert financial drafting including provisional balance sheets, multi-year projected cash flows, CMA data, and viability analyses for growth capital.',
    features: ['Provisional Preparation', 'Projected Preparation', 'Viability Reporting', 'Project Reporting'],
    icon: 'trending-up'
  },
  {
    id: 'srv-9',
    name: 'Audits',
    category: 'Audit & Assurance',
    shortDesc: 'Statutory company audits, tax audits, society & trust audits, and internal operational reviews.',
    description: 'Providing independent, audit-ready reviews under statutory guidelines, including Tax Audits under Section 44AB, company audits, and cooperative trust reviews.',
    features: ['Society & Trust Audits', 'Company Audits', 'Internal Audits', 'Tax Audits'],
    icon: 'clipboard-check'
  }
];

const DEFAULT_TEAM = [
  {
    id: 'team-1',
    name: 'Sandeep',
    role: 'Director / Chartered Accountant',
    category: 'Chartered Accountant',
    qualification: 'CA, B.Com',
    expertise: 'Financial reporting, corporate taxation, statutory compliance, strategic financial advisory, and assurance services.',
    bio: 'Sandeep leads NRSR & Co’s core financial advisory practice. With extensive experience in corporate audits, direct tax litigation, and Virtual CFO engagements, he ensures businesses maintain bulletproof financial health and compliance.',
    image: ''
  },
  {
    id: 'team-2',
    name: 'Niranjan Rao',
    role: 'International Accounting Professional',
    category: 'International Accounting',
    qualification: 'CPA (US Support Specialist), B.Com',
    expertise: 'US GAAP Accounting, Australian Taxation, cross-border financial reconciliations, and global payroll management.',
    bio: 'Niranjan specializes in international accounting standards, bridging compliance for cross-border entities operating across Australia, US, and India.',
    image: ''
  },
  {
    id: 'team-3',
    name: 'Akshay Bhat',
    role: 'Technology & Automation Lead',
    category: 'Technology Consultant',
    qualification: 'B.E. Computer Science, SaaS Architect',
    expertise: 'Business process automation, SaaS implementation, Power BI data analytics, and cloud infrastructure setup.',
    bio: 'Akshay spearheads NRSR & Co’s tech division, transforming manual business processes into automated, cloud-driven digital workflows.',
    image: ''
  },
  {
    id: 'team-4',
    name: 'Hrishikesh',
    role: 'Legal & Direct Tax Expert',
    category: 'Legal & Tax Expert',
    qualification: 'LL.B, Tax Advocate',
    expertise: 'Direct tax litigation support, Transfer Pricing studies, regulatory compliance, and dispute resolution.',
    bio: 'Hrishikesh brings extensive courtroom and tribunal experience, safeguarding corporate clients against complex tax litigations and regulatory audits.',
    image: ''
  },
  {
    id: 'team-5',
    name: 'Swathi Kulal',
    role: 'HR & Admin Head',
    category: 'HR & Admin Expert',
    qualification: 'MBA (HR & Operations)',
    expertise: 'Talent acquisition, organizational structuring, HR policy design, executive administration, and GCC manpower planning.',
    bio: 'Swathi oversees human capital operations, recruitment drives, and administrative management to build agile workplace teams.',
    image: ''
  }
];

const DEFAULT_FAQS = [
  {
    id: 'faq-1',
    question: 'What is a Virtual CFO service and how does it benefit my business?',
    answer: 'A Virtual CFO gives your growing company executive-level financial leadership, cash flow forecasting, working capital optimization, and investor deck preparation at a fraction of the cost of a full-time CFO.',
    placement: 'index.html'
  },
  {
    id: 'faq-2',
    question: 'How does NRSR & Co assist foreign entities setting up Global Capability Centres (GCC) in India?',
    answer: 'We handle turnkey setup: Indian company incorporation, STPI/SEZ filings, Transfer Pricing benchmarking under Rule 10D, and HR talent acquisition in Karnataka.',
    placement: 'all'
  },
  {
    id: 'faq-3',
    question: 'What direct tax litigation support does NRSR & Co offer?',
    answer: 'Our team of Advocates and Chartered Accountants drafts legal submissions, stays high-pitched penalty notices, and represents clients before the Income Tax Appellate Tribunal (ITAT).',
    placement: 'services.html'
  },
  {
    id: 'faq-4',
    question: 'Can you connect Power BI dashboards directly to our Tally or SAP accounting system?',
    answer: 'Yes! Our technology team builds automated API data pipelines linking Tally, Zoho, or SAP directly with interactive Power BI executive dashboards for real-time KPI tracking.',
    placement: 'services.html'
  }
];

const DEFAULT_TESTIMONIALS = [
  {
    id: 'test-1',
    name: 'Rajesh K. Shetty',
    designation: 'Managing Director',
    company: 'Horizon Healthcare Solutions',
    rating: 5,
    review: 'NRSR & Co’s Virtual CFO services completely restructured our finance department. Sandeep and his team optimized our working capital cycles, saving us over ₹35 Lakhs in interest overheads within 8 months.',
    placement: 'index.html'
  },
  {
    id: 'test-2',
    name: 'Elena Rostova',
    designation: 'VP Operations',
    company: 'FinTech Global Inc (US)',
    rating: 5,
    review: 'Niranjan Rao and the international accounting team provided seamless US GAAP accounting and Australian tax compliance support for our GCC setup in Karnataka. Highly recommend their multi-disciplinary expertise!',
    placement: 'team.html'
  },
  {
    id: 'test-3',
    name: 'Vikramaditya Naik',
    designation: 'Founder & CEO',
    company: 'Apex Robotics Pvt Ltd',
    rating: 5,
    review: 'Akshay Bhat automated our entire billing and inventory reconciliation using custom SaaS integrations. What used to take our finance team 4 days a month is now completed in 10 minutes.',
    placement: 'all'
  }
];

const DEFAULT_BLOGS = [
  {
    id: 'blog-1',
    title: 'Why Growing Businesses Are Switching to Virtual CFO Services in 2026',
    slug: 'why-growing-businesses-switch-virtual-cfo-services',
    metaTitle: 'Virtual CFO Services Guide 2026 | NRSR & Co',
    metaDesc: 'Discover how Virtual CFO advisory gives mid-market companies high-level financial strategy, cash flow management, and investor readiness.',
    metaKeywords: 'Virtual CFO, Financial Strategy, Cash Flow Forecasting, Investor Readiness, Manipal CA',
    image: '',
    category: 'Business Advisory',
    author: 'Sandeep (Director)',
    date: '2026-07-15',
    readTime: '6 min read',
    summary: 'Discover how Virtual CFO advisory gives mid-market companies high-level financial strategy, cash flow management, and investor readiness at a fraction of the cost of a full-time executive.',
    content: `### Executive Overview\nIn today’s fast-moving macroeconomic environment, mid-market enterprises face a dual challenge: maintaining strict financial compliance while aggressively managing liquidity for growth. Hiring a full-time Chief Financial Officer (CFO) often incurs annual executive salaries upwards of ₹40–60 Lakhs, a major fixed commitment for growing companies.\n\nVirtual CFO services bridge this exact gap. By partnering with M/s NRSR & Co, companies gain access to senior Chartered Accountants, financial modeling experts, and business analysts who deliver strategic direction, zero-based budgeting, and real-time dashboard analytics.\n\n### Core Deliverables of a Virtual CFO\n\n1. **Granular Cash Flow & Liquidity Forecasting**\n   - Building rolling 12-month cash forecasts to detect working capital bottlenecks before they jeopardize operations.\n   - Managing vendor payment terms and negotiating dynamic early-payment discounts.\n\n2. **Investor & Board Readiness**\n   - Drafting institutional-grade financial models for Equity (Series A/B) or Debt Syndication.\n   - Managing data rooms during investor due diligence, protecting valuation caps.\n\n3. **Line-by-Line Cost Reduction**\n   - Reviewing operational leaks, subscription software costs, and procurement markup.\n   - Implementing zero-based budgeting across departmental heads.\n\n### The ROI Impact\nOur clients typically see a 3x to 5x ROI on Virtual CFO retainer costs within 6 to 9 months, driven by tax optimization, reduced finance charges, and overhead elimination.`
  },
  {
    id: 'blog-2',
    title: 'Navigating Transfer Pricing (TP) Audit Challenges for Global Capability Centres',
    slug: 'transfer-pricing-tp-audit-challenges-gcc-india',
    metaTitle: 'Transfer Pricing Study & Rule 10D Guide | NRSR & Co',
    metaDesc: 'A step-by-step compliance guide for foreign companies setting up Global Capability Centres (GCC) in India to satisfy arm’s-length pricing regulations.',
    metaKeywords: 'Transfer Pricing, Rule 10D, Form 3CEB, GCC Support, ITAT Defense',
    image: '',
    category: 'Finance & Compliance',
    author: 'Hrishikesh',
    date: '2026-07-10',
    readTime: '8 min read',
    summary: 'A step-by-step compliance guide for foreign companies setting up Global Capability Centres (GCC) in India to satisfy arm’s-length pricing regulations.',
    content: `### The Rise of GCCs in India\nGlobal Capability Centres (GCCs) in India have evolved from simple back-office processing units into strategic hubs for software engineering, R&D, and corporate finance. However, Indian Income Tax authorities subject cross-border intra-group transactions to strict Transfer Pricing (TP) audits under Section 92 of the Income Tax Act.\n\n### Key Pillars of Transfer Pricing Compliance\n\n1. **Function, Assets, and Risk (FAR) Analysis**\n   - Thoroughly documenting the precise functional responsibilities, intellectual property assets used, and business risks assumed by the Indian GCC versus its parent entity abroad.\n\n2. **Arm’s-Length Economic Benchmarking**\n   - Selecting comparable domestic Indian entities using authorized databases (such as Prowess and Capitaline) to establish acceptable profit margins (e.g. Cost Plus Markups).\n\n3. **Maintaining Contemporaneous Documentation under Rule 10D**\n   - Ensuring Master File, Local File, and Form 3CEB certifications are filed on time to prevent automatic 2% penalty assessments on transactional values.\n\n### Litigation Defense Strategies\nWhen tax authorities issue Transfer Pricing Order adjustments, NRSR & Co’s direct tax litigation team steps in with detailed precedent analysis before Dispute Resolution Panels (DRP) and the Income Tax Appellate Tribunal (ITAT).`
  },
  {
    id: 'blog-3',
    title: 'Building Real-Time Power BI Executive Dashboards for Financial Decision Making',
    slug: 'power-bi-executive-dashboards-financial-decision-making',
    metaTitle: 'Power BI Financial Dashboards & Automation | NRSR & Co',
    metaDesc: 'How combining ERP data with Business Intelligence dashboards turns raw accounting records into actionable executive insights.',
    metaKeywords: 'Power BI, Financial Dashboards, Business Intelligence, Tally API, SAP Integration',
    image: '',
    category: 'Technology & Automation',
    author: 'Akshay Bhat',
    date: '2026-07-02',
    readTime: '5 min read',
    summary: 'How combining ERP data with Business Intelligence dashboards turns raw accounting records into actionable executive insights.',
    content: `### Moving Beyond Static Monthly Spreadsheets\nRelying solely on delayed month-end PDF balance sheets limits executive agility. C-suite leaders need real-time clarity on revenue run-rates, customer acquisition cost (CAC), gross margin fluctuations, and overdue accounts receivable.\n\n### How Business Intelligence Transforms Finance\nBy building direct API pipelines between accounting ERPs (Tally, SAP, Zoho Books) and Microsoft Power BI, NRSR & Co’s tech team empowers directors with interactive, auto-refreshing visual dashboards.\n\n#### Key Dashboard Widgets We Implement:\n- **Working Capital Health Barometer**: Real-time ratio tracking for current assets vs liabilities.\n- **Customer Concentrated Risk Matrix**: Spotting overdue accounts before they turn into bad debt.\n- **Automated Expense Leakage Alert**: Flagging budget overruns across departments instantly.`
  }
];

const DEFAULT_CASE_STUDIES = [
  {
    id: 'cs-1',
    title: 'Litigation Relief & Income Tax Tribunal Resolution for Electronics Manufacturer',
    slug: 'tax-litigation-relief-itat-resolution-case-study',
    metaTitle: 'Income Tax Tribunal Litigation Case Study | NRSR & Co',
    metaDesc: 'Saved ₹1.4 Crore in direct tax penalties by successfully establishing capital asset tax treatment before ITAT.',
    metaKeywords: 'Direct Tax Litigation, ITAT Tribunal, Tax Penalty Relief, Capital Assets',
    image: '',
    industry: 'Electronics Manufacturing',
    client: 'Precision Tech Components Pvt Ltd',
    summary: 'Saved ₹1.4 Crore in direct tax penalties by successfully establishing capital asset tax treatment before ITAT.',
    challenge: 'The client was hit with a high-pitched tax assessment penalty demand of ₹1.4 Crore following an audit where the Assessing Officer misclassified capital investment deductions as taxable income.',
    solution: 'Hrishikesh & Sandeep conducted an in-depth forensic review of historical plant installation records, drafted comprehensive legal submissions under Section 80IA, and represented the company before the Income Tax Appellate Tribunal (ITAT).',
    execution: 'Constructed an airtight factual trail demonstrating physical commissioning of equipment within statutory cutoff dates, citing High Court precedent judgments.',
    results: '100% of the ₹1.4 Crore penalty demand was set aside by the Tribunal, restoring clean tax compliance status and releasing frozen credit facilities.',
    metrics: [
      { label: 'Tax Penalty Saved', val: '₹1.4 Crore' },
      { label: 'Litigation Timeline', val: 'Resolved in 6 Months' },
      { label: 'Credit Limit Restored', val: '100%' }
    ],
    quote: 'NRSR & Co’s direct tax litigation team defended our company with incredible legal precision before the Tribunal.'
  },
  {
    id: 'cs-2',
    title: 'Turnkey GCC Setup & Transfer Pricing Framework for Australian Software Entity',
    slug: 'gcc-setup-transfer-pricing-framework-case-study',
    metaTitle: 'GCC Setup & Transfer Pricing Case Study | NRSR & Co',
    metaDesc: 'Established a 40-member Global Capability Centre in Manipal, Karnataka with zero regulatory friction and full TP compliance.',
    metaKeywords: 'GCC Setup, Global Capability Centre, Transfer Pricing, Karnataka Expansion',
    image: '',
    industry: 'Information Technology / SaaS',
    client: 'CloudScale Australasia Ltd',
    summary: 'Established a 40-member Global Capability Centre in Manipal, Karnataka with zero regulatory friction and full TP compliance.',
    challenge: 'An Australian SaaS provider wanted to build an offshore Global Capability Centre in Karnataka to house their core R&D team, but lacked local entity registration, transfer pricing benchmarking, and local HR capabilities.',
    solution: 'NRSR & Co provided turnkey execution: entity incorporation in India, STPI approvals, arm’s-length FAR transfer pricing study under Rule 10D, and Swathi Kulal led the specialized talent acquisition drive.',
    execution: 'Set up seamless US/Australian GAAP cross-border reporting pipelines managed by Niranjan Rao, while implementing automated cloud HR & payroll systems.',
    results: 'The GCC became fully operational in under 90 days with 40 full-time engineers and flawless compliance.',
    metrics: [
      { label: 'Operational Setup', val: '85 Days' },
      { label: 'Talent Hired', val: '40 Engineers' },
      { label: 'TP Audit Status', val: 'Zero Notice Audit' }
    ],
    quote: 'NRSR & Co is our trusted India partner. They handled everything from company formation to tax benchmarking flawlessly.'
  }
];

class Store {
  constructor() {
    this.services = null;
    this.team = null;
    this.faqs = null;
    this.blogs = null;
    this.testimonials = null;
    this.caseStudies = null;
    this.init();
  }

  init() {
    if (!localStorage.getItem('gm_services')) localStorage.setItem('gm_services', JSON.stringify(DEFAULT_SERVICES));
    if (!localStorage.getItem('gm_team')) localStorage.setItem('gm_team', JSON.stringify(DEFAULT_TEAM));
    if (!localStorage.getItem('gm_faqs')) localStorage.setItem('gm_faqs', JSON.stringify(DEFAULT_FAQS));
    if (!localStorage.getItem('gm_blogs')) localStorage.setItem('gm_blogs', JSON.stringify(DEFAULT_BLOGS));
    if (!localStorage.getItem('gm_testimonials')) localStorage.setItem('gm_testimonials', JSON.stringify(DEFAULT_TESTIMONIALS));
    if (!localStorage.getItem('gm_case_studies')) localStorage.setItem('gm_case_studies', JSON.stringify(DEFAULT_CASE_STUDIES));
  }

  async loadData() {
    try {
      const [services, team, faqs, blogs, testimonials, caseStudies, settings] = await Promise.all([
        fetch('data/services.json').then(r => r.json()).catch(() => null),
        fetch('data/team.json').then(r => r.json()).catch(() => null),
        fetch('data/faqs.json').then(r => r.json()).catch(() => null),
        fetch('data/blogs-index.json').then(r => r.json()).catch(() => null),
        fetch('data/testimonials.json').then(r => r.json()).catch(() => null),
        fetch('data/case_studies-index.json').then(r => r.json()).catch(() => null),
        fetch('data/settings.json').then(r => r.json()).catch(() => null)
      ]);

      this.services = Array.isArray(services) ? services : (services && services.services ? services.services : null);
      this.team = Array.isArray(team) ? team : (team && team.team ? team.team : null);
      this.faqs = Array.isArray(faqs) ? faqs : (faqs && faqs.faqs ? faqs.faqs : null);
      this.blogs = Array.isArray(blogs) ? blogs : (blogs && blogs.blogs ? blogs.blogs : null);
      this.testimonials = Array.isArray(testimonials) ? testimonials : (testimonials && testimonials.testimonials ? testimonials.testimonials : null);
      this.caseStudies = Array.isArray(caseStudies) ? caseStudies : (caseStudies && caseStudies.case_studies ? caseStudies.case_studies : null);
      this.settings = settings ? settings.settings : null;
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  }

  async verifyRepositoryAccess() {
    let oauthToken = localStorage.getItem('git_oauth_token');
    if (oauthToken === 'undefined' || oauthToken === 'null' || !oauthToken) {
      oauthToken = null;
    }
    // If logged in via Cloudflare Access, verify their session assertion securely via Cloudflare Workers
    if (oauthToken === 'cloudflare_access') {
      try {
        const verifyRes = await fetch('/verify_cf_session');
        if (!verifyRes.ok) {
          throw new Error('Access Denied: Cloudflare Zero Trust authentication is required.');
        }
        const session = await verifyRes.json();
        if (!session.authenticated) {
          throw new Error('Access Denied: Invalid Zero Trust session.');
        }
        console.log('Zero Trust session verified successfully for:', session.email);
        return true;
      } catch (err) {
        console.error('Zero Trust verification failed:', err);
        throw new Error(err.message || 'Access Denied: Zero Trust session verification failed.');
      }
    }
    if (!oauthToken) return true;

    try {
      const res = await fetch(`https://api.github.com/repos/${GITHUB_REPOSITORY}`, {
        headers: { 'Authorization': `token ${oauthToken}` }
      });
      if (!res.ok) {
        throw new Error('Access Denied: You do not have permissions for this repository.');
      }
      const data = await res.json();
      if (!data.permissions || !data.permissions.push) {
        throw new Error('Access Denied: Write permissions are required to manage content.');
      }
      return true;
    } catch (err) {
      console.error('Repository verification failed:', err);
      throw err;
    }
  }

  // Content Getters
  getServices() { return this.services || JSON.parse(localStorage.getItem('gm_services')) || DEFAULT_SERVICES; }
  getTeam() { return this.team || JSON.parse(localStorage.getItem('gm_team')) || DEFAULT_TEAM; }
  getFaqs() { return this.faqs || JSON.parse(localStorage.getItem('gm_faqs')) || DEFAULT_FAQS; }
  getBlogs() { return this.blogs || JSON.parse(localStorage.getItem('gm_blogs')) || DEFAULT_BLOGS; }
  getTestimonials() { return this.testimonials || JSON.parse(localStorage.getItem('gm_testimonials')) || DEFAULT_TESTIMONIALS; }
  getCaseStudies() { return this.caseStudies || JSON.parse(localStorage.getItem('gm_case_studies')) || DEFAULT_CASE_STUDIES; }

  getCloudflareTeamDomain() { return window.CLOUDFLARE_TEAM_DOMAIN || 'white-waterfall-e96f'; }

  getSettings() {
    return this.settings || JSON.parse(localStorage.getItem('gm_settings')) || {
      whatsapp_numbers: [{ name: "Sandeep (Advisory Lead)", number: "9108599083" }],
      erp_api_url: "",
      erp_api_key: ""
    };
  }

  // Individual Detail Loaders for split JSON files
  async getBlogDetails(slugOrId) {
    const indexBlogs = this.getBlogs();
    const meta = indexBlogs.find(b => b.slug === slugOrId || b.id === slugOrId) || indexBlogs[0];
    if (!meta) return null;

    const slug = meta.slug || meta.id;
    try {
      const res = await fetch(`data/blogs/${slug}.json`);
      if (!res.ok) throw new Error('File not found');
      const fullBlog = await res.json();
      return fullBlog;
    } catch (e) {
      console.warn(`Failed to fetch individual blog for ${slug}, falling back to index metadata:`, e);
      return meta;
    }
  }

  async getCaseStudyDetails(slugOrId) {
    const indexCs = this.getCaseStudies();
    const meta = indexCs.find(c => c.slug === slugOrId || c.id === slugOrId) || indexCs[0];
    if (!meta) return null;

    const slug = meta.slug || meta.id;
    try {
      const res = await fetch(`data/case_studies/${slug}.json`);
      if (!res.ok) throw new Error('File not found');
      const fullCs = await res.json();
      return fullCs;
    } catch (e) {
      console.warn(`Failed to fetch individual case study for ${slug}, falling back to index metadata:`, e);
      return meta;
    }
  }

  // Content Setters
  saveSettings(config) {
    this.settings = config;
    localStorage.setItem('gm_settings', JSON.stringify(config));
    this.pushToGit('settings.json', { settings: config });
  }

  saveServices(v) {
    this.services = v;
    localStorage.setItem('gm_services', JSON.stringify(v));
    this.pushToGit('services.json', { services: v });
  }
  saveTeam(v) {
    this.team = v;
    localStorage.setItem('gm_team', JSON.stringify(v));
    this.pushToGit('team.json', { team: v });
  }
  saveFaqs(v) {
    this.faqs = v;
    localStorage.setItem('gm_faqs', JSON.stringify(v));
    this.pushToGit('faqs.json', { faqs: v });
  }
  saveBlogs(v) {
    // 1. Detect and execute deletions
    const oldBlogs = this.blogs || [];
    oldBlogs.forEach(oldBlog => {
      const exists = v.some(newBlog => newBlog.id === oldBlog.id);
      if (!exists) {
        const slug = oldBlog.slug || oldBlog.id;
        this.deleteFromGit(`blogs/${slug}.json`);
      }
    });

    // 2. Push full blogs for additions/edits
    v.forEach(blog => {
      if (blog.content !== undefined) {
        const slug = blog.slug || blog.id;
        this.pushToGit(`blogs/${slug}.json`, blog);
      }
    });

    // 3. Update lightweight index metadata file
    const strippedList = v.map(blog => ({
      id: blog.id,
      title: blog.title,
      slug: blog.slug || blog.id,
      metaTitle: blog.metaTitle,
      metaDesc: blog.metaDesc,
      metaKeywords: blog.metaKeywords,
      image: blog.image,
      category: blog.category,
      author: blog.author,
      date: blog.date,
      readTime: blog.readTime,
      summary: blog.summary
    }));

    this.blogs = strippedList;
    localStorage.setItem('gm_blogs', JSON.stringify(strippedList));
    this.pushToGit('blogs-index.json', { blogs: strippedList });
  }
  saveTestimonials(v) {
    this.testimonials = v;
    localStorage.setItem('gm_testimonials', JSON.stringify(v));
    this.pushToGit('testimonials.json', { testimonials: v });
  }
  saveCaseStudies(v) {
    // 1. Detect and execute deletions
    const oldCs = this.caseStudies || [];
    oldCs.forEach(oldItem => {
      const exists = v.some(newItem => newItem.id === oldItem.id);
      if (!exists) {
        const slug = oldItem.slug || oldItem.id;
        this.deleteFromGit(`case_studies/${slug}.json`);
      }
    });

    // 2. Push full case studies for additions/edits
    v.forEach(cs => {
      if (cs.challenge !== undefined) {
        const slug = cs.slug || cs.id;
        this.pushToGit(`case_studies/${slug}.json`, cs);
      }
    });

    // 3. Update lightweight index metadata file
    const strippedList = v.map(cs => ({
      id: cs.id,
      title: cs.title,
      slug: cs.slug || cs.id,
      metaTitle: cs.metaTitle,
      metaDesc: cs.metaDesc,
      metaKeywords: cs.metaKeywords,
      image: cs.image,
      industry: cs.industry,
      client: cs.client,
      summary: cs.summary,
      metrics: cs.metrics
    }));

    this.caseStudies = strippedList;
    localStorage.setItem('gm_case_studies', JSON.stringify(strippedList));
    this.pushToGit('case_studies-index.json', { case_studies: strippedList });
  }

  // Push JSON updates directly to GitHub via GitHub REST API or Netlify Git Gateway fallback
  async pushToGit(filename, data) {
    // 1. If running on Cloudflare Pages, attempt to save through the serverless endpoint first.
    // This allows Zero Trust users without a GitHub account to save updates using the server-side GITHUB_PAT.
    if (window.API_ENGINE === 'cloudflare') {
      try {
        const cfSaveRes = await fetch('/save_content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: `data/${filename}`,
            content: data,
            message: `cms: update ${filename}`
          })
        });
        if (cfSaveRes.ok) {
          console.log(`Saved ${filename} successfully via Cloudflare Serverless endpoint.`);
          return;
        } else {
          const errData = await cfSaveRes.json().catch(() => ({}));
          console.warn('Cloudflare serverless save failed, falling back to direct API:', errData.error || cfSaveRes.statusText);
        }
      } catch (err) {
        console.warn('Cloudflare serverless save request failed, falling back to direct API:', err);
      }
    }

    let oauthToken = localStorage.getItem('git_oauth_token');
    if (oauthToken === 'undefined' || oauthToken === 'null' || !oauthToken) {
      oauthToken = null;
    }
    
    if (!oauthToken) {
      console.warn('No active auth session. Changes saved locally only.');
      return;
    }

    const url = `https://api.github.com/repos/${GITHUB_REPOSITORY}/contents/data/${filename}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `token ${oauthToken}`
    };
    
    try {
      // 1. Get the current file info to retrieve its SHA hash
      const res = await fetch(url, { headers });
      
      let sha = null;
      if (res.ok) {
        const fileInfo = await res.json();
        sha = fileInfo.sha;
      } else if (res.status !== 404) {
        throw new Error(`Failed to read file metadata for ${filename}. Status: ${res.status}`);
      }
      
      // 2. Safely encode content to UTF-8 Base64
      const jsonString = JSON.stringify(data, null, 2);
      const bytes = new TextEncoder().encode(jsonString);
      const base64 = btoa(String.fromCharCode(...bytes));
      
      // 3. PUT the file back to GitHub
      const putRes = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          message: `cms: update ${filename}`,
          content: base64,
          sha: sha || undefined,
          branch: 'Main'
        })
      });
      
      if (!putRes.ok) {
        throw new Error(`Failed to write file ${filename} to GitHub. Status: ${putRes.status}`);
      }
      
      console.log(`Successfully committed ${filename} to GitHub!`);
    } catch (e) {
      console.error('Error committing to Git:', e);
      alert('Error saving changes to GitHub: ' + e.message);
    }
  }

  // Delete a JSON file in GitHub via GitHub REST API or Netlify Git Gateway fallback
  async deleteFromGit(filename) {
    let oauthToken = localStorage.getItem('git_oauth_token');
    if (oauthToken === 'undefined' || oauthToken === 'null' || !oauthToken) {
      oauthToken = null;
    }
    const netlifyToken = window.netlifyIdentity && window.netlifyIdentity.currentUser()?.token?.access_token;
    
    if (!oauthToken && !netlifyToken) return;

    const useOAuth = !!oauthToken;
    const url = useOAuth
      ? `https://api.github.com/repos/${GITHUB_REPOSITORY}/contents/data/${filename}`
      : `/.netlify/git/github/contents/data/${filename}`;
    
    const headers = {};
    if (useOAuth) {
      headers['Authorization'] = `token ${oauthToken}`;
    } else {
      headers['Authorization'] = `Bearer ${netlifyToken}`;
    }

    try {
      const res = await fetch(url, { headers });
      if (!res.ok) return; // File already deleted or doesn't exist
      
      const fileInfo = await res.json();
      const sha = fileInfo.sha;

      const delRes = await fetch(url, {
        method: 'DELETE',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `cms: delete ${filename}`,
          sha: sha,
          branch: 'Main'
        })
      });

      if (!delRes.ok) {
        throw new Error(`Delete failed with status: ${delRes.status}`);
      }
      console.log(`Successfully deleted ${filename} from GitHub!`);
    } catch (e) {
      console.warn(`Failed to delete ${filename} from Git:`, e);
    }
  }

  // Services CRUD
  addService(s) { const list = this.getServices(); s.id = 'srv-' + Date.now(); list.push(s); this.saveServices(list); }
  updateService(s) { const list = this.getServices().map(item => item.id === s.id ? s : item); this.saveServices(list); }
  deleteService(id) { const list = this.getServices().filter(s => s.id !== id); this.saveServices(list); }

  // Team CRUD
  addTeamMember(m) { const list = this.getTeam(); m.id = 'team-' + Date.now(); list.push(m); this.saveTeam(list); }
  updateTeamMember(m) { const list = this.getTeam().map(item => item.id === m.id ? m : item); this.saveTeam(list); }
  deleteTeamMember(id) { const list = this.getTeam().filter(m => m.id !== id); this.saveTeam(list); }

  // FAQs CRUD
  addFaq(f) { const list = this.getFaqs(); f.id = 'faq-' + Date.now(); list.push(f); this.saveFaqs(list); }
  updateFaq(f) { const list = this.getFaqs().map(item => item.id === f.id ? f : item); this.saveFaqs(list); }
  deleteFaq(id) { const list = this.getFaqs().filter(f => f.id !== id); this.saveFaqs(list); }

  // Blogs CRUD
  addBlog(b) { const list = this.getBlogs(); b.id = 'blog-' + Date.now(); list.unshift(b); this.saveBlogs(list); }
  updateBlog(b) { const list = this.getBlogs().map(item => item.id === b.id ? b : item); this.saveBlogs(list); }
  deleteBlog(id) { const list = this.getBlogs().filter(b => b.id !== id); this.saveBlogs(list); }

  // Testimonials CRUD
  addTestimonial(t) { const list = this.getTestimonials(); t.id = 'test-' + Date.now(); list.unshift(t); this.saveTestimonials(list); }
  updateTestimonial(t) { const list = this.getTestimonials().map(item => item.id === t.id ? t : item); this.saveTestimonials(list); }
  deleteTestimonial(id) { const list = this.getTestimonials().filter(t => t.id !== id); this.saveTestimonials(list); }

  // Case Studies CRUD
  addCaseStudy(c) { const list = this.getCaseStudies(); c.id = 'cs-' + Date.now(); list.unshift(c); this.saveCaseStudies(list); }
  updateCaseStudy(c) { const list = this.getCaseStudies().map(item => item.id === c.id ? c : item); this.saveCaseStudies(list); }
  deleteCaseStudy(id) { const list = this.getCaseStudies().filter(c => c.id !== id); this.saveCaseStudies(list); }

  // Export / Import Data
  exportData() {
    return JSON.stringify({
      services: this.getServices(),
      team: this.getTeam(),
      faqs: this.getFaqs(),
      blogs: this.getBlogs(),
      testimonials: this.getTestimonials(),
      caseStudies: this.getCaseStudies(),
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  importData(json) {
    try {
      const p = JSON.parse(json);
      if (p.services) this.saveServices(p.services);
      if (p.team) this.saveTeam(p.team);
      if (p.faqs) this.saveFaqs(p.faqs);
      if (p.blogs) this.saveBlogs(p.blogs);
      if (p.testimonials) this.saveTestimonials(p.testimonials);
      if (p.caseStudies) this.saveCaseStudies(p.caseStudies);
      return true;
    } catch (e) {
      return false;
    }
  }
}

window.gmStore = new Store();
