// ── Toast Notification ──

function showToast(msg, duration = 3000) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

// ── Form Submit ──

document.getElementById('appForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const decl = document.querySelector('[name="DECLARATION"]');
  if (!decl.checked) {
    showToast('Please accept the declaration to submit.');
    return;
  }

  const fd = new FormData(this);

  // ── Business rule + required field validation ──
  if (!validateForm(fd)) return;

  // ── Build structured payload ──

  const applicant = new Applicant(fd);
  const work      = new Work(fd);
  const dos       = new DOS(fd);

  // Spouse: only include if married
  const spouse = isMarried ? new Spouse(fd) : null;

  // DOS Relatives: collect all rendered cards by scanning the DOM
  const dosRelCards = document.querySelectorAll('[id^="dosrel-"]');
  const dosrel = Array.from(dosRelCards).map(card => {
    const id = card.id.replace('dosrel-', '');
    return new DOSRel(fd, id);
  });

  // Supplementary cardholders: collect all rendered cards by scanning the DOM
  const supCards = document.querySelectorAll('[id^="sup-"]');
  const supplementarycardholder = Array.from(supCards).map(card => {
    const id = card.id.replace('sup-', '');
    return new SupplementaryCardholder(fd, id);
  });

  const payload = {
    applicant,
    work,
    spouse,
    dos,
    dosrel,
    supplementarycardholder,
  };

  console.log("SENDING THIS JSON PAYLOAD:", JSON.stringify(payload, null, 2));
  
  try {
    const res = await fetch('/bpi/create', {   // ← replace with your actual endpoint
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      showToast(`Submission failed: ${res.status} — ${errText}`, 5000);
      return;
    }

    showToast('✓ Application submitted successfully! You will receive a confirmation email shortly.', 5000);

    // ── Reset form state ──
    setTimeout(() => {
      goTo(0);
      this.reset();
      supCount    = 0;
      dosRelCount = 0;
      document.getElementById('supContainer').innerHTML    = '';
      document.getElementById('dosRelContainer').innerHTML = '';
      document.getElementById('dosInfoFields').style.display  = 'none';
      document.getElementById('dosRelFields').style.display   = 'none';
      document.getElementById('addSupBtn').style.display      = 'flex';
    }, 5500);

  } catch (err) {
    console.error('Submit error:', err);
    showToast('Network error — please check your connection and try again.', 5000);
  }
});