// ── Admin Panel ───────────────────────────────────────────────────────────────

const READ_QUERIES = [
  { id: 1,  label: 'Applicants in Manila / Cavite',               desc: 'Displays the applicant ID and name of all applicants whose home address is in Manila or Cavite.', formatters: {} },
  { id: 2,  label: 'Non-Filipino Citizens',                        desc: 'Displays applicant ID, name, email, and citizenship of applicants whose citizenship is not Filipino.', formatters: {} },
  { id: 3,  label: 'Income ₱20k–₱60k · 4+ Yrs · Inc./Corp.',     desc: 'Applicants with monthly income between ₱20,000–₱60,000, employed 4+ years, whose employer ends with "Inc." or "Corp."', formatters: { monthly_income: formatPeso } },
  { id: 4,  label: 'DOS Applicants (Dir. / Officer / Stockholder)', desc: 'Applicants who are a Director, Officer, or Stockholder of BPI or any BPI Subsidiary/Affiliate, sorted alphabetically.', formatters: {} },
  { id: 5,  label: 'Avg Income by Education Level',               desc: 'Average monthly income per education level. Only shows levels where the average exceeds ₱50,000.', formatters: { average_income: formatPeso } },
  { id: 6,  label: 'Applicant Count by Birthplace',               desc: 'Total number of applicants born in each location. Only birthplaces with more than 3 applicants, descending.', formatters: {} },
  { id: 7,  label: 'Married Applicants · Income > ₱50k',          desc: 'Primary applicant name, spouse name, employer, and monthly income for applicants earning more than ₱50,000.', formatters: { monthly_income: formatPeso } },
  { id: 8,  label: 'Married · Not Manila · Sibling/Other Sup.',   desc: 'Married applicants not residing in Manila whose supplementary cardholder relationship is "Sibling" or "Other".', formatters: {} },
  { id: 9,  label: 'Cavite/Laguna · Relative Sup. · > ₱200k',    desc: 'Applicants in Cavite or Laguna, with a corporate email and a "Relative" supplementary cardholder. Only birthplaces where combined income exceeds ₱200,000.', formatters: { total_group_income: formatPeso } },
  { id: 10, label: 'Car Ownership Stats · Age 40+ · 5+ Yrs Res.', desc: 'Car ownership status, average dependents, and total monthly income. Filters: age ≥ 40, employment type "Employed", residence ≥ 5 years, combined income > ₱150,000.', formatters: { average_dependents: formatDecimal, total_monthly_income: formatPeso } },
];

const ACTIVE_QUERIES = [
  {
    id: 11,
    label: 'Delete High-Risk Supplementary Cardholders',
    desc: 'Removes supplementary cardholders linked to high-risk principals: no car owned, less than 2 years of residence, and monthly income below ₱35,000.',
    execLabel: 'Run DELETE',
    execBtnClass: 'aq-btn-delete',
    execStepBadge: 'exec',
    seedDesc: 'Inserts 2 principal applicants (IDs 31–32) with their high-risk profiles and supplementary cardholders to test the delete query.',
    verifyDesc: 'Shows the supplementary cardholder rows that match the high-risk criteria and will be removed by the delete.',
    execDesc: 'Permanently deletes the matching supplementary cardholder rows from the database.',
    execConfirm: 'This will permanently DELETE the matched supplementary cardholder rows. Are you sure?',
  },
  {
    id: 12,
    label: 'Update Employer for Cebu / Pasig City Sups.',
    desc: 'Reassigns the employer and business sector of supplementary cardholders linked to principals in Cebu City or Pasig City whose source of funds is not "Allowance" — to BPI Unibank / Banking.',
    execLabel: 'Run UPDATE',
    execBtnClass: 'aq-btn-update',
    execStepBadge: 'exec',
    seedDesc: 'Inserts 2 principal applicants (IDs 33–34) in Cebu City and Pasig City with working supplementary cardholders to test the update query.',
    verifyDesc: 'Shows the supplementary cardholder rows that will be affected, with their current employer and business sector values before the update.',
    execDesc: 'Updates sup_employer to "BPI Unibank" and sup_business to "Banking" for all matched rows.',
    execConfirm: 'This will UPDATE the matched supplementary cardholder rows. Are you sure?',
  },
];

// ── Formatters ────────────────────────────────────────────────────────────────

