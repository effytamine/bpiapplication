// ── DOS Toggle ──

function toggleDos(type, show) {
  if (type === 'self') document.getElementById('dosInfoFields').style.display = show ? 'block' : 'none';
  if (type === 'rel')  document.getElementById('dosRelFields').style.display  = show ? 'block' : 'none';
}

// ── DOS Related Repeater ──

let dosRelCount = 0;

function addDosRel() {
  dosRelCount++;
  const id = dosRelCount;
  const container = document.getElementById('dosRelContainer');
  const div = document.createElement('div');
  div.className = 'dos-rel-card';
  div.id = 'dosrel-' + id;
  div.innerHTML = `
    <button type="button" class="remove-btn" onclick="this.parentElement.remove()">Remove</button>
    <div class="sup-card-title">DOS Relative #${id}</div>
    <div class="form-grid">
      <div class="field">
        <label>Name of D.O.S. Relative <span class="req">*</span></label>
        <input type="text" name="DOS_REL_NAME_${id}" placeholder="Full name" maxlength="30">
      </div>
      <div class="field">
        <label>Your Relationship <span class="req">*</span></label>
        <input type="text" name="DOS_REL_${id}" placeholder="e.g. Brother, Parent" maxlength="15">
      </div>
      <div class="field col-2">
        <label>BPI Company / Subsidiary <span class="req">*</span></label>
        <input type="text" name="DOS_REL_COMP_${id}" placeholder="e.g. BPI" maxlength="30">
      </div>
    </div>`;
  container.appendChild(div);
}
