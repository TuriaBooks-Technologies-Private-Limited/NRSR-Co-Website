# Instructions for the New AI Agent

If you are a new AI agent tasked with building or customizing a new website for a client using this serverless skeleton, follow the prompt and instructions below.

---

## How to use this template

1.  **Clone this repository** into your new project directory:
    ```bash
    git clone https://github.com/NRSR_Coc/NRSR_Co-website.git
    ```
2.  **Open the directory** in your coding environment/workspace.
3.  **Copy and paste the Prompt below** into your chat window to start the customization!

---

## 🚀 Copy-Paste Handover Prompt

Copy the text block below and send it to your AI agent to begin:

```markdown
You are a senior frontend developer and UI/UX designer. We are building a brand-new website for a client by replicating and re-skinning an existing serverless Git-as-a-Database (GaaD) template in our workspace.

### 📁 Core Files in Workspace:
- `js/store.js`: Central state engine and data load/save endpoints.
- `js/admin.js`: CMS Admin Dashboard interfaces and session controls.
- `js/main.js`: Main public website logic, lazy loaders, and form handshakes.
- `css/style.css`: Theme variables, layouts, styling, grids, and responsiveness.
- `admin.html`: CMS workspace panel.
- `/functions/`: Serverless Cloudflare Pages Workers handling authentication, leads, and commits.
- `cto_handover_bible.md`: Full architectural blueprints, sequence diagrams, and database schemas.

### ⚠️ IMPORTANT DEVELOPMENT RULES:
1. DO NOT touch, edit, or break the core Javascript database logic in `js/store.js` or the CMS dashboard routing in `js/admin.js`, except for updating global configuration settings.
2. DO NOT modify any serverless functions inside the `/functions/` directory.
3. Keep all file names, folder structures, and HTML element IDs (like #contactForm, #leadsTableBody, etc.) exactly the same.
4. Keep all asset paths absolute (starting with `/`, e.g., `/assets/logo.svg`, `/css/style.css`) to ensure pages resolve correctly on Cloudflare Edge.

### 🎨 CLIENT CUSTOMIZATION DETAILS:
- **Client Name**: [INSERT CLIENT NAME, e.g. Catalyst Advisory]
- **Theme/Colors**: [INSERT PALETTE, e.g. Glassmorphism dark mode with vibrant emerald accents]
- **Design Aesthetic**: Premium, clean, state-of-the-art. Outfitted with high-quality custom typography (Google Fonts), soft background noise, subtle borders, card shadows, and smooth hover transitions.
- **GitHub Target Repository**: [INSERT GITHUB USER/REPO, e.g. CatalystCorp/catalyst-website]
- **Cloudflare Zero Trust Domain**: [INSERT CF TEAM DOMAIN, e.g. catalyst-trust]

### 📝 YOUR TASK:
1. Update the white-label variables at the top of `js/store.js` (lines 14-16) to point to the new GitHub Repository and Cloudflare Team Domain.
2. Re-skin `css/style.css` to build the new visual brand identity (colors, fonts, cards, buttons, custom micro-animations, and entry transitions).
3. Update textual metadata and layout elements across all HTML pages (`index.html`, `about.html`, `services.html`, `contact.html`, `admin.html`) to align with the client's naming and branding.
4. Verify that all features compile and execution check scripts run successfully.
```