function formatPeso(val) {
  if (val === null || val === undefined) return '—';
  return '₱ ' + Number(val).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDecimal(val) {
  if (val === null || val === undefined) return '—';
  return Number(val).toFixed(2);
}

function formatColumnHeader(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// ── State ─────────────────────────────────────────────────────────────────────

let adminVisible  = false;
let activeQueryId = null;
let adminSidebarTab = 'read'; // 'read' | 'active'

// ── Toggle ────────────────────────────────────────────────────────────────────

function toggleAdmin() {
  adminVisible = !adminVisible;
  const adminPanel = document.getElementById('adminPanel');
  const pageWrap   = document.querySelector('.page-wrap');
  const toggleBtn  = document.getElementById('adminToggleBtn');

  if (adminVisible) {
    adminPanel.classList.add('visible');
    pageWrap.style.display = 'none';
    toggleBtn.textContent  = '← Back to Application';
    toggleBtn.classList.add('active');
  } else {
    adminPanel.classList.remove('visible');
    pageWrap.style.display = '';
    toggleBtn.textContent  = 'Admin View';
    toggleBtn.classList.remove('active');
  }
}

// ── Sidebar tab switching ─────────────────────────────────────────────────────

function switchSidebarTab(tab) {
  adminSidebarTab = tab;
  activeQueryId = null;

  document.querySelectorAll('.admin-sidebar-tab').forEach(b =>
    b.classList.toggle('active', b.dataset.tab === tab)
  );
  document.querySelectorAll('.admin-query-list').forEach(l =>
    l.classList.toggle('visible', l.dataset.list === tab)
  );

  // Reset results area to placeholder
  showPlaceholder();
}

// ── Build sidebar ─────────────────────────────────────────────────────────────

function buildAdminSidebar() {
  // Read list
  const readList = document.getElementById('adminSidebarRead');
  READ_QUERIES.forEach(q => {
    const btn = document.createElement('button');
    btn.className   = 'admin-query-btn';
    btn.dataset.qid = q.id;
    btn.innerHTML   = `<span class="q-num">${q.id}</span>${q.label}`;
    btn.addEventListener('click', () => runReadQuery(q.id));
    readList.appendChild(btn);
  });

  // Active list
  const activeList = document.getElementById('adminSidebarActive');
  ACTIVE_QUERIES.forEach(q => {
    const btn = document.createElement('button');
    btn.className   = 'admin-query-btn active-type';
    btn.dataset.qid = q.id;
    btn.innerHTML   = `<span class="q-num">${q.id}</span>${q.label}`;
    btn.addEventListener('click', () => renderActiveQuery(q.id));
    activeList.appendChild(btn);
  });
}

// ── Read query runner ─────────────────────────────────────────────────────────

async function runReadQuery(id) {
  activeQueryId = id;
  const q = READ_QUERIES.find(x => x.id === id);

  highlightSidebarBtn(id);

  const area = document.getElementById('adminResultsArea');
  area.innerHTML = `
    <div class="admin-results-card">
      <div class="admin-results-title">${q.label}</div>
      <div class="admin-results-desc">${q.desc}</div>
      <div class="admin-loading"><div class="admin-spinner"></div> Running query…</div>
    </div>`;

  try {
    const res  = await fetch(`/bpi/admin/query/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data || `Server returned ${res.status}`);

    area.innerHTML = `
      <div class="admin-results-card">
        <div class="admin-results-title">${q.label}</div>
        <div class="admin-results-desc">${q.desc}</div>
        ${renderTable(data, q.formatters)}
      </div>`;
  } catch (err) {
    area.innerHTML = `
      <div class="admin-results-card">
        <div class="admin-results-title">${q.label}</div>
        <div class="admin-results-desc">${q.desc}</div>
        <div class="admin-error">⚠ ${err.message}</div>
      </div>`;
  }
}

// ── Active query panel renderer ───────────────────────────────────────────────

function renderActiveQuery(id) {
  activeQueryId = id;
  const q = ACTIVE_QUERIES.find(x => x.id === id);
  highlightSidebarBtn(id);

  const area = document.getElementById('adminResultsArea');
  area.innerHTML = `
    <div class="admin-results-card">
      <div class="admin-results-title">${q.label}</div>
      <div class="admin-results-desc">${q.desc}</div>

      <!-- ① Seed -->
      <div class="aq-section">
        <div class="aq-section-header">
          <span class="aq-step-badge seed">1</span>
          <span class="aq-section-title">Seed Test Data</span>
          <span class="aq-section-subtitle">${q.seedDesc}</span>
        </div>
        <div class="aq-section-body">
          <button class="aq-btn aq-btn-seed" id="aq-seed-${id}" onclick="runSeed(${id})">
            ＋ Populate Test Data
          </button>
          <div class="aq-feedback" id="aq-seed-feedback-${id}"></div>
        </div>
      </div>

      <!-- ② Verify -->
      <div class="aq-section">
        <div class="aq-section-header">
          <span class="aq-step-badge verify">2</span>
          <span class="aq-section-title">Verification Query</span>
          <span class="aq-section-subtitle">${q.verifyDesc}</span>
        </div>
        <div class="aq-section-body">
          <button class="aq-btn aq-btn-verify" id="aq-verify-${id}" onclick="runVerify(${id})">
            ⊙ Run Verification
          </button>
          <div class="aq-feedback" id="aq-verify-feedback-${id}"></div>
        </div>
      </div>

      <!-- ③ Execute -->
      <div class="aq-section">
        <div class="aq-section-header">
          <span class="aq-step-badge ${q.execStepBadge}">3</span>
          <span class="aq-section-title">Execute</span>
          <span class="aq-section-subtitle">${q.execDesc}</span>
        </div>
        <div class="aq-section-body">
          <button class="aq-btn ${q.execBtnClass}" id="aq-exec-${id}" onclick="runExecute(${id}, '${q.execConfirm.replace(/'/g, "\\'")}')">
            ⚡ ${q.execLabel}
          </button>
          <div class="aq-feedback" id="aq-exec-feedback-${id}"></div>
        </div>
      </div>
    </div>`;
}

// ── Seed ──────────────────────────────────────────────────────────────────────

async function runSeed(id) {
  const btn      = document.getElementById(`aq-seed-${id}`);
  const feedback = document.getElementById(`aq-seed-feedback-${id}`);
  btn.disabled   = true;
  feedback.innerHTML = `<div class="admin-loading"><div class="admin-spinner"></div> Inserting seed data…</div>`;

  try {
    const res  = await fetch(`/bpi/admin/seed/${id}`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || `Server returned ${res.status}`);
    feedback.innerHTML = `<div class="aq-success">✓ ${data.message}</div>`;
  } catch (err) {
    feedback.innerHTML = `<div class="admin-error">⚠ ${err.message}</div>`;
  } finally {
    btn.disabled = false;
  }
}

// ── Verify ────────────────────────────────────────────────────────────────────

async function runVerify(id) {
  const btn      = document.getElementById(`aq-verify-${id}`);
  const feedback = document.getElementById(`aq-verify-feedback-${id}`);
  btn.disabled   = true;
  feedback.innerHTML = `<div class="admin-loading"><div class="admin-spinner"></div> Running verification…</div>`;

  const pesoFields   = ['monthly_income', 'total_group_income', 'total_monthly_income'];
  const formatters   = Object.fromEntries(pesoFields.map(f => [f, formatPeso]));

  try {
    const res  = await fetch(`/bpi/admin/query/${id}/verify`);
    const data = await res.json();
    if (!res.ok) throw new Error(data || `Server returned ${res.status}`);
    feedback.innerHTML = `<div class="aq-feedback">${renderTable(data, formatters)}</div>`;
  } catch (err) {
    feedback.innerHTML = `<div class="admin-error">⚠ ${err.message}</div>`;
  } finally {
    btn.disabled = false;
  }
}

// ── Execute ───────────────────────────────────────────────────────────────────

async function runExecute(id, confirmMsg) {
  if (!confirm(confirmMsg)) return;

  const btn      = document.getElementById(`aq-exec-${id}`);
  const feedback = document.getElementById(`aq-exec-feedback-${id}`);
  const isDelete = id === 11;
  btn.disabled   = true;
  feedback.innerHTML = `<div class="admin-loading"><div class="admin-spinner"></div> Executing…</div>`;

  try {
    const res  = await fetch(`/bpi/admin/query/${id}/execute`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || `Server returned ${res.status}`);
    const cls = isDelete ? 'aq-success aq-success-delete' : 'aq-success';
    const icon = isDelete ? '🗑' : '✓';
    feedback.innerHTML = `<div class="${cls}">${icon} ${data.message}</div>`;
  } catch (err) {
    feedback.innerHTML = `<div class="admin-error">⚠ ${err.message}</div>`;
  } finally {
    btn.disabled = false;
  }
}

// ── Table renderer ────────────────────────────────────────────────────────────

function renderTable(rows, formatters = {}) {
  if (!rows || rows.length === 0)
    return '<div class="admin-empty">No records matched this query.</div>';

  const cols  = Object.keys(rows[0]);
  const thead = `<thead><tr>${cols.map(c => `<th>${formatColumnHeader(c)}</th>`).join('')}</tr></thead>`;
  const tbody = `<tbody>${rows.map(row =>
    `<tr>${cols.map(c => {
      const raw = row[c];
      const val = formatters[c] ? formatters[c](raw) : (raw ?? '—');
      return `<td>${val}</td>`;
    }).join('')}</tr>`
  ).join('')}</tbody>`;

  return `
    <div class="admin-table-wrap"><table class="admin-table">${thead}${tbody}</table></div>
    <div class="admin-row-count">${rows.length} row${rows.length !== 1 ? 's' : ''} returned</div>`;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function highlightSidebarBtn(id) {
  document.querySelectorAll('.admin-query-btn').forEach(b =>
    b.classList.toggle('active', parseInt(b.dataset.qid) === id)
  );
}

function showPlaceholder() {
  document.getElementById('adminResultsArea').innerHTML = `
    <div class="admin-results-card">
      <div class="admin-placeholder">
        <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M9 17v-2a4 4 0 014-4h0a4 4 0 014 4v2M7 17v-2a6 6 0 016-6h0a6 6 0 016 6v2
               M3 21h18M12 3a4 4 0 100 8 4 4 0 000-8z"/>
        </svg>
        Select a query from the sidebar to view results.
      </div>
    </div>`;
}

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  buildAdminSidebar();
  document.getElementById('adminToggleBtn').addEventListener('click', toggleAdmin);

  // Sidebar tab clicks
  document.querySelectorAll('.admin-sidebar-tab').forEach(btn =>
    btn.addEventListener('click', () => switchSidebarTab(btn.dataset.tab))
  );

  showPlaceholder();
});