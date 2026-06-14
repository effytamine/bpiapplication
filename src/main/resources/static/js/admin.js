// ── Admin Panel ───────────────────────────────────────────────────────────────

const ADMIN_QUERIES = [
  {
    id: 1,
    label: 'Applicants in Manila / Cavite',
    desc: 'Displays the applicant ID and name of all applicants whose home address is in Manila or Cavite.',
    formatters: {}
  },
  {
    id: 2,
    label: 'Non-Filipino Citizens',
    desc: 'Displays applicant ID, name, email, and citizenship of applicants whose citizenship is not Filipino.',
    formatters: {}
  },
  {
    id: 3,
    label: 'Income ₱20k–₱60k · 4+ Years · Inc./Corp.',
    desc: 'Applicants with monthly income between ₱20,000–₱60,000, employed 4+ years, whose employer ends with "Inc." or "Corp."',
    formatters: { monthly_income: formatPeso }
  },
  {
    id: 4,
    label: 'DOS Applicants (Dir. / Officer / Stockholder)',
    desc: 'Applicants who are a Director, Officer, or Stockholder of BPI or any BPI Subsidiary/Affiliate, sorted alphabetically.',
    formatters: {}
  },
  {
    id: 5,
    label: 'Avg Income by Education Level',
    desc: 'Average monthly income per education level. Only shows levels where the average exceeds ₱50,000.',
    formatters: { average_income: formatPeso }
  },
  {
    id: 6,
    label: 'Applicant Count by Birthplace',
    desc: 'Total number of applicants born in each location. Only birthplaces with more than 3 applicants, descending.',
    formatters: {}
  },
  {
    id: 7,
    label: 'Married Applicants · Income > ₱50k',
    desc: 'Primary applicant name, spouse name, employer, and monthly income for applicants earning more than ₱50,000.',
    formatters: { monthly_income: formatPeso }
  },
  {
    id: 8,
    label: 'Married · Not Manila · Sibling/Other Sup.',
    desc: 'Married applicants not residing in Manila whose supplementary cardholder relationship is "Sibling" or "Other".',
    formatters: {}
  },
  {
    id: 9,
    label: 'Cavite/Laguna · Relative Sup. · Income > ₱200k',
    desc: 'Applicants in Cavite or Laguna, with a corporate email and a "Relative" supplementary cardholder. Only birthplaces where combined income exceeds ₱200,000.',
    formatters: { total_group_income: formatPeso }
  },
  {
    id: 10,
    label: 'Car Ownership Stats · Age 40+ · Employed · 5+ Yrs Res.',
    desc: 'Car ownership status, average dependents, and total monthly income. Filters: age ≥ 40, employment type "Employed", residence ≥ 5 years, combined income > ₱150,000.',
    formatters: { average_dependents: formatDecimal, total_monthly_income: formatPeso }
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
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

// ── State ─────────────────────────────────────────────────────────────────────

let adminVisible   = true;
let activeQueryId  = null;

// ── Toggle between app form and admin panel ───────────────────────────────────

function toggleAdmin() {
  adminVisible = !adminVisible;

  const adminPanel   = document.getElementById('adminPanel');
  const pageWrap     = document.querySelector('.page-wrap');
  const toggleBtn    = document.getElementById('adminToggleBtn');

  if (adminVisible) {
    adminPanel.classList.add('visible');
    pageWrap.style.display  = 'none';
    toggleBtn.textContent   = '← Back to Application';
    toggleBtn.classList.add('active');
  } else {
    adminPanel.classList.remove('visible');
    pageWrap.style.display  = '';
    toggleBtn.textContent   = 'Admin View';
    toggleBtn.classList.remove('active');
  }
}

// ── Build sidebar once on load ────────────────────────────────────────────────

function buildAdminSidebar() {
  const sidebar = document.getElementById('adminSidebar');
  sidebar.innerHTML = '';

  ADMIN_QUERIES.forEach(q => {
    const btn = document.createElement('button');
    btn.className   = 'admin-query-btn';
    btn.dataset.qid = q.id;
    btn.innerHTML   = `<span class="q-num">${q.id}</span>${q.label}`;
    btn.addEventListener('click', () => runAdminQuery(q.id));
    sidebar.appendChild(btn);
  });
}

// ── Run a query and render results ────────────────────────────────────────────

async function runAdminQuery(id) {
  activeQueryId = id;
  const q = ADMIN_QUERIES.find(x => x.id === id);

  // Highlight active sidebar button
  document.querySelectorAll('.admin-query-btn').forEach(b => {
    b.classList.toggle('active', parseInt(b.dataset.qid) === id);
  });

  const resultsArea = document.getElementById('adminResultsArea');

  // Loading state
  resultsArea.innerHTML = `
    <div class="admin-results-card">
      <div class="admin-results-title">${q.label}</div>
      <div class="admin-results-desc">${q.desc}</div>
      <div class="admin-loading">
        <div class="admin-spinner"></div> Running query…
      </div>
    </div>
  `;

  try {
    const res  = await fetch(`/bpi/admin/query/${id}`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data || `Server returned ${res.status}`);
    }

    resultsArea.innerHTML = `
      <div class="admin-results-card">
        <div class="admin-results-title">${q.label}</div>
        <div class="admin-results-desc">${q.desc}</div>
        ${renderTable(data, q.formatters)}
      </div>
    `;
  } catch (err) {
    resultsArea.innerHTML = `
      <div class="admin-results-card">
        <div class="admin-results-title">${q.label}</div>
        <div class="admin-results-desc">${q.desc}</div>
        <div class="admin-error">⚠ ${err.message}</div>
      </div>
    `;
  }
}

// ── Table renderer ────────────────────────────────────────────────────────────

function renderTable(rows, formatters = {}) {
  if (!rows || rows.length === 0) {
    return '<div class="admin-empty">No records matched this query.</div>';
  }

  const cols = Object.keys(rows[0]);

  const thead = `
    <thead>
      <tr>${cols.map(c => `<th>${formatColumnHeader(c)}</th>`).join('')}</tr>
    </thead>
  `;

  const tbody = `
    <tbody>
      ${rows.map(row => `
        <tr>
          ${cols.map(c => {
            const raw = row[c];
            const val = formatters[c] ? formatters[c](raw) : (raw ?? '—');
            return `<td>${val}</td>`;
          }).join('')}
        </tr>
      `).join('')}
    </tbody>
  `;

  return `
    <div class="admin-table-wrap">
      <table class="admin-table">${thead}${tbody}</table>
    </div>
    <div class="admin-row-count">${rows.length} row${rows.length !== 1 ? 's' : ''} returned</div>
  `;
}

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  buildAdminSidebar();

  document.getElementById('adminToggleBtn')
          .addEventListener('click', toggleAdmin);

  // Default placeholder in results area
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
    </div>
  `;
});