// ── Tab Navigation ──

const TABS = 6;
let currentTab = 0;
let isMarried = false;

const panels = () => document.querySelectorAll('.tab-panel');
const tabBtns = () => document.querySelectorAll('.tab-btn');

function goTo(idx) {
  panels()[currentTab].classList.remove('active');
  tabBtns()[currentTab].classList.remove('active');
  currentTab = idx;
  panels()[currentTab].classList.add('active');
  tabBtns()[currentTab].classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  updateProgress();
  if (idx === 5) buildSummary();
}

// Smart "Next" — skips spouse tab (2) if not married
function goToNext(from) {
  if (from === 0) { goTo(1); return; }
  if (from === 1) { goTo(isMarried ? 2 : 3); return; }
  goTo(from + 1);
}

// Smart "Back" — skips spouse tab (2) if not married
function goToPrev(from) {
  if (from === 3) { goTo(isMarried ? 2 : 1); return; }
  goTo(from - 1);
}

function updateProgress() {
  const visibleTabs = document.querySelectorAll('.tab-btn:not(.hidden-tab)').length;
  const visibleIndex = Array.from(document.querySelectorAll('.tab-btn:not(.hidden-tab)')).findIndex(
    (_, i) => {
      const allBtns = Array.from(tabBtns());
      return allBtns.filter(b => !b.classList.contains('hidden-tab'))[i] === tabBtns()[currentTab];
    }
  ) + 1;
  const pct = (currentTab + 1) / TABS * 100;
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('stepInfo').textContent = `Step ${currentTab + 1} of ${TABS}`;
}

// Tab nav click delegation
document.getElementById('tabsNav').addEventListener('click', e => {
  const btn = e.target.closest('.tab-btn');
  if (!btn || btn.classList.contains('hidden-tab')) return;
  goTo(parseInt(btn.dataset.tab));
});
