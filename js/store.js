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
  },
  {
    id: 'srv-10',
    name: 'Valuation',
    category: 'Valuation Advisory',
    shortDesc: 'Business valuation, share valuation, ESOP valuation, and fair value assessments for regulatory, transactional, and litigation purposes.',
    description: 'Our valuation practice delivers independent, defensible valuations for businesses, equity, intangibles, and financial instruments — supporting M&A transactions, ESOP schemes, regulatory filings, and dispute resolution.',
    features: ['Business Enterprise Valuation', 'Share & Equity Valuation', 'ESOP / Sweat Equity Valuation', 'Intangible Asset Valuation', 'Fairness Opinion Reports'],
    icon: 'bar-chart-2'
  }
];

const DEFAULT_TEAM = [
  {
    id: "team-1",
    name: "CA Shrinidhi Rao",
    role: "Managing Partner",
    category: "Chartered Accountant",
    qualification: "B.Com, ACA",
    expertise: "Overall practice leadership, statutory audit, corporate taxation, and strategic client advisory.",
    bio: "Shrinidhi leads NRSR & Co's practice, overseeing audit, taxation, and advisory engagements to ensure every client relationship is backed by sound, compliant financial guidance.",
    image: ""
  },
  {
    id: "team-2",
    name: "CA Swetha SV",
    role: "Partner",
    category: "Chartered Accountant",
    qualification: "B.Com, M.Com, ACA, DISA (ICAI), RV-SFA (IBBI)",
    expertise: "Statutory audit, information systems audit, and registered valuation of securities and financial assets.",
    bio: "Swetha brings a rare combination of audit, IT-systems assurance, and valuation credentials to the firm's advisory and assurance practice.",
    image: ""
  },
  {
    id: "team-3",
    name: "CA Karthik",
    role: "Corporate Accounts Manager",
    category: "Chartered Accountant",
    qualification: "B.Com, ACA",
    expertise: "Corporate accounting, financial reporting, and day-to-day management of client account books.",
    bio: "Karthik manages the firm's corporate accounting engagements, keeping client books accurate, current, and audit-ready.",
    image: ""
  },
  {
    id: "team-4",
    name: "Akshay Bhat",
    role: "Assurance Manager",
    category: "Assurance",
    qualification: "B.Com",
    expertise: "Audit execution, assurance engagements, and compliance verification across client portfolios.",
    bio: "Akshay oversees assurance engagements end to end, working closely with clients to close audits on time and without surprises.",
    image: ""
  },
  {
    id: "team-5",
    name: "Swathi Kulal",
    role: "Compliance Manager",
    category: "Compliance",
    qualification: "BBA",
    expertise: "Regulatory compliance tracking, filings management, and client compliance calendars.",
    bio: "Swathi keeps every client's statutory and regulatory compliance on schedule, from filings to renewals.",
    image: ""
  },
  {
    id: "team-6",
    name: "Chaithra Karanth",
    role: "Admin & HR",
    category: "Admin & HR",
    qualification: "BBA",
    expertise: "Practice administration, HR operations, and client coordination.",
    bio: "Chaithra runs the firm's day-to-day administration and HR operations, keeping the practice organized and client communication smooth.",
    image: ""
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
    review: 'NRSR & Co’s Virtual CFO services completely restructured our finance department. The team optimized our working capital cycles, saving us over ₹35 Lakhs in interest overheads within 8 months.',
    placement: 'index.html'
  },
  {
    id: 'test-2',
    name: 'Deepak B',
    designation: 'Google Review',
    company: '',
    rating: 5,
    review: 'Shrinidi and team have helped me file Income tax returns for past few years. They are very approachable and have always answered all my questions in a timely manner. Very happy with the service provided. Best wishes to the team!',
    placement: 'all'
  },
  {
    id: 'test-3',
    name: 'Prajwal Shenoy',
    designation: 'Google Review',
    company: '',
    rating: 5,
    review: 'Superb service. Wanted to file revised ITR with only 5 days remaining and they did a splendid job. I will be using their services henceforth every year. Highly recommended.',
    placement: 'all'
  },
  {
    id: 'test-4',
    name: 'Harshitha Sharath',
    designation: 'Google Review',
    company: '',
    rating: 5,
    review: 'Must say CA Swetha and team is very friendly, professional and knowledgeable team. I got my service done so quickly in no time. Would highly recommend anyone and everyone to NRSR & Co.',
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

const DEFAULT_CAREERS = [
  {
    id: 'job-1',
    title: 'Audit Senior / Semi-Qualified CA',
    department: 'Audit & Assurance',
    location: 'Manipal / Bengaluru',
    type: 'Full-Time',
    experience: '2-4 Years',
    shortDesc: 'Lead statutory audit engagements, internal control reviews, and company compliance audits.',
    description: 'We are seeking a proactive Semi-Qualified CA or experienced Audit Senior to oversee statutory audits, tax audits (Sec 44AB), and internal financial controls for corporate and SME clients.',
    requirements: [
      'CA Inter / Semi-Qualified or M.Com with audit firm experience',
      'Strong working knowledge of TallyPrime, Zoho Books, and Excel',
      'Familiarity with Indian Accounting Standards and Companies Act 2013',
      'Ability to lead junior articled assistants and manage client communications'
    ],
    status: 'Active'
  },
  {
    id: 'job-2',
    title: 'Articled Assistant (CA Articleship)',
    department: 'Tax & Compliance',
    location: 'Manipal / Bengaluru',
    type: 'Articleship (ICAI)',
    experience: 'Fresher / IPCC Cleared',
    shortDesc: 'Hands-on ICAI articleship training across Direct Tax, GST, Statutory Audits, and ROC Filings.',
    description: 'Join our comprehensive 2/3-year ICAI articleship program gaining multi-disciplinary exposure in ITR filing, GST returns, MCA21 corporate filings, and bank concurrent audits.',
    requirements: [
      'Cleared CA Intermediate / IPCC (Single or Both Groups)',
      'Strong fundamentals in accounting, taxation, and auditing',
      'Eagerness to learn cloud accounting and business advisory tools',
      'Good communication and team collaboration skills'
    ],
    status: 'Active'
  },
  {
    id: 'job-3',
    title: 'GST & Direct Tax Executive',
    department: 'Tax Advisory',
    location: 'Manipal / Bengaluru',
    type: 'Full-Time',
    experience: '1-3 Years',
    shortDesc: 'Manage monthly GSTR-1, GSTR-3B, TDS quarterly returns, and advance tax computations.',
    description: 'Manage day-to-day tax compliance including monthly GST returns, reconciliation of 2B vs purchase registers, TDS return preparation, and IT return draftings for varied client verticals.',
    requirements: [
      'B.Com / M.Com / MBA Finance',
      '1+ years experience in a CA firm or corporate tax department',
      'Hands-on expertise in GST portal, TRACES, and Income Tax e-filing portal',
      'Attention to detail and timely adherence to statutory cut-offs'
    ],
    status: 'Active'
  }
];

const DEFAULT_GALLERY = [
  {
    id: 'gal-1',
    title: 'NRSR & Co Headquarters — Manipal',
    category: 'Office',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    caption: 'Our primary corporate office at Union Bank Building, Tiger Circle, Manipal.',
    date: '2026-01-15'
  },
  {
    id: 'gal-2',
    title: 'Annual Team Strategy & CPD Seminar',
    category: 'Events',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    caption: 'Continuous professional development workshop on Union Budget and Tax Updates.',
    date: '2026-02-10'
  },
  {
    id: 'gal-3',
    title: 'Client Advisory & Corporate Consultation',
    category: 'Team',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    caption: 'Corporate restructuring and valuation advisory session in progress.',
    date: '2026-03-01'
  },
  {
    id: 'gal-4',
    title: 'ICAI Peer Review & Quality Certification',
    category: 'Certifications',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
    caption: 'Recognition of rigorous quality control frameworks and adherence to ICAI standards.',
    date: '2026-04-20'
  }
];

const DEFAULT_LINKS = [
  {
    id: 'link-1',
    title: 'Income Tax e-Filing Portal',
    category: 'Government Portals',
    url: 'https://www.incometax.gov.in',
    description: 'Official Income Tax Department e-filing portal for ITR, 26AS, AIS/TIS, and e-Verification.',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="22" x2="21" y2="22"></line><line x1="6" y1="18" x2="6" y2="11"></line><line x1="10" y1="18" x2="10" y2="11"></line><line x1="14" y1="18" x2="14" y2="11"></line><line x1="18" y1="18" x2="18" y2="11"></line><polygon points="12 2 20 7 4 7 12 2"></polygon></svg>`,
    badge: 'Tax Portal'
  },
  {
    id: 'link-2',
    title: 'Goods & Services Tax (GST) Portal',
    category: 'Government Portals',
    url: 'https://www.gst.gov.in',
    description: 'National GST portal for monthly return filing, GSTR-2B reconciliations, and registrations.',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`,
    badge: 'GST Portal'
  },
  {
    id: 'link-3',
    title: 'Ministry of Corporate Affairs (MCA21 V3)',
    category: 'Government Portals',
    url: 'https://www.mca.gov.in',
    description: 'MCA21 portal for company & LLP incorporations, DIN KYC, and annual ROC statutory filings.',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line><line x1="2" y1="20" x2="22" y2="20"></line><line x1="14" y1="4" x2="10" y2="4"></line></svg>`,
    badge: 'Corporate Portal'
  },
  {
    id: 'link-4',
    title: 'ICAI Official Portal',
    category: 'Regulatory',
    url: 'https://www.icai.org',
    description: 'Institute of Chartered Accountants of India - accounting standards, notifications & guidance.',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>`,
    badge: 'ICAI Portal'
  },
  {
    id: 'link-5',
    title: 'Live Support & Chatbot Assistant',
    category: 'Client Support',
    url: 'https://dashboard.tawk.to/#/dashboard/6011a916c31c9117cb73225c',
    description: 'Instant live support chat with NRSR & Co compliance and client advisory desk.',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
    badge: 'Live Chat'
  },
  {
    id: 'link-6',
    title: 'Client WhatsApp Advisory Desk',
    category: 'Client Support',
    url: 'https://wa.me/919108599083?text=Hello%20NRSR%20%26%20Co,%20I%20would%20like%20to%20inquire%20about%20your%20services.',
    description: 'Direct WhatsApp hotline with our senior advisory team for queries and status tracking.',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
    badge: 'WhatsApp Hotline'
  }
];

// ─── Data Version Guard ───────────────────────────────────────────────────────
// Bump this string whenever the firm's content or data schema changes.
// Any browser whose stored version doesn't match gets its cache wiped and
// rewritten with the correct NRSR & Co defaults — eliminating ghost/stale
// data left over from previous template projects (Green Monk, Sandeep Advisory).
const DATA_VERSION = 'nrsr-v3';

class Store {
  constructor() {
    this.services = null;
    this.team = null;
    this.faqs = null;
    this.blogs = null;
    this.testimonials = null;
    this.caseStudies = null;
    this.careers = null;
    this.gallery = null;
    this.links = null;
    this.init();
  }

  init() {
    // ── Version check: if the stored version doesn't match, flush everything ──
    const storedVersion = localStorage.getItem('gm_data_version');
    if (storedVersion !== DATA_VERSION) {
      // Wipe all keys that belong to this CMS so stale data from
      // any previous project can never pollute this site.
      ['gm_services', 'gm_team', 'gm_faqs', 'gm_blogs',
       'gm_testimonials', 'gm_case_studies', 'gm_careers', 'gm_gallery', 'gm_links', 'gm_settings'].forEach(k => localStorage.removeItem(k));
      localStorage.setItem('gm_data_version', DATA_VERSION);
      console.info('[Store] Data version mismatch — cache flushed and reset to NRSR & Co defaults.');
    }

    // ── Seed defaults if a key is still absent after the version flush ────────
    if (!localStorage.getItem('gm_services'))     localStorage.setItem('gm_services',     JSON.stringify(DEFAULT_SERVICES));
    if (!localStorage.getItem('gm_team'))          localStorage.setItem('gm_team',          JSON.stringify(DEFAULT_TEAM));
    if (!localStorage.getItem('gm_faqs'))          localStorage.setItem('gm_faqs',          JSON.stringify(DEFAULT_FAQS));
    if (!localStorage.getItem('gm_blogs'))         localStorage.setItem('gm_blogs',         JSON.stringify(DEFAULT_BLOGS));
    if (!localStorage.getItem('gm_testimonials'))  localStorage.setItem('gm_testimonials',  JSON.stringify(DEFAULT_TESTIMONIALS));
    if (!localStorage.getItem('gm_case_studies'))  localStorage.setItem('gm_case_studies',  JSON.stringify(DEFAULT_CASE_STUDIES));
    if (!localStorage.getItem('gm_careers'))       localStorage.setItem('gm_careers',       JSON.stringify(DEFAULT_CAREERS));
    if (!localStorage.getItem('gm_gallery'))       localStorage.setItem('gm_gallery',       JSON.stringify(DEFAULT_GALLERY));
    if (!localStorage.getItem('gm_links'))         localStorage.setItem('gm_links',         JSON.stringify(DEFAULT_LINKS));
  }

  async loadData() {
    // ── Idempotent: return the same in-flight (or resolved) Promise if
    //    called more than once (e.g. both main.js and animations.js call it).
    //    This prevents double-fetching data files on every page load.
    if (this._loadPromise) return this._loadPromise;

    this._loadPromise = (async () => {
      try {
        const [services, team, faqs, blogs, testimonials, caseStudies, careers, gallery, links, settings] = await Promise.all([
          fetch('/data/services.json').then(r => r.json()).catch(() => null),
          fetch('/data/team.json').then(r => r.json()).catch(() => null),
          fetch('/data/faqs.json').then(r => r.json()).catch(() => null),
          fetch('/data/blogs-index.json').then(r => r.json()).catch(() => null),
          fetch('/data/testimonials.json').then(r => r.json()).catch(() => null),
          fetch('/data/case_studies-index.json').then(r => r.json()).catch(() => null),
          fetch('/data/careers.json').then(r => r.json()).catch(() => null),
          fetch('/data/gallery.json').then(r => r.json()).catch(() => null),
          fetch('/data/links.json').then(r => r.json()).catch(() => null),
          fetch('/data/settings.json').then(r => r.json()).catch(() => null)
        ]);

        this.services    = Array.isArray(services)      ? services      : (services      && services.services           ? services.services           : null);
        this.team        = Array.isArray(team)           ? team          : (team          && team.team                   ? team.team                   : null);
        this.faqs        = Array.isArray(faqs)           ? faqs          : (faqs          && faqs.faqs                   ? faqs.faqs                   : null);
        this.blogs       = Array.isArray(blogs)          ? blogs         : (blogs         && blogs.blogs                 ? blogs.blogs                 : null);
        this.testimonials= Array.isArray(testimonials)   ? testimonials  : (testimonials  && testimonials.testimonials   ? testimonials.testimonials   : null);
        this.caseStudies = Array.isArray(caseStudies)    ? caseStudies   : (caseStudies   && caseStudies.case_studies    ? caseStudies.case_studies    : null);
        this.careers     = Array.isArray(careers)        ? careers       : (careers       && careers.careers             ? careers.careers             : null);
        this.gallery     = Array.isArray(gallery)        ? gallery       : (gallery       && gallery.gallery             ? gallery.gallery             : null);
        this.links       = Array.isArray(links)          ? links         : (links         && links.links                 ? links.links                 : null);
        this.settings    = settings ? settings.settings : null;
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    })();

    return this._loadPromise;
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
  getCareers() { return this.careers || JSON.parse(localStorage.getItem('gm_careers')) || DEFAULT_CAREERS; }
  getGallery() { return this.gallery || JSON.parse(localStorage.getItem('gm_gallery')) || DEFAULT_GALLERY; }
  getLinks() { return this.links || JSON.parse(localStorage.getItem('gm_links')) || DEFAULT_LINKS; }

  getCloudflareTeamDomain() { return window.CLOUDFLARE_TEAM_DOMAIN || 'white-waterfall-e96f'; }

  getSettings() {
    return this.settings || JSON.parse(localStorage.getItem('gm_settings')) || {
      firm_name: "M/s NRSR & Co",
      firm_subtitle: "Chartered Accountants",
      firm_email: "info@nrsrandco.com",
      firm_phone: "+91 7760485737",
      hq_phone: "+91 7760485737 / +91 6360523673",
      branch_phone: "+91 8867531151 / +91 7829809690",
      whatsapp_numbers: [
        { name: "Manipal Office", number: "917760485737" },
        { name: "Bengaluru Office", number: "918867531151" }
      ],
      hq_address: "'Gokula', 1st Floor, Union Bank Building, Opp. Green Park Hotel, Near Tiger Circle, Manipal - 576104",
      branch_address: "17/106, 3rd Cross, LG Ramanna Extension, Laggere, Bengaluru, Karnataka - 560058",
      working_hours: "Mon - Sat: 9:00 AM - 8:00 PM (Sunday Closed)",
      established_year: "2019",
      peer_reviewed: true,
      iso_certified: true,
      erp_api_url: "",
      erp_api_key: "",
      tawk_property_id: "6011a916c31c9117cb73225c",
      tawk_widget_id: "1et2fp10u",
      client_login_url: "https://practice.turia.in/login",
      employee_login_url: "https://practice.turia.in/login"
    };
  }

  // Individual Detail Loaders for split JSON files
  async getBlogDetails(slugOrId) {
    const indexBlogs = this.getBlogs();
    const meta = indexBlogs.find(b => b.slug === slugOrId || b.id === slugOrId) || indexBlogs[0];
    if (!meta) return null;

    const slug = meta.slug || meta.id;
    try {
      const res = await fetch(`/data/blogs/${slug}.json`);
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
      const res = await fetch(`/data/case_studies/${slug}.json`);
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
  saveCareers(v) {
    this.careers = v;
    localStorage.setItem('gm_careers', JSON.stringify(v));
    this.pushToGit('careers.json', { careers: v });
  }
  saveGallery(v) {
    this.gallery = v;
    localStorage.setItem('gm_gallery', JSON.stringify(v));
    this.pushToGit('gallery.json', { gallery: v });
  }
  saveLinks(v) {
    this.links = v;
    localStorage.setItem('gm_links', JSON.stringify(v));
    this.pushToGit('links.json', { links: v });
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

  // Careers / Job Openings CRUD
  addCareer(j) { const list = this.getCareers(); j.id = 'job-' + Date.now(); list.unshift(j); this.saveCareers(list); }
  updateCareer(j) { const list = this.getCareers().map(item => item.id === j.id ? j : item); this.saveCareers(list); }
  deleteCareer(id) { const list = this.getCareers().filter(j => j.id !== id); this.saveCareers(list); }

  // Gallery CRUD
  addGalleryItem(g) { const list = this.getGallery(); g.id = 'gal-' + Date.now(); list.unshift(g); this.saveGallery(list); }
  updateGalleryItem(g) { const list = this.getGallery().map(item => item.id === g.id ? g : item); this.saveGallery(list); }
  deleteGalleryItem(id) { const list = this.getGallery().filter(g => g.id !== id); this.saveGallery(list); }

  // Useful Links & Chatbots CRUD
  addLink(l) { const list = this.getLinks(); l.id = 'link-' + Date.now(); list.push(l); this.saveLinks(list); }
  updateLink(l) { const list = this.getLinks().map(item => item.id === l.id ? l : item); this.saveLinks(list); }
  deleteLink(id) { const list = this.getLinks().filter(l => l.id !== id); this.saveLinks(list); }

  // Export / Import Data
  exportData() {
    return JSON.stringify({
      services: this.getServices(),
      team: this.getTeam(),
      faqs: this.getFaqs(),
      blogs: this.getBlogs(),
      testimonials: this.getTestimonials(),
      caseStudies: this.getCaseStudies(),
      careers: this.getCareers(),
      gallery: this.getGallery(),
      links: this.getLinks(),
      settings: this.getSettings(),
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
      if (p.careers) this.saveCareers(p.careers);
      if (p.gallery) this.saveGallery(p.gallery);
      if (p.links) this.saveLinks(p.links);
      if (p.settings) this.saveSettings(p.settings);
      return true;
    } catch (e) {
      return false;
    }
  }
}

window.gmStore = new Store();
