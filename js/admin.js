/* 
   M/s NRSR & Co - Admin Dashboard Script (v4.2 Fully Unlocked CMS)
   Includes:
   - Direct Open Admin CMS Dashboard (Zero Auth / Zero Passcode Restrictions)
   - Global Functions Attached to Window for Instant Inline Onclick Reliability
   - Services Management (Create, Edit, Delete for 16 services)
   - Team Management with Photo Upload & Preview
   - FAQs Management with Placement Dropdowns
   - Testimonials Management with Placement Dropdowns
   - Blogs Management with Cover Photo Upload & Enterprise SEO
   - Case Studies Management with Banner Photo Upload & Enterprise SEO
   - Data Backup Export & Import (JSON)
*/

document.addEventListener('DOMContentLoaded', async () => {
  if (window.gmStore && typeof window.gmStore.detectApiEngine === 'function') {
    await window.gmStore.detectApiEngine();
  }
  initAuth();
});

function initAuth() {
  // Login gate removed at the user's request — this dashboard now opens
  // directly. Note: the backend write endpoint (functions/save_content.js)
  // has no request-level auth check either, so this was never the only
  // thing standing between the public internet and this CMS.
  const mainLayout = document.getElementById('adminMainLayout');
  const header = document.querySelector('header');
  if (mainLayout) mainLayout.style.display = 'grid';
  if (header) header.style.display = 'block';

  const loadPromise = window.gmStore && typeof window.gmStore.loadData === 'function'
    ? window.gmStore.loadData()
    : Promise.resolve();

  loadPromise.then(() => {
    initAdminNavigation();
    initModalForm();
    initBackupHandlers();
    initSearchHandler();
    renderAdminSection('overview');
  });
}

let currentSection = 'overview';

/* 1. Admin Tab Navigation */
function initAdminNavigation() {
  const menuItems = document.querySelectorAll('.admin-menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      menuItems.forEach(m => m.classList.remove('active'));
      item.classList.add('active');

      currentSection = item.getAttribute('data-section');
      renderAdminSection(currentSection);
    });
  });
}

/* 2. Render Selected Admin Section */
function renderAdminSection(section) {
  const container = document.getElementById('adminTableContainer');
  const sectionTitle = document.getElementById('adminSectionTitle');
  const addBtn = document.getElementById('adminAddBtn');
  const searchInput = document.getElementById('adminSearchInput');

  if (!container || !window.gmStore) return;

  searchInput.style.display = (section === 'overview' || section === 'leads' || section === 'settings') ? 'none' : 'block';
  searchInput.value = '';

  switch (section) {
    case 'overview':
      sectionTitle.textContent = 'Dashboard Overview';
      addBtn.style.display = 'none';
      renderOverviewStats(container);
      break;

    case 'services':
      sectionTitle.textContent = 'Create & Edit Services';
      addBtn.style.display = 'block';
      addBtn.textContent = '+ Create New Service';
      addBtn.onclick = () => openServiceModal();
      renderServicesTable(container);
      break;

    case 'team':
      sectionTitle.textContent = 'Update Team Members & Photos';
      addBtn.style.display = 'block';
      addBtn.textContent = '+ Add Team Member';
      addBtn.onclick = () => openTeamModal();
      renderTeamTable(container);
      break;

    case 'faqs':
      sectionTitle.textContent = 'Manage FAQs & Page Placement';
      addBtn.style.display = 'block';
      addBtn.textContent = '+ Add New FAQ';
      addBtn.onclick = () => openFaqModal();
      renderFaqsTable(container);
      break;

    case 'testimonials':
      sectionTitle.textContent = 'Upload Testimonials & Placement';
      addBtn.style.display = 'block';
      addBtn.textContent = '+ Add Testimonial';
      addBtn.onclick = () => openTestimonialModal();
      renderTestimonialsTable(container);
      break;

    case 'blogs':
      sectionTitle.textContent = 'Publish Blogs (Photos & Enterprise SEO)';
      addBtn.style.display = 'block';
      addBtn.textContent = '+ Publish Blog Article';
      addBtn.onclick = () => openBlogModal();
      renderBlogsTable(container);
      break;

    case 'case-studies':
      sectionTitle.textContent = 'Add Case Studies (Photos & Enterprise SEO)';
      addBtn.style.display = 'block';
      addBtn.textContent = '+ Add Case Study';
      addBtn.onclick = () => openCaseStudyModal();
      renderCaseStudiesTable(container);
      break;

    case 'leads':
      sectionTitle.textContent = 'Contact Inquiries & Leads';
      addBtn.style.display = 'none';
      renderLeadsPanel(container);
      break;

    case 'settings':
      sectionTitle.textContent = 'Global Settings (WhatsApp & ERP Config)';
      addBtn.style.display = 'none';
      renderSettingsPanel(container);
      break;
  }
}

/* 3. Render Dashboard Overview Stats */
function renderOverviewStats(container) {
  const services = window.gmStore.getServices();
  const team = window.gmStore.getTeam();
  const faqs = window.gmStore.getFaqs();
  const testimonials = window.gmStore.getTestimonials();
  const blogs = window.gmStore.getBlogs();
  const caseStudies = window.gmStore.getCaseStudies();

  container.innerHTML = `
    <div style="display:grid; grid-template-columns:repeat(6, 1fr); gap:16px; margin-bottom:40px;">
      <div style="background:#ffffff; padding:20px; border-radius:12px; border:var(--card-border); box-shadow:var(--card-shadow); text-align:center;">
        <div style="font-size:28px; font-weight:800; color:var(--color-primary);">${services.length}</div>
        <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-top:4px;">Services</div>
      </div>
      <div style="background:#ffffff; padding:20px; border-radius:12px; border:var(--card-border); box-shadow:var(--card-shadow); text-align:center;">
        <div style="font-size:28px; font-weight:800; color:#2a2d33;">${team.length}</div>
        <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-top:4px;">Team</div>
      </div>
      <div style="background:#ffffff; padding:20px; border-radius:12px; border:var(--card-border); box-shadow:var(--card-shadow); text-align:center;">
        <div style="font-size:28px; font-weight:800; color:#059669;">${faqs.length}</div>
        <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-top:4px;">FAQs</div>
      </div>
      <div style="background:#ffffff; padding:20px; border-radius:12px; border:var(--card-border); box-shadow:var(--card-shadow); text-align:center;">
        <div style="font-size:28px; font-weight:800; color:#D4A83F;">${testimonials.length}</div>
        <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-top:4px;">Reviews</div>
      </div>
      <div style="background:#ffffff; padding:20px; border-radius:12px; border:var(--card-border); box-shadow:var(--card-shadow); text-align:center;">
        <div style="font-size:28px; font-weight:800; color:var(--color-accent);">${blogs.length}</div>
        <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-top:4px;">Blogs</div>
      </div>
      <div style="background:#ffffff; padding:20px; border-radius:12px; border:var(--card-border); box-shadow:var(--card-shadow); text-align:center;">
        <div style="font-size:28px; font-weight:800; color:var(--color-primary-dark);">${caseStudies.length}</div>
        <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-top:4px;">Case Studies</div>
      </div>
    </div>

    <div style="background:#ffffff; padding:32px; border-radius:14px; border:var(--card-border); box-shadow:var(--card-shadow);">
      <h3 style="font-size:18px; color:var(--color-slate); margin-bottom:12px;">NRSR & Co Central Content Management System</h3>
      <p style="font-size:14px; color:var(--text-muted); line-height:1.7;">
        All modifications, photo uploads, page placement selections, and blog/case study SEO updates immediately publish live on the website. Use the sidebar menu to navigate options.
      </p>
      <div style="margin-top:20px; display:flex; gap:16px;">
        <a href="index.html" class="btn btn-outline" style="font-size:13px;">View Live Homepage →</a>
        <a href="services.html" class="btn btn-outline" style="font-size:13px;">View Live Services (16) →</a>
      </div>
    </div>
  `;
}

