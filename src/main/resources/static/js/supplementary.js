// ── Supplementary Cardholder Repeater ──

let supCount = 0;

function addSup() {
  if (supCount >= 2) { showToast('Maximum of 2 supplementary cardholders allowed.'); return; }
  supCount++;
  const id = supCount;
  const container = document.getElementById('supContainer');
  const div = document.createElement('div');
  div.className = 'sup-card';
  div.id = 'sup-' + id;
  div.innerHTML = `
    <button type="button" class="remove-btn" onclick="removeSup(${id})">Remove</button>
    <div class="sup-card-title">Supplementary Cardholder #${id}</div>
    <div class="form-grid">
      <div class="field col-2">
        <label>Full Name <span class="req">*</span></label>
        <input type="text" name="SUP_NAME_${id}" placeholder="Last, First, Middle" maxlength="30">
      </div>
      <div class="field">
        <label>Date of Birth <span class="req">*</span></label>
        <input type="date" name="SUP_BDATE_${id}">
      </div>
      <div class="field">
        <label>Place of Birth <span class="req">*</span></label>
        <input type="text" name="SUP_BPLACE_${id}" placeholder="City" maxlength="50">
      </div>
      <div class="field">
        <label>Sex <span class="req">*</span></label>
        <div class="radio-group">
          <label class="radio-item"><input type="radio" name="SUP_SEX_${id}" value="M"> Male</label>
          <label class="radio-item"><input type="radio" name="SUP_SEX_${id}" value="F"> Female</label>
        </div>
      </div>
      <div class="field">
        <label>Civil Status <span class="req">*</span></label>
        <select name="SUP_STATUS_${id}">
          <option value="">Select</option>
          <option value="SINGLE">Single</option>
          <option value="MARRIED">Married</option>
          <option value="SEPARATED">Separated</option>
          <option value="WIDOWED">Widowed</option>
        </select>
      </div>
      <div class="field">
        <label>Citizenship <span class="req">*</span></label>
        <input type="text" name="SUP_CITIZEN_${id}" placeholder="e.g. Filipino" maxlength="15">
      </div>
      <div class="field">
        <label>Relationship to Principal <span class="req">*</span></label>
        <input type="text" name="REL_PRINCIPAL_${id}" placeholder="e.g. Spouse, Child" maxlength="10">
      </div>
      <div class="field">
        <label>Mobile Number <span class="req">*</span></label>
        <div class="input-prefix">
          <span class="prefix-tag">+63</span>
          <input type="tel" name="SUP_MOBILENO_${id}" placeholder="9XXXXXXXXX" maxlength="10">
        </div>
      </div>
      <div class="field">
        <label>Home Phone <span class="opt">(optional)</span></label>
        <input type="tel" name="SUP_HOME_NO_${id}" placeholder="02-XXXXXXXX" maxlength="15">
      </div>
      <div class="field col-2">
        <label>Home Address <span class="req">*</span></label>
        <input type="text" name="SUP_ADDR_${id}" placeholder="Blk, Lot, Street, Brgy, City" maxlength="100">
      </div>
      <div class="field col-2">
        <label>Email Address <span class="req">*</span></label>
        <input type="email" name="SUP_EMAIL_${id}" placeholder="email@email.com" maxlength="50">
      </div>
      <div class="field col-2">
        <label>Employer <span class="req">*</span></label>
        <input type="text" name="SUP_EMPLOYER_${id}" placeholder="Employer or School name" maxlength="30">
      </div>
      <div class="field col-2">
        <label>Employer / Business Address <span class="req">*</span></label>
        <input type="text" name="SUP_EMP_ADDR_${id}" placeholder="Office address" maxlength="100">
      </div>
      <div class="field">
        <label>Nature of Business <span class="req">*</span></label>
        <input type="text" name="SUP_BUSINESS_${id}" placeholder="e.g. Retail" maxlength="15">
      </div>
      <div class="field">
        <label>Office Number <span class="req">*</span></label>
        <input type="tel" name="SUP_OFFICE_NO_${id}" placeholder="02-XXXXXXXX" maxlength="15">
      </div>
      <div class="field">
        <label>Source of Funds <span class="req">*</span></label>
        <select name="SUP_FUNDS_${id}">
          <option value="">Select</option>
          <option value="Salary">Salary</option>
          <option value="Business">Business</option>
          <option value="Allowance">Allowance</option>
          <option value="Commission">Commission</option>
          <option value="Remittance">Remittance</option>
          <option value="Pension">Pension</option>
        </select>
      </div>
    </div>`;
  container.appendChild(div);
  if (supCount >= 2) document.getElementById('addSupBtn').style.display = 'none';
}

function removeSup(id) {
  document.getElementById('sup-' + id).remove();
  supCount--;
  document.getElementById('addSupBtn').style.display = 'flex';
}
