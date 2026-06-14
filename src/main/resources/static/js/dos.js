// ── DOS Toggle ──
function toggleDos(type, show) {
  if (type === 'self') document.getElementById('dosInfoFields').style.display = show ? 'block' : 'none';
  if (type === 'rel')  document.getElementById('dosRelFields').style.display  = show ? 'block' : 'none';
  // Optional: Update summary if the toggle itself changes
  if (typeof buildSummary === 'function') buildSummary();
}

// ── DOS Related Repeater ──
let dosRelCount = 0;

function addDosRel() {
  dosRelCount++; // Increment the counter
  const id = dosRelCount; // Assign to a local constant
  const container = document.getElementById('dosRelContainer');
  const div = document.createElement('div');
  
  div.id = 'dosrel-' + id; 
  div.className = 'dos-rel-card';
  
  div.innerHTML = `
    <button type="button" class="remove-btn" onclick="removeDosRel('dosrel-${id}')">Remove</button>
    <div class="sup-card-title">DOS Relative</div>
    <div class="form-grid">
      <div class="field">
        <label>Name of D.O.S. Relative <span class="req">*</span></label>
        <input type="text" name="DOS_REL_NAME_${id}" class="dos-rel-name" placeholder="Full name" maxlength="30" required>
      </div>
      <div class="field">
        <label>Your Relationship <span class="req">*</span></label>
        <input type="text" name="DOS_REL_${id}" class="dos-rel-type" placeholder="e.g. Brother, Parent" maxlength="15" required>
      </div>
      <div class="field col-2">
        <label>BPI Company / Subsidiary <span class="req">*</span></label>
        <input type="text" name="DOS_REL_COMP_${id}" class="dos-rel-comp" placeholder="e.g. BPI" maxlength="30" required>
      </div>
    </div>`;
  
  container.appendChild(div);
  if (typeof buildSummary === 'function') buildSummary();
}

function removeDosRel(elementId) {
  const el = document.getElementById(elementId);
  if (el) el.remove();
  if (typeof buildSummary === 'function') buildSummary();
}