/* 4. Render Services Table */
function renderServicesTable(container, filterQuery = '') {
  let services = window.gmStore.getServices();
  if (filterQuery) {
    const q = filterQuery.toLowerCase();
    services = services.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
  }

  container.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>Service Name</th>
          <th>Category</th>
          <th>Summary / Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${services.map(s => `
          <tr>
            <td><strong>${s.name}</strong></td>
            <td><span class="service-badge">${s.category}</span></td>
            <td style="max-width:350px;">${s.shortDesc || s.description}</td>
            <td>
              <button class="action-btn btn-edit" onclick="window.openEditServiceModal('${s.id}')">Edit</button>
              <button class="action-btn btn-delete" onclick="window.deleteService('${s.id}')">Delete</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

/* 5. Render Team Table */
function renderTeamTable(container, filterQuery = '') {
  let team = window.gmStore.getTeam();
  if (filterQuery) {
    const q = filterQuery.toLowerCase();
    team = team.filter(m => m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q));
  }

  container.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>Photo</th>
          <th>Name</th>
          <th>Role / Position</th>
          <th>Qualification</th>
          <th>Expertise</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${team.map(m => `
          <tr>
            <td>
              ${m.image ? `<img src="${m.image}" alt="${m.name}" style="width:40px; height:40px; border-radius:50%; object-fit:cover; border:2px solid var(--color-primary);">` : `<div style="width:40px; height:40px; border-radius:50%; background:var(--color-primary); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700;">${m.name.charAt(0)}</div>`}
            </td>
            <td><strong>${m.name}</strong></td>
            <td>${m.role}</td>
            <td><span class="service-badge">${m.qualification}</span></td>
            <td style="max-width:250px;">${m.expertise}</td>
            <td>
              <button class="action-btn btn-edit" onclick="window.openEditTeamModal('${m.id}')">Edit</button>
              <button class="action-btn btn-delete" onclick="window.deleteTeamMember('${m.id}')">Delete</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

/* 6. Render FAQs Table */
function renderFaqsTable(container, filterQuery = '') {
  let faqs = window.gmStore.getFaqs();
  if (filterQuery) {
    const q = filterQuery.toLowerCase();
    faqs = faqs.filter(f => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q));
  }

  container.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>Question</th>
          <th>Answer</th>
          <th>Display Target Page</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${faqs.map(f => `
          <tr>
            <td style="max-width:250px;"><strong>${f.question}</strong></td>
            <td style="max-width:350px;">${f.answer}</td>
            <td><span class="service-badge">${getPlacementLabel(f.placement)}</span></td>
            <td>
              <button class="action-btn btn-edit" onclick="window.openEditFaqModal('${f.id}')">Edit</button>
              <button class="action-btn btn-delete" onclick="window.deleteFaq('${f.id}')">Delete</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

/* 7. Render Testimonials Table */
function renderTestimonialsTable(container, filterQuery = '') {
  let list = window.gmStore.getTestimonials();
  if (filterQuery) {
    const q = filterQuery.toLowerCase();
    list = list.filter(t => t.name.toLowerCase().includes(q) || (t.company && t.company.toLowerCase().includes(q)));
  }

  container.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>Client Name</th>
          <th>Designation & Company</th>
          <th>Review Text</th>
          <th>Target Page</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${list.map(t => `
          <tr>
            <td><strong>${t.name}</strong></td>
            <td>${t.designation} ${t.company ? '• ' + t.company : ''}</td>
            <td style="max-width:280px;">"${t.review}"</td>
            <td><span class="service-badge">${getPlacementLabel(t.placement)}</span></td>
            <td>
              <button class="action-btn btn-edit" onclick="window.openEditTestimonialModal('${t.id}')">Edit</button>
              <button class="action-btn btn-delete" onclick="window.deleteTestimonial('${t.id}')">Delete</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function getPlacementLabel(p) {
  if (p === 'index.html') return 'Homepage';
  if (p === 'services.html') return 'Services Page';
  if (p === 'team.html') return 'Team Page';
  if (p === 'contact.html') return 'Contact Page';
  return 'All Pages';
}

/* 8. Render Blogs Table */
function renderBlogsTable(container, filterQuery = '') {
  let blogs = window.gmStore.getBlogs();
  if (filterQuery) {
    const q = filterQuery.toLowerCase();
    blogs = blogs.filter(b => b.title.toLowerCase().includes(q) || b.category.toLowerCase().includes(q));
  }

  container.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>Cover</th>
          <th>Blog Title & Slug</th>
          <th>Category</th>
          <th>Author</th>
          <th>SEO Rating</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${blogs.map(b => `
          <tr>
            <td>
              ${b.image ? `<img src="${b.image}" style="width:48px; height:36px; border-radius:6px; object-fit:cover;">` : `<div style="width:48px; height:36px; border-radius:6px; background:#e2e8f0; display:flex; align-items:center; justify-content:center; font-size:10px; color:#64748b;">No Img</div>`}
            </td>
            <td>
              <strong>${b.title}</strong>
              <div style="font-size:11px; color:var(--color-primary); font-family:monospace; margin-top:2px;">slug: /${b.slug || 'blog-' + b.id}</div>
            </td>
            <td><span class="service-badge">${b.category}</span></td>
            <td>${b.author}</td>
            <td><span class="service-badge" style="background:#dcfce7; color:#15803d;">Enterprise SEO ✓</span></td>
            <td>
              <button class="action-btn btn-edit" onclick="window.openEditBlogModal('${b.id}')">Edit Photo & SEO</button>
              <button class="action-btn btn-delete" onclick="window.deleteBlog('${b.id}')">Delete</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

/* 9. Render Case Studies Table */
function renderCaseStudiesTable(container, filterQuery = '') {
  let caseStudies = window.gmStore.getCaseStudies();
  if (filterQuery) {
    const q = filterQuery.toLowerCase();
    caseStudies = caseStudies.filter(c => c.title.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q));
  }

  container.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>Banner</th>
          <th>Case Study Title & Slug</th>
          <th>Industry & Client</th>
          <th>Impact Result</th>
          <th>SEO Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${caseStudies.map(c => `
          <tr>
            <td>
              ${c.image ? `<img src="${c.image}" style="width:48px; height:36px; border-radius:6px; object-fit:cover;">` : `<div style="width:48px; height:36px; border-radius:6px; background:#e2e8f0; display:flex; align-items:center; justify-content:center; font-size:10px; color:#64748b;">No Img</div>`}
            </td>
            <td>
              <strong>${c.title}</strong>
              <div style="font-size:11px; color:var(--color-primary); font-family:monospace; margin-top:2px;">slug: /${c.slug || 'cs-' + c.id}</div>
            </td>
            <td><span class="service-badge">${c.industry}</span></td>
            <td style="max-width:180px; color:var(--color-primary); font-weight:700;">${c.results}</td>
            <td><span class="service-badge" style="background:#dcfce7; color:#15803d;">Enterprise SEO ✓</span></td>
            <td>
              <button class="action-btn btn-edit" onclick="window.openEditCaseStudyModal('${c.id}')">Edit Photo & SEO</button>
              <button class="action-btn btn-delete" onclick="window.deleteCaseStudy('${c.id}')">Delete</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

/* MODALS WITH PHOTO UPLOADS & ENTERPRISE SEO FIELDS */
window.openBlogModal = function() {
  const modal = document.getElementById('adminModal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  let uploadedBlogImageBase64 = '';

  title.textContent = 'Publish New Blog Article with Photo & Enterprise SEO';
  body.innerHTML = `
    <form id="blogForm">
      <div class="form-group">
        <label>Blog Article Title *</label>
        <input type="text" id="bTitle" class="form-control" placeholder="e.g. Why Growing Businesses Need Virtual CFOs" required>
      </div>

      <div class="form-group" style="background:var(--bg-main); padding:16px; border-radius:8px; border:1px dashed var(--color-primary);">
        <label style="font-weight:700;">Featured Cover Photo Upload (with Live Preview)</label>
        <div style="display:flex; align-items:center; gap:16px; margin-top:8px;">
          <div id="bPhotoPreview" style="width:90px; height:60px; border-radius:6px; background:#e2e8f0; display:flex; align-items:center; justify-content:center; overflow:hidden; border:1px solid rgba(7,26,54,0.2);">
            <span style="font-size:20px; color:#94a3b8;">🖼️</span>
          </div>
          <input type="file" id="bPhotoInput" accept="image/*" class="form-control" style="padding:6px;">
        </div>
      </div>
      
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
        <div class="form-group">
          <label>Custom URL Slug (SEO) *</label>
          <input type="text" id="bSlug" class="form-control" placeholder="e.g. virtual-cfo-services-guide" required>
        </div>
        <div class="form-group">
          <label>Category *</label>
          <select id="bCategory" class="form-control">
            <option>Business Advisory</option>
            <option>Finance & Compliance</option>
            <option>Technology & Automation</option>
            <option>Corporate Services</option>
          </select>
        </div>
      </div>

      <div style="background:var(--bg-main); padding:16px; border-radius:8px; border:1px solid rgba(7,26,54,0.15); margin-bottom:16px;">
        <h4 style="font-size:13px; color:var(--color-primary); margin-bottom:10px;">🔍 Enterprise SEO & Social Metadata</h4>
        <div class="form-group">
          <label>Meta Title Tag (60 chars)</label>
          <input type="text" id="bMetaTitle" class="form-control" placeholder="Virtual CFO Advisory Guide 2026 | NRSR & Co">
        </div>
        <div class="form-group">
          <label>Meta Description Tag (160 chars)</label>
          <input type="text" id="bMetaDesc" class="form-control" placeholder="Discover how Virtual CFO advisory gives mid-market companies high-level financial strategy...">
        </div>
        <div class="form-group">
          <label>Meta Keywords (comma separated)</label>
          <input type="text" id="bMetaKeywords" class="form-control" placeholder="Virtual CFO, Financial Strategy, Cash Flow Forecasting, Manipal CA">
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
        <div class="form-group">
          <label>Author Name *</label>
          <input type="text" id="bAuthor" class="form-control" value="Sandeep (Director)" required>
        </div>
        <div class="form-group">
          <label>Read Time</label>
          <input type="text" id="bReadTime" class="form-control" value="5 min read">
        </div>
      </div>

      <div class="form-group">
        <label>Executive Summary *</label>
        <input type="text" id="bSummary" class="form-control" required>
      </div>

      <div class="form-group">
        <label>Full Content (Supports Markdown headers ###) *</label>
        <textarea id="bContent" class="form-control" rows="6" required></textarea>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;">Publish Article with Enterprise SEO</button>
    </form>
  `;

  modal.classList.add('active');

  document.getElementById('bPhotoInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        uploadedBlogImageBase64 = evt.target.result;
        document.getElementById('bPhotoPreview').innerHTML = `<img src="${uploadedBlogImageBase64}" style="width:100%; height:100%; object-fit:cover;">`;
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById('blogForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const titleVal = document.getElementById('bTitle').value;
    const rawSlug = document.getElementById('bSlug').value || titleVal.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    window.gmStore.addBlog({
      title: titleVal,
      slug: rawSlug,
      image: uploadedBlogImageBase64,
      metaTitle: document.getElementById('bMetaTitle').value || titleVal,
      metaDesc: document.getElementById('bMetaDesc').value,
      metaKeywords: document.getElementById('bMetaKeywords').value,
      category: document.getElementById('bCategory').value,
      author: document.getElementById('bAuthor').value,
      date: new Date().toISOString().split('T')[0],
      readTime: document.getElementById('bReadTime').value || '5 min read',
      summary: document.getElementById('bSummary').value,
      content: document.getElementById('bContent').value
    });
    modal.classList.remove('active');
    renderAdminSection('blogs');
  });
};

window.openEditBlogModal = function(id) {
  const modal = document.getElementById('adminModal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  const showEditModal = (b) => {
    let uploadedBlogImageBase64 = b.image || '';

  title.textContent = 'Edit Blog Article, Photo & Enterprise SEO';
  body.innerHTML = `
    <form id="editBlogForm">
      <div class="form-group">
        <label>Blog Article Title *</label>
        <input type="text" id="editBTitle" class="form-control" value="${b.title}" required>
      </div>

      <div class="form-group" style="background:var(--bg-main); padding:16px; border-radius:8px; border:1px dashed var(--color-primary);">
        <label style="font-weight:700;">Update Featured Cover Photo (Live Preview)</label>
        <div style="display:flex; align-items:center; gap:16px; margin-top:8px;">
          <div id="editBPhotoPreview" style="width:90px; height:60px; border-radius:6px; background:#e2e8f0; display:flex; align-items:center; justify-content:center; overflow:hidden; border:1px solid rgba(7,26,54,0.2);">
            ${b.image ? `<img src="${b.image}" style="width:100%; height:100%; object-fit:cover;">` : `<span style="font-size:20px; color:#94a3b8;">🖼️</span>`}
          </div>
          <input type="file" id="editBPhotoInput" accept="image/*" class="form-control" style="padding:6px;">
        </div>
      </div>
      
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
        <div class="form-group">
          <label>Custom URL Slug *</label>
          <input type="text" id="editBSlug" class="form-control" value="${b.slug || ''}" required>
        </div>
        <div class="form-group">
          <label>Category *</label>
          <select id="editBCategory" class="form-control">
            <option ${b.category === 'Business Advisory' ? 'selected' : ''}>Business Advisory</option>
            <option ${b.category === 'Finance & Compliance' ? 'selected' : ''}>Finance & Compliance</option>
            <option ${b.category === 'Technology & Automation' ? 'selected' : ''}>Technology & Automation</option>
            <option ${b.category === 'Corporate Services' ? 'selected' : ''}>Corporate Services</option>
          </select>
        </div>
      </div>

      <div style="background:var(--bg-main); padding:16px; border-radius:8px; border:1px solid rgba(7,26,54,0.15); margin-bottom:16px;">
        <h4 style="font-size:13px; color:var(--color-primary); margin-bottom:10px;">🔍 Enterprise SEO & Social Metadata</h4>
        <div class="form-group">
          <label>Meta Title Tag</label>
          <input type="text" id="editBMetaTitle" class="form-control" value="${b.metaTitle || ''}">
        </div>
        <div class="form-group">
          <label>Meta Description Tag</label>
          <input type="text" id="editBMetaDesc" class="form-control" value="${b.metaDesc || ''}">
        </div>
        <div class="form-group">
          <label>Meta Keywords</label>
          <input type="text" id="editBMetaKeywords" class="form-control" value="${b.metaKeywords || ''}">
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
        <div class="form-group">
          <label>Author Name *</label>
          <input type="text" id="editBAuthor" class="form-control" value="${b.author}" required>
        </div>
        <div class="form-group">
          <label>Read Time</label>
          <input type="text" id="editBReadTime" class="form-control" value="${b.readTime || '5 min read'}">
        </div>
      </div>

      <div class="form-group">
        <label>Executive Summary *</label>
        <input type="text" id="editBSummary" class="form-control" value="${b.summary}" required>
      </div>

      <div class="form-group">
        <label>Full Content *</label>
        <textarea id="editBContent" class="form-control" rows="6" required>${b.content}</textarea>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;">Update Article & SEO</button>
    </form>
  `;

  modal.classList.add('active');

  document.getElementById('editBPhotoInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        uploadedBlogImageBase64 = evt.target.result;
        document.getElementById('editBPhotoPreview').innerHTML = `<img src="${uploadedBlogImageBase64}" style="width:100%; height:100%; object-fit:cover;">`;
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById('editBlogForm').addEventListener('submit', (e) => {
    e.preventDefault();
    window.gmStore.updateBlog({
      id: b.id,
      title: document.getElementById('editBTitle').value,
      slug: document.getElementById('editBSlug').value,
      image: uploadedBlogImageBase64,
      metaTitle: document.getElementById('editBMetaTitle').value,
      metaDesc: document.getElementById('editBMetaDesc').value,
      metaKeywords: document.getElementById('editBMetaKeywords').value,
      category: document.getElementById('editBCategory').value,
      author: document.getElementById('editBAuthor').value,
      date: b.date,
      readTime: document.getElementById('editBReadTime').value,
      summary: document.getElementById('editBSummary').value,
      content: document.getElementById('editBContent').value
    });
    modal.classList.remove('active');
    renderAdminSection('blogs');
  });
  };

  if (window.gmStore && typeof window.gmStore.getBlogDetails === 'function') {
    window.gmStore.getBlogDetails(id).then(b => {
      if (b) showEditModal(b);
    });
  } else {
    const b = window.gmStore.getBlogs().find(item => item.id === id);
    if (b) showEditModal(b);
  }
};

window.openCaseStudyModal = function() {
  const modal = document.getElementById('adminModal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  let uploadedCsImageBase64 = '';

  title.textContent = 'Add Case Study with Banner Photo & Enterprise SEO';
  body.innerHTML = `
    <form id="csForm">
      <div class="form-group">
        <label>Case Study Title *</label>
        <input type="text" id="csTitle" class="form-control" placeholder="e.g. Income Tax Tribunal Defense for Tech Entity" required>
      </div>

      <div class="form-group" style="background:var(--bg-main); padding:16px; border-radius:8px; border:1px dashed var(--color-primary);">
        <label style="font-weight:700;">Case Study Banner Photo Upload (with Live Preview)</label>
        <div style="display:flex; align-items:center; gap:16px; margin-top:8px;">
          <div id="csPhotoPreview" style="width:90px; height:60px; border-radius:6px; background:#e2e8f0; display:flex; align-items:center; justify-content:center; overflow:hidden; border:1px solid rgba(7,26,54,0.2);">
            <span style="font-size:20px; color:#94a3b8;">📊</span>
          </div>
          <input type="file" id="csPhotoInput" accept="image/*" class="form-control" style="padding:6px;">
        </div>
      </div>
      
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
        <div class="form-group">
          <label>Custom URL Slug (SEO) *</label>
          <input type="text" id="csSlug" class="form-control" placeholder="e.g. tax-litigation-relief-case-study" required>
        </div>
        <div class="form-group">
          <label>Industry *</label>
          <input type="text" id="csIndustry" class="form-control" placeholder="e.g. Electronics, SaaS" required>
        </div>
      </div>

      <div style="background:var(--bg-main); padding:16px; border-radius:8px; border:1px solid rgba(7,26,54,0.15); margin-bottom:16px;">
        <h4 style="font-size:13px; color:var(--color-primary); margin-bottom:10px;">🔍 Enterprise SEO & Social Metadata</h4>
        <div class="form-group">
          <label>Meta Title Tag (60 chars)</label>
          <input type="text" id="csMetaTitle" class="form-control" placeholder="Income Tax Tribunal Case Study | NRSR & Co">
        </div>
        <div class="form-group">
          <label>Meta Description Tag (160 chars)</label>
          <input type="text" id="csMetaDesc" class="form-control" placeholder="Saved ₹1.4 Crore in direct tax penalties before ITAT...">
        </div>
        <div class="form-group">
          <label>Meta Keywords (comma separated)</label>
          <input type="text" id="csMetaKeywords" class="form-control" placeholder="Direct Tax Litigation, ITAT Tribunal, Tax Relief">
        </div>
      </div>

      <div class="form-group">
        <label>Client Entity Name *</label>
        <input type="text" id="csClient" class="form-control" placeholder="e.g. Precision Tech Components" required>
      </div>

      <div class="form-group">
        <label>Strategic Challenge *</label>
        <textarea id="csChallenge" class="form-control" rows="3" required></textarea>
      </div>

      <div class="form-group">
        <label>Solution & Execution *</label>
        <textarea id="csSolution" class="form-control" rows="3" required></textarea>
      </div>

      <div class="form-group">
        <label>Measurable Impact Result *</label>
        <input type="text" id="csResults" class="form-control" placeholder="e.g. Saved ₹1.4 Crore in tax penalties" required>
      </div>

      <button type="submit" class="btn btn-primary" style="width:100%;">Save Case Study with Enterprise SEO</button>
    </form>
  `;

  modal.classList.add('active');

  document.getElementById('csPhotoInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        uploadedCsImageBase64 = evt.target.result;
        document.getElementById('csPhotoPreview').innerHTML = `<img src="${uploadedCsImageBase64}" style="width:100%; height:100%; object-fit:cover;">`;
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById('csForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const titleVal = document.getElementById('csTitle').value;
    const rawSlug = document.getElementById('csSlug').value || titleVal.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    window.gmStore.addCaseStudy({
      title: titleVal,
      slug: rawSlug,
      image: uploadedCsImageBase64,
      metaTitle: document.getElementById('csMetaTitle').value || titleVal,
      metaDesc: document.getElementById('csMetaDesc').value,
      metaKeywords: document.getElementById('csMetaKeywords').value,
      industry: document.getElementById('csIndustry').value,
      client: document.getElementById('csClient').value,
      summary: titleVal,
      challenge: document.getElementById('csChallenge').value,
      solution: document.getElementById('csSolution').value,
      execution: document.getElementById('csSolution').value,
      results: document.getElementById('csResults').value,
      metrics: [{ label: 'Impact Achievement', val: '100%' }]
    });
    modal.classList.remove('active');
    renderAdminSection('case-studies');
  });
};

window.openEditCaseStudyModal = function(id) {
  const modal = document.getElementById('adminModal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  const showEditModal = (c) => {
    let uploadedCsImageBase64 = c.image || '';

  title.textContent = 'Edit Case Study, Banner & Enterprise SEO';
  body.innerHTML = `
    <form id="editCsForm">
      <div class="form-group">
        <label>Case Study Title *</label>
        <input type="text" id="editCsTitle" class="form-control" value="${c.title}" required>
      </div>

      <div class="form-group" style="background:var(--bg-main); padding:16px; border-radius:8px; border:1px dashed var(--color-primary);">
        <label style="font-weight:700;">Update Banner Photo (Live Preview)</label>
        <div style="display:flex; align-items:center; gap:16px; margin-top:8px;">
          <div id="editCsPhotoPreview" style="width:90px; height:60px; border-radius:6px; background:#e2e8f0; display:flex; align-items:center; justify-content:center; overflow:hidden; border:1px solid rgba(7,26,54,0.2);">
            ${c.image ? `<img src="${c.image}" style="width:100%; height:100%; object-fit:cover;">` : `<span style="font-size:20px; color:#94a3b8;">📊</span>`}
          </div>
          <input type="file" id="editCsPhotoInput" accept="image/*" class="form-control" style="padding:6px;">
        </div>
      </div>
      
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
        <div class="form-group">
          <label>Custom URL Slug *</label>
          <input type="text" id="editCsSlug" class="form-control" value="${c.slug || ''}" required>
        </div>
        <div class="form-group">
          <label>Industry *</label>
          <input type="text" id="editCsIndustry" class="form-control" value="${c.industry}" required>
        </div>
      </div>

      <div style="background:var(--bg-main); padding:16px; border-radius:8px; border:1px solid rgba(7,26,54,0.15); margin-bottom:16px;">
        <h4 style="font-size:13px; color:var(--color-primary); margin-bottom:10px;">🔍 Enterprise SEO & Social Metadata</h4>
        <div class="form-group">
          <label>Meta Title Tag</label>
          <input type="text" id="editCsMetaTitle" class="form-control" value="${c.metaTitle || ''}">
        </div>
        <div class="form-group">
          <label>Meta Description Tag</label>
          <input type="text" id="editCsMetaDesc" class="form-control" value="${c.metaDesc || ''}">
        </div>
        <div class="form-group">
          <label>Meta Keywords</label>
          <input type="text" id="editCsMetaKeywords" class="form-control" value="${c.metaKeywords || ''}">
        </div>
      </div>

      <div class="form-group">
        <label>Client Entity *</label>
        <input type="text" id="editCsClient" class="form-control" value="${c.client || ''}" required>
      </div>
      <div class="form-group">
        <label>Strategic Challenge *</label>
        <textarea id="editCsChallenge" class="form-control" rows="3" required>${c.challenge}</textarea>
      </div>
      <div class="form-group">
        <label>Solution & Execution *</label>
        <textarea id="editCsSolution" class="form-control" rows="3" required>${c.solution}</textarea>
      </div>
      <div class="form-group">
        <label>Impact Result *</label>
        <input type="text" id="editCsResults" class="form-control" value="${c.results}" required>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;">Update Case Study & SEO</button>
    </form>
  `;

  modal.classList.add('active');

  document.getElementById('editCsPhotoInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        uploadedCsImageBase64 = evt.target.result;
        document.getElementById('editCsPhotoPreview').innerHTML = `<img src="${uploadedCsImageBase64}" style="width:100%; height:100%; object-fit:cover;">`;
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById('editCsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    window.gmStore.updateCaseStudy({
      id: c.id,
      title: document.getElementById('editCsTitle').value,
      slug: document.getElementById('editCsSlug').value,
      image: uploadedCsImageBase64,
      metaTitle: document.getElementById('editCsMetaTitle').value,
      metaDesc: document.getElementById('editCsMetaDesc').value,
      metaKeywords: document.getElementById('editCsMetaKeywords').value,
      industry: document.getElementById('editCsIndustry').value,
      client: document.getElementById('editCsClient').value,
      summary: document.getElementById('editCsTitle').value,
      challenge: document.getElementById('editCsChallenge').value,
      solution: document.getElementById('editCsSolution').value,
      execution: document.getElementById('editCsSolution').value,
      results: document.getElementById('editCsResults').value,
      metrics: c.metrics || [{ label: 'Impact Achievement', val: '100%' }]
    });
    modal.classList.remove('active');
    renderAdminSection('case-studies');
  });
  };

  if (window.gmStore && typeof window.gmStore.getCaseStudyDetails === 'function') {
    window.gmStore.getCaseStudyDetails(id).then(c => {
      if (c) showEditModal(c);
    });
  } else {
    const c = window.gmStore.getCaseStudies().find(item => item.id === id);
    if (c) showEditModal(c);
  }
};

window.openTeamModal = function() {
  const modal = document.getElementById('adminModal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  let uploadedImageBase64 = '';

  title.textContent = 'Add Team Member Profile';
  body.innerHTML = `
    <form id="teamForm">
      <div class="form-group">
        <label>Full Name *</label>
        <input type="text" id="mName" class="form-control" required>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
        <div class="form-group">
          <label>Role / Designation *</label>
          <input type="text" id="mRole" class="form-control" required>
        </div>
        <div class="form-group">
          <label>Qualification *</label>
          <input type="text" id="mQual" class="form-control" placeholder="e.g. CA, MBA" required>
        </div>
      </div>
      
      <div class="form-group" style="background:var(--bg-main); padding:16px; border-radius:8px; border:1px dashed var(--color-primary);">
        <label style="font-weight:700;">Member Photo Upload (with Live Preview)</label>
        <div style="display:flex; align-items:center; gap:16px; margin-top:8px;">
          <div id="mPhotoPreview" style="width:64px; height:64px; border-radius:50%; background:#e2e8f0; display:flex; align-items:center; justify-content:center; overflow:hidden; border:2px solid var(--color-primary);">
            <span style="font-size:24px; color:#94a3b8;">👤</span>
          </div>
          <input type="file" id="mPhotoInput" accept="image/*" class="form-control" style="padding:6px;">
        </div>
      </div>

      <div class="form-group">
        <label>Key Focus / Expertise *</label>
        <input type="text" id="mExp" class="form-control" required>
      </div>
      <div class="form-group">
        <label>Bio Summary *</label>
        <textarea id="mBio" class="form-control" rows="3" required></textarea>
      </div>

      <div class="form-group" style="background:var(--bg-main); padding:16px; border-radius:8px;">
        <label style="font-weight:700;">Contact & Social (optional, only shown on the site if filled in)</label>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:8px;">
          <div class="form-group" style="margin-bottom:0;">
            <label>LinkedIn Profile URL</label>
            <input type="url" id="mLinkedin" class="form-control" placeholder="https://linkedin.com/in/...">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label>Direct Phone Number</label>
            <input type="tel" id="mPhone" class="form-control" placeholder="+91 90000 00000">
          </div>
        </div>
      </div>

      <button type="submit" class="btn btn-primary" style="width:100%;">Save Team Member</button>
    </form>
  `;

  modal.classList.add('active');

  document.getElementById('mPhotoInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        uploadedImageBase64 = evt.target.result;
        document.getElementById('mPhotoPreview').innerHTML = `<img src="${uploadedImageBase64}" style="width:100%; height:100%; object-fit:cover;">`;
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById('teamForm').addEventListener('submit', (e) => {
    e.preventDefault();
    window.gmStore.addTeamMember({
      name: document.getElementById('mName').value,
      role: document.getElementById('mRole').value,
      qualification: document.getElementById('mQual').value,
      expertise: document.getElementById('mExp').value,
      bio: document.getElementById('mBio').value,
      image: uploadedImageBase64,
      linkedin: document.getElementById('mLinkedin').value.trim(),
      phone: document.getElementById('mPhone').value.trim()
    });
    modal.classList.remove('active');
    renderAdminSection('team');
  });
};

window.openEditTeamModal = function(id) {
  const modal = document.getElementById('adminModal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  const m = window.gmStore.getTeam().find(item => item.id === id);

  if (!m) return;

  let uploadedImageBase64 = m.image || '';

  title.textContent = 'Edit Team Member Profile';
  body.innerHTML = `
    <form id="editTeamForm">
      <div class="form-group">
        <label>Full Name *</label>
        <input type="text" id="editMName" class="form-control" value="${m.name}" required>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
        <div class="form-group">
          <label>Role / Designation *</label>
          <input type="text" id="editMRole" class="form-control" value="${m.role}" required>
        </div>
        <div class="form-group">
          <label>Qualification *</label>
          <input type="text" id="editMQual" class="form-control" value="${m.qualification}" required>
        </div>
      </div>

      <div class="form-group" style="background:var(--bg-main); padding:16px; border-radius:8px; border:1px dashed var(--color-primary);">
        <label style="font-weight:700;">Update Member Photo (Live Preview)</label>
        <div style="display:flex; align-items:center; gap:16px; margin-top:8px;">
          <div id="editMPhotoPreview" style="width:64px; height:64px; border-radius:50%; background:#e2e8f0; display:flex; align-items:center; justify-content:center; overflow:hidden; border:2px solid var(--color-primary);">
            ${m.image ? `<img src="${m.image}" style="width:100%; height:100%; object-fit:cover;">` : `<span style="font-size:24px; color:#94a3b8;">${m.name.charAt(0)}</span>`}
          </div>
          <input type="file" id="editMPhotoInput" accept="image/*" class="form-control" style="padding:6px;">
        </div>
      </div>

      <div class="form-group">
        <label>Key Focus / Expertise *</label>
        <input type="text" id="editMExp" class="form-control" value="${m.expertise}" required>
      </div>
      <div class="form-group">
        <label>Bio Summary *</label>
        <textarea id="editMBio" class="form-control" rows="3" required>${m.bio}</textarea>
      </div>

      <div class="form-group" style="background:var(--bg-main); padding:16px; border-radius:8px;">
        <label style="font-weight:700;">Contact & Social (optional, only shown on the site if filled in)</label>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:8px;">
          <div class="form-group" style="margin-bottom:0;">
            <label>LinkedIn Profile URL</label>
            <input type="url" id="editMLinkedin" class="form-control" value="${m.linkedin || ''}" placeholder="https://linkedin.com/in/...">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label>Direct Phone Number</label>
            <input type="tel" id="editMPhone" class="form-control" value="${m.phone || ''}" placeholder="+91 90000 00000">
          </div>
        </div>
      </div>

      <button type="submit" class="btn btn-primary" style="width:100%;">Update Team Member</button>
    </form>
  `;

  modal.classList.add('active');

  document.getElementById('editMPhotoInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        uploadedImageBase64 = evt.target.result;
        document.getElementById('editMPhotoPreview').innerHTML = `<img src="${uploadedImageBase64}" style="width:100%; height:100%; object-fit:cover;">`;
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById('editTeamForm').addEventListener('submit', (e) => {
    e.preventDefault();
    window.gmStore.updateTeamMember({
      id: m.id,
      name: document.getElementById('editMName').value,
      role: document.getElementById('editMRole').value,
      qualification: document.getElementById('editMQual').value,
      expertise: document.getElementById('editMExp').value,
      bio: document.getElementById('editMBio').value,
      image: uploadedImageBase64,
      linkedin: document.getElementById('editMLinkedin').value.trim(),
      phone: document.getElementById('editMPhone').value.trim()
    });
    modal.classList.remove('active');
    renderAdminSection('team');
  });
};

window.openFaqModal = function() {
  const modal = document.getElementById('adminModal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  title.textContent = 'Add New FAQ';
  body.innerHTML = `
    <form id="faqForm">
      <div class="form-group">
        <label>Question *</label>
        <input type="text" id="fQuestion" class="form-control" required>
      </div>
      <div class="form-group">
        <label>Target Page Placement Dropdown *</label>
        <select id="fPlacement" class="form-control">
          <option value="index.html">Homepage Only (index.html)</option>
          <option value="services.html">Services Page Only (services.html)</option>
          <option value="contact.html">Contact Us Page Only (contact.html)</option>
          <option value="all" selected>All Pages Everywhere</option>
        </select>
      </div>
      <div class="form-group">
        <label>Detailed Answer *</label>
        <textarea id="fAnswer" class="form-control" rows="4" required></textarea>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;">Save FAQ</button>
    </form>
  `;

  modal.classList.add('active');

  document.getElementById('faqForm').addEventListener('submit', (e) => {
    e.preventDefault();
    window.gmStore.addFaq({
      question: document.getElementById('fQuestion').value,
      answer: document.getElementById('fAnswer').value,
      placement: document.getElementById('fPlacement').value
    });
    modal.classList.remove('active');
    renderAdminSection('faqs');
  });
};

window.openEditFaqModal = function(id) {
  const modal = document.getElementById('adminModal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  const f = window.gmStore.getFaqs().find(item => item.id === id);

  if (!f) return;

  title.textContent = 'Edit FAQ';
  body.innerHTML = `
    <form id="editFaqForm">
      <div class="form-group">
        <label>Question *</label>
        <input type="text" id="editFQuestion" class="form-control" value="${f.question}" required>
      </div>
      <div class="form-group">
        <label>Target Page Placement Dropdown *</label>
        <select id="editFPlacement" class="form-control">
          <option value="index.html" ${f.placement === 'index.html' ? 'selected' : ''}>Homepage Only (index.html)</option>
          <option value="services.html" ${f.placement === 'services.html' ? 'selected' : ''}>Services Page Only (services.html)</option>
          <option value="contact.html" ${f.placement === 'contact.html' ? 'selected' : ''}>Contact Us Page Only (contact.html)</option>
          <option value="all" ${!f.placement || f.placement === 'all' ? 'selected' : ''}>All Pages Everywhere</option>
        </select>
      </div>
      <div class="form-group">
        <label>Answer *</label>
        <textarea id="editFAnswer" class="form-control" rows="4" required>${f.answer}</textarea>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;">Update FAQ</button>
    </form>
  `;

  modal.classList.add('active');

  document.getElementById('editFaqForm').addEventListener('submit', (e) => {
    e.preventDefault();
    window.gmStore.updateFaq({
      id: f.id,
      question: document.getElementById('editFQuestion').value,
      answer: document.getElementById('editFAnswer').value,
      placement: document.getElementById('editFPlacement').value
    });
    modal.classList.remove('active');
    renderAdminSection('faqs');
  });
};

window.openTestimonialModal = function() {
  const modal = document.getElementById('adminModal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  let uploadedTImageBase64 = '';

  title.textContent = 'Upload Client Testimonial';
  body.innerHTML = `
    <form id="tForm">
      <div class="form-group">
        <label>Client Name *</label>
        <input type="text" id="tName" class="form-control" required>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
        <div class="form-group">
          <label>Designation & Company *</label>
          <input type="text" id="tRole" class="form-control" required>
        </div>
        <div class="form-group">
          <label>Review Date (optional)</label>
          <input type="text" id="tDate" class="form-control" placeholder="e.g. Jul 11, 2023">
        </div>
      </div>
      <div class="form-group">
        <label>Target Page Placement Dropdown *</label>
        <select id="tPlacement" class="form-control">
          <option value="index.html">Homepage Only (index.html)</option>
          <option value="services.html">Services Page Only (services.html)</option>
          <option value="team.html">Team Page Only (team.html)</option>
          <option value="all" selected>All Pages Everywhere</option>
        </select>
      </div>
      <div class="form-group" style="background:var(--bg-main); padding:16px; border-radius:8px; border:1px dashed var(--color-primary);">
        <label style="font-weight:700;">Client Photo Upload (optional, with Live Preview)</label>
        <div style="display:flex; align-items:center; gap:16px; margin-top:8px;">
          <div id="tPhotoPreview" style="width:64px; height:64px; border-radius:50%; background:#e2e8f0; display:flex; align-items:center; justify-content:center; overflow:hidden; border:2px solid var(--color-primary);">
            <span style="font-size:24px; color:#94a3b8;">👤</span>
          </div>
          <input type="file" id="tPhotoInput" accept="image/*" class="form-control" style="padding:6px;">
        </div>
      </div>
      <div class="form-group">
        <label>Review Text *</label>
        <textarea id="tReview" class="form-control" rows="4" required></textarea>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;">Save Testimonial</button>
    </form>
  `;

  modal.classList.add('active');

  document.getElementById('tPhotoInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        uploadedTImageBase64 = evt.target.result;
        document.getElementById('tPhotoPreview').innerHTML = `<img src="${uploadedTImageBase64}" style="width:100%; height:100%; object-fit:cover;">`;
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById('tForm').addEventListener('submit', (e) => {
    e.preventDefault();
    window.gmStore.addTestimonial({
      name: document.getElementById('tName').value,
      designation: document.getElementById('tRole').value,
      date: document.getElementById('tDate').value.trim(),
      review: document.getElementById('tReview').value,
      placement: document.getElementById('tPlacement').value,
      image: uploadedTImageBase64,
      rating: 5
    });
    modal.classList.remove('active');
    renderAdminSection('testimonials');
  });
};

window.openEditTestimonialModal = function(id) {
  const modal = document.getElementById('adminModal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  const t = window.gmStore.getTestimonials().find(item => item.id === id);

  if (!t) return;

  let uploadedTImageBase64 = t.image || '';

  title.textContent = 'Edit Client Testimonial';
  body.innerHTML = `
    <form id="editTForm">
      <div class="form-group">
        <label>Client Name *</label>
        <input type="text" id="editTName" class="form-control" value="${t.name}" required>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
        <div class="form-group">
          <label>Designation & Company *</label>
          <input type="text" id="editTRole" class="form-control" value="${t.designation}" required>
        </div>
        <div class="form-group">
          <label>Review Date (optional)</label>
          <input type="text" id="editTDate" class="form-control" value="${t.date || ''}" placeholder="e.g. Jul 11, 2023">
        </div>
      </div>
      <div class="form-group">
        <label>Target Page Placement Dropdown *</label>
        <select id="editTPlacement" class="form-control">
          <option value="index.html" ${t.placement === 'index.html' ? 'selected' : ''}>Homepage Only (index.html)</option>
          <option value="services.html" ${t.placement === 'services.html' ? 'selected' : ''}>Services Page Only (services.html)</option>
          <option value="team.html" ${t.placement === 'team.html' ? 'selected' : ''}>Team Page Only (team.html)</option>
          <option value="all" ${!t.placement || t.placement === 'all' ? 'selected' : ''}>All Pages Everywhere</option>
        </select>
      </div>
      <div class="form-group" style="background:var(--bg-main); padding:16px; border-radius:8px; border:1px dashed var(--color-primary);">
        <label style="font-weight:700;">Client Photo (optional, with Live Preview)</label>
        <div style="display:flex; align-items:center; gap:16px; margin-top:8px;">
          <div id="editTPhotoPreview" style="width:64px; height:64px; border-radius:50%; background:#e2e8f0; display:flex; align-items:center; justify-content:center; overflow:hidden; border:2px solid var(--color-primary);">
            ${t.image ? `<img src="${t.image}" style="width:100%; height:100%; object-fit:cover;">` : `<span style="font-size:24px; color:#94a3b8;">👤</span>`}
          </div>
          <input type="file" id="editTPhotoInput" accept="image/*" class="form-control" style="padding:6px;">
          ${t.image ? `<button type="button" id="editTPhotoRemove" class="btn btn-outline" style="padding:6px 12px; font-size:12px;">Remove</button>` : ''}
        </div>
      </div>
      <div class="form-group">
        <label>Review Text *</label>
        <textarea id="editTReview" class="form-control" rows="4" required>${t.review}</textarea>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;">Update Testimonial</button>
    </form>
  `;

  modal.classList.add('active');

  document.getElementById('editTPhotoInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        uploadedTImageBase64 = evt.target.result;
        document.getElementById('editTPhotoPreview').innerHTML = `<img src="${uploadedTImageBase64}" style="width:100%; height:100%; object-fit:cover;">`;
      };
      reader.readAsDataURL(file);
    }
  });

  const removeBtn = document.getElementById('editTPhotoRemove');
  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      uploadedTImageBase64 = '';
      document.getElementById('editTPhotoPreview').innerHTML = `<span style="font-size:24px; color:#94a3b8;">👤</span>`;
    });
  }

  document.getElementById('editTForm').addEventListener('submit', (e) => {
    e.preventDefault();
    window.gmStore.updateTestimonial({
      id: t.id,
      name: document.getElementById('editTName').value,
      designation: document.getElementById('editTRole').value,
      date: document.getElementById('editTDate').value.trim(),
      review: document.getElementById('editTReview').value,
      placement: document.getElementById('editTPlacement').value,
      image: uploadedTImageBase64,
      rating: 5
    });
    modal.classList.remove('active');
    renderAdminSection('testimonials');
  });
};

window.openServiceModal = function() {
  const modal = document.getElementById('adminModal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  title.textContent = 'Create New Service Offering';
  body.innerHTML = `
    <form id="serviceForm">
      <div class="form-group">
        <label>Service Name *</label>
        <input type="text" id="srvName" class="form-control" required>
      </div>
      <div class="form-group">
        <label>Category Vertical *</label>
        <select id="srvCategory" class="form-control">
          <option>Business Consulting & Advisory</option>
          <option>Finance & Compliance</option>
          <option>Technology & Automation</option>
          <option>Corporate & Global Services</option>
        </select>
      </div>
      <div class="form-group">
        <label>Short Summary *</label>
        <input type="text" id="srvShort" class="form-control" required>
      </div>
      <div class="form-group">
        <label>Full Description *</label>
        <textarea id="srvDesc" class="form-control" rows="4" required></textarea>
      </div>
      <div class="form-group">
        <label>Key Features (comma separated)</label>
        <input type="text" id="srvFeatures" class="form-control" placeholder="Feature 1, Feature 2">
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;">Create Service</button>
    </form>
  `;

  modal.classList.add('active');

  document.getElementById('serviceForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const featStr = document.getElementById('srvFeatures').value;
    const features = featStr.split(',').map(f => f.trim()).filter(Boolean);

    window.gmStore.addService({
      name: document.getElementById('srvName').value,
      category: document.getElementById('srvCategory').value,
      shortDesc: document.getElementById('srvShort').value,
      description: document.getElementById('srvDesc').value,
      features: features,
      icon: 'star'
    });
    modal.classList.remove('active');
    renderAdminSection('services');
  });
};

window.openEditServiceModal = function(id) {
  const modal = document.getElementById('adminModal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  const s = window.gmStore.getServices().find(item => item.id === id);

  if (!s) return;

  title.textContent = 'Edit Service Offering';
  body.innerHTML = `
    <form id="editServiceForm">
      <div class="form-group">
        <label>Service Name *</label>
        <input type="text" id="editSrvName" class="form-control" value="${s.name}" required>
      </div>
      <div class="form-group">
        <label>Category Vertical *</label>
        <select id="editSrvCategory" class="form-control">
          <option ${s.category === 'Business Consulting & Advisory' ? 'selected' : ''}>Business Consulting & Advisory</option>
          <option ${s.category === 'Finance & Compliance' ? 'selected' : ''}>Finance & Compliance</option>
          <option ${s.category === 'Technology & Automation' ? 'selected' : ''}>Technology & Automation</option>
          <option ${s.category === 'Corporate & Global Services' ? 'selected' : ''}>Corporate & Global Services</option>
        </select>
      </div>
      <div class="form-group">
        <label>Short Summary *</label>
        <input type="text" id="editSrvShort" class="form-control" value="${s.shortDesc || ''}" required>
      </div>
      <div class="form-group">
        <label>Full Description *</label>
        <textarea id="editSrvDesc" class="form-control" rows="4" required>${s.description}</textarea>
      </div>
      <div class="form-group">
        <label>Key Features (comma separated)</label>
        <input type="text" id="editSrvFeatures" class="form-control" value="${s.features ? s.features.join(', ') : ''}">
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;">Update Service</button>
    </form>
  `;

  modal.classList.add('active');

  document.getElementById('editServiceForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const featStr = document.getElementById('editSrvFeatures').value;
    const features = featStr.split(',').map(f => f.trim()).filter(Boolean);

    window.gmStore.updateService({
      id: s.id,
      name: document.getElementById('editSrvName').value,
      category: document.getElementById('editSrvCategory').value,
      shortDesc: document.getElementById('editSrvShort').value,
      description: document.getElementById('editSrvDesc').value,
      features: features
    });
    modal.classList.remove('active');
    renderAdminSection('services');
  });
};

/* Delete Operations Attached to Window */
window.deleteService = function(id) { if (confirm('Delete this service offering?')) { window.gmStore.deleteService(id); renderAdminSection('services'); } };
window.deleteTeamMember = function(id) { if (confirm('Delete this team member profile?')) { window.gmStore.deleteTeamMember(id); renderAdminSection('team'); } };
window.deleteFaq = function(id) { if (confirm('Delete this FAQ?')) { window.gmStore.deleteFaq(id); renderAdminSection('faqs'); } };
window.deleteTestimonial = function(id) { if (confirm('Delete this testimonial?')) { window.gmStore.deleteTestimonial(id); renderAdminSection('testimonials'); } };
window.deleteBlog = function(id) { if (confirm('Delete this blog article?')) { window.gmStore.deleteBlog(id); renderAdminSection('blogs'); } };
window.deleteCaseStudy = function(id) { if (confirm('Delete this case study?')) { window.gmStore.deleteCaseStudy(id); renderAdminSection('case-studies'); } };

/* Modal Closer */
function initModalForm() {
  const modal = document.getElementById('adminModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  if (closeBtn && modal) {
    closeBtn.onclick = () => modal.classList.remove('active');
  }
}

/* Search Handler */
function initSearchHandler() {
  const searchInput = document.getElementById('adminSearchInput');
  const container = document.getElementById('adminTableContainer');

  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const q = e.target.value;
    switch (currentSection) {
      case 'services': renderServicesTable(container, q); break;
      case 'team': renderTeamTable(container, q); break;
      case 'faqs': renderFaqsTable(container, q); break;
      case 'testimonials': renderTestimonialsTable(container, q); break;
      case 'blogs': renderBlogsTable(container, q); break;
      case 'case-studies': renderCaseStudiesTable(container, q); break;
    }
  });
}

/* Backup Export & Import Handlers */
function initBackupHandlers() {
  const exportBtn = document.getElementById('exportBackupBtn');
  const importBtn = document.getElementById('importBackupBtn');
  const fileInput = document.getElementById('importFileInput');

  if (exportBtn) {
    exportBtn.onclick = () => {
      const json = window.gmStore.exportData();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `NRSR_Co_CMS_Backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    };
  }

  if (importBtn && fileInput) {
    importBtn.onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        const success = window.gmStore.importData(evt.target.result);
        if (success) {
          alert('CMS Backup data restored successfully!');
          renderAdminSection(currentSection);
        } else {
          alert('Failed to import backup file. Please check file format.');
        }
      };
      reader.readAsText(file);
    };
  }
}

/* 14. Leads Panel Renderer */
// Helper to fetch files from Git (supports GitHub REST API and Cloudflare Serverless Proxy)
async function fetchGitFile(path) {
  const oauthToken = localStorage.getItem('git_oauth_token');
  const isCloudflare = oauthToken === 'cloudflare_access' || window.API_ENGINE === 'cloudflare';

  const url = isCloudflare
    ? `/github_proxy?path=${encodeURIComponent('contents/' + path)}`
    : `https://api.github.com/repos/${window.GITHUB_REPOSITORY || 'NRSR_Coc/NRSR_Co-website'}/contents/${path}`;

  const headers = {};
  if (!isCloudflare && oauthToken) {
    headers['Authorization'] = `token ${oauthToken}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  
  const fileInfo = await res.json();
  const contentString = atob(fileInfo.content.replace(/\n/g, ''));
  return JSON.parse(contentString);
}

async function renderLeadsPanel(container) {
  container.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted); font-size:14px;">🔄 Loading contact inquiries from GitHub...</div>`;
  
  const oauthToken = localStorage.getItem('git_oauth_token');
  const isCloudflare = oauthToken === 'cloudflare_access' || window.API_ENGINE === 'cloudflare';
  
  if (!oauthToken && !isCloudflare) {
    container.innerHTML = `<div style="padding:24px; text-align:center; color:var(--color-primary); font-weight:700;">Please log in to view leads.</div>`;
    return;
  }

  const url = isCloudflare
    ? `/github_proxy?path=${encodeURIComponent('contents/data/leads')}`
    : `https://api.github.com/repos/${window.GITHUB_REPOSITORY || 'NRSR_Coc/NRSR_Co-website'}/contents/data/leads`;
  
  const headers = {};
  if (!isCloudflare && oauthToken) {
    headers['Authorization'] = `token ${oauthToken}`;
  }

  try {
    const res = await fetch(url, { headers });
    if (res.status === 404) {
      container.innerHTML = `
        <div style="background:#ffffff; padding:40px; border-radius:12px; border:var(--card-border); text-align:center; color:var(--text-muted);">
          <h3 style="font-size:18px; margin:0;">No leads captured yet.</h3>
          <p style="font-size:13px; margin-top:8px; color:var(--text-muted);">Submissions from the contact form will show up here automatically.</p>
        </div>
      `;
      return;
    }
    
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const files = await res.json();
    
    // Filter out files that are not JSON
    const leadFiles = files.filter(f => f.name.endsWith('.json')).reverse(); // Newest first
    
    if (leadFiles.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted);">No leads captured yet.</div>`;
      return;
    }

    container.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Date/Time</th>
            <th>Lead Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Service</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody id="leadsTableBody">
          ${leadFiles.map(f => {
            // Extract date from name "lead-TIMESTAMP.json"
            const timestamp = parseInt(f.name.replace('lead-', '').replace('.json', ''));
            const dateStr = isNaN(timestamp) ? f.name : new Date(timestamp).toLocaleString();
            return `
              <tr>
                <td style="font-weight:700;">${dateStr}</td>
                <td>Loading...</td>
                <td>Loading...</td>
                <td>Loading...</td>
                <td>Loading...</td>
                <td>
                  <button class="action-btn btn-edit" onclick="window.viewLeadDetails('${f.name}', '${f.path}')">View Message</button>
                  <button class="action-btn btn-delete" onclick="window.deleteLead('${f.name}', '${f.sha}')">Delete</button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;

    // Load contents asynchronously for each row using the secure helper
    leadFiles.forEach(async (f, idx) => {
      try {
        const lead = await fetchGitFile(f.path);
        const tbody = document.getElementById('leadsTableBody');
        if (tbody) {
          const row = tbody.children[idx];
          if (row) {
            row.children[1].textContent = lead.name || 'Anonymous';
            row.children[2].textContent = lead.email || '-';
            row.children[3].textContent = lead.phone || '-';
            row.children[4].innerHTML = `<span class="service-badge" style="font-size:11px;">${lead.service || 'General'}</span>`;
          }
        }
      } catch (e) {
        console.warn('Failed to load lead details:', e);
      }
    });
    
  } catch (e) {
    container.innerHTML = `<div style="color:red; padding:20px;">Failed to load leads from GitHub: ${e.message}</div>`;
  }
}

/* 15. Settings Panel Renderer */
function renderSettingsPanel(container) {
  const settings = window.gmStore.getSettings();
  const numbers = settings.whatsapp_numbers || [];

  container.innerHTML = `
    <div style="background:#ffffff; padding:32px; border-radius:14px; border:var(--card-border); box-shadow:var(--card-shadow); max-width:800px; display:flex; flex-direction:column; gap:28px;">
      <!-- Lead Notifications Config Block -->
      <div>
        <h3 style="font-size:18px; color:var(--color-slate); margin-top:0; margin-bottom:6px; font-weight:800;">🔔 Lead Email Notifications Dispatch</h3>
        <p style="font-size:13px; color:var(--text-muted); margin-bottom:16px; line-height:1.5;">Configure free, unlimited email notifications to multiple custom email addresses using GitHub Actions SMTP relay.</p>
        <div class="form-group">
          <label>Recipient Email Addresses (Comma separated)</label>
          <input type="text" id="setNotificationEmails" class="form-control" placeholder="e.g. likiths2546@gmail.com, partner@company.com" value="${settings.notification_emails || ''}">
        </div>
        <div style="margin-top:16px; padding:12px; background:var(--bg-main); border-radius:8px; border:1px solid rgba(7,26,54,0.15);">
          <p style="font-size:12px; margin:0; line-height:1.4;"><strong>💡 Alternate GitHub CRM notifications</strong>: You can still add GitHub Usernames below to also tag team members inside private repository Issues.</p>
          <input type="text" id="setNotificationUsernames" class="form-control" placeholder="GitHub Usernames (Comma separated)" value="${settings.notification_usernames || ''}" style="margin-top:8px; font-size:12px; padding:6px 12px;">
        </div>
      </div>

      <hr style="border:none; border-top:1px solid rgba(7,26,54,0.15);">

      <!-- ERP Configuration Block -->
      <div>
        <h3 style="font-size:18px; color:var(--color-slate); margin-top:0; margin-bottom:6px; font-weight:800;">🏢 Enterprise ERP Synchronization API</h3>
        <p style="font-size:13px; color:var(--text-muted); margin-bottom:16px; line-height:1.5;">Configure your corporate ERP API endpoint to automatically push new contact inquiries to your database.</p>
        <div class="form-group">
          <label>ERP Endpoint URL (POST Endpoint)</label>
          <input type="text" id="setErpUrl" class="form-control" placeholder="https://api.yourcompany.com/v1/leads" value="${settings.erp_api_url || ''}">
        </div>
        <div class="form-group">
          <label>API Authorization Key (Bearer Token Header)</label>
          <input type="password" id="setErpKey" class="form-control" placeholder="••••••••••••••••••••" value="${settings.erp_api_key || ''}">
        </div>
      </div>

      <hr style="border:none; border-top:1px solid rgba(7,26,54,0.15);">

      <!-- WhatsApp Support Routing Block -->
      <div>
        <h3 style="font-size:18px; color:var(--color-slate); margin-bottom:6px; font-weight:800;">💬 WhatsApp Contact Routing</h3>
        <p style="font-size:13px; color:var(--text-muted); margin-bottom:16px; line-height:1.5;">Manage active advisor WhatsApp numbers. If multiple contacts are added, the website shows a menu list for the user to choose.</p>
        
        <table class="admin-table" style="margin-bottom:16px;">
          <thead>
            <tr>
              <th>Advisor Name</th>
              <th>WhatsApp Phone (Include Country Code)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="waTableBody">
            ${numbers.map((n, idx) => `
              <tr>
                <td style="font-weight:700;">${n.name}</td>
                <td>+${n.number}</td>
                <td>
                  <button class="action-btn btn-delete" onclick="window.removeWaNumber(${idx})">Remove</button>
                </td>
              </tr>
            `).join('')}
            ${numbers.length === 0 ? '<tr><td colspan="3" style="text-align:center; color:var(--text-muted);">No WhatsApp contacts configured.</td></tr>' : ''}
          </tbody>
        </table>

        <div style="background:var(--bg-main); padding:16px; border-radius:8px; border:1px dashed var(--color-primary); display:flex; gap:12px; align-items:flex-end; flex-wrap:wrap;">
          <div class="form-group" style="flex:1; min-width:200px; margin:0;">
            <label style="font-size:11px; margin-bottom:4px; font-weight:700;">Advisor Name</label>
            <input type="text" id="addWaName" class="form-control" placeholder="e.g. Hrishikesh (Tech Lead)" style="padding:6px 12px; font-size:12px;">
          </div>
          <div class="form-group" style="flex:1; min-width:200px; margin:0;">
            <label style="font-size:11px; margin-bottom:4px; font-weight:700;">WhatsApp Number (No spaces/symbols)</label>
            <input type="text" id="addWaPhone" class="form-control" placeholder="e.g. 9108599083" style="padding:6px 12px; font-size:12px;">
          </div>
          <button class="btn btn-outline" onclick="window.addWaNumber()" style="padding:7px 16px; font-size:12px; height:34px; font-weight:700;">+ Add Contact</button>
        </div>
      </div>

      <button class="btn btn-primary" onclick="window.saveGlobalSettings()" style="width:100%; padding:12px; font-weight:800; font-size:15px; margin-top:10px;">💾 Save & Publish Global Settings</button>
    </div>
  `;
}

/* Global Settings Helper Methods */
window.addWaNumber = function() {
  const name = document.getElementById('addWaName').value.trim();
  const phone = document.getElementById('addWaPhone').value.trim().replace(/[^0-9]/g, '');
  if (!name || !phone) {
    alert('Please fill out both name and phone number.');
    return;
  }
  const settings = window.gmStore.getSettings();
  if (!settings.whatsapp_numbers) settings.whatsapp_numbers = [];
  settings.whatsapp_numbers.push({ name, number: phone });
  
  const container = document.getElementById('adminTableContainer');
  renderSettingsPanel(container);
};

window.removeWaNumber = function(idx) {
  const settings = window.gmStore.getSettings();
  settings.whatsapp_numbers.splice(idx, 1);
  const container = document.getElementById('adminTableContainer');
  renderSettingsPanel(container);
};

window.saveGlobalSettings = function() {
  const settings = window.gmStore.getSettings();
  settings.erp_api_url = document.getElementById('setErpUrl').value.trim();
  settings.erp_api_key = document.getElementById('setErpKey').value.trim();
  settings.notification_usernames = document.getElementById('setNotificationUsernames').value.trim();
  settings.notification_emails = document.getElementById('setNotificationEmails').value.trim();

  window.gmStore.saveSettings(settings);
  alert('Settings successfully pushed to GitHub! It will take about 20 seconds to compile live.');
};

/* Global Leads Helper Methods */
window.viewLeadDetails = async function(name, path) {
  const modal = document.getElementById('adminModal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  title.textContent = 'Contact Inquiry Details';
  body.innerHTML = `<div style="text-align:center; padding:20px;">Fetching lead data...</div>`;
  modal.classList.add('active');

  try {
    const lead = await fetchGitFile(path);

    body.innerHTML = `
      <div style="font-size:14px; line-height:1.6; display:flex; flex-direction:column; gap:16px;">
        <div><strong>Submitted:</strong> ${new Date(lead.submitted_at || Date.now()).toLocaleString()}</div>
        <div><strong>Sender Name:</strong> ${lead.name}</div>
        <div><strong>Email Address:</strong> <a href="mailto:${lead.email}">${lead.email}</a></div>
        <div><strong>Phone Number:</strong> <a href="tel:${lead.phone}">${lead.phone}</a></div>
        <div><strong>Selected Service Area:</strong> <span class="service-badge" style="font-size:12px;">${lead.service || 'General'}</span></div>
        <div style="background:var(--bg-main); padding:16px; border-radius:8px; border:1px solid rgba(7,26,54,0.15);">
          <strong style="display:block; margin-bottom:8px; color:var(--color-primary);">Message Text:</strong>
          <p style="white-space:pre-line; margin:0;">${lead.message}</p>
        </div>
        <button class="btn btn-primary" onclick="document.getElementById('adminModal').classList.remove('active')" style="width:100%; margin-top:10px;">Close Details</button>
      </div>
    `;
  } catch (e) {
    body.innerHTML = `<div style="color:red;">Error loading lead: ${e.message}</div>`;
  }
};

window.deleteLead = async function(name, sha) {
  if (!confirm('Are you sure you want to delete this lead?')) return;
  
  const oauthToken = localStorage.getItem('git_oauth_token');
  const isCloudflare = oauthToken === 'cloudflare_access' || window.API_ENGINE === 'cloudflare';
  
  const url = isCloudflare
    ? `/github_proxy?path=${encodeURIComponent(`contents/data/leads/${name}`)}`
    : `https://api.github.com/repos/${window.GITHUB_REPOSITORY || 'NRSR_Coc/NRSR_Co-website'}/contents/data/leads/${name}`;
  
  const headers = { 'Content-Type': 'application/json' };
  if (!isCloudflare && oauthToken) {
    headers['Authorization'] = `token ${oauthToken}`;
  }

  try {
    let fileSha = sha;
    const getRes = await fetch(url, { headers });
    if (getRes.ok) {
      const fileInfo = await getRes.json();
      fileSha = fileInfo.sha;
    }

    const res = await fetch(url, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({
        message: `lead: delete ${name}`,
        sha: fileSha,
        branch: 'Main'
      })
    });

    if (res.ok) {
      alert('Lead inquiry deleted successfully.');
      renderAdminSection('leads');
    } else {
      alert('Failed to delete lead from Git.');
    }
  } catch (e) {
    alert('Error deleting lead: ' + e.message);
  }
};
