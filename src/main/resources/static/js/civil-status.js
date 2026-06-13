// ── Civil Status Handler ──

function onCivilStatusChange(val) {
  isMarried = val === 'M';
  const spouseBtn = document.getElementById('spouseTabBtn');
  if (isMarried) {
    spouseBtn.classList.remove('hidden-tab');
  } else {
    spouseBtn.classList.add('hidden-tab');
    // If currently on spouse tab, redirect to DOS
    if (currentTab === 2) goTo(3);
  }
}
