// ── Validation ────────────────────────────────────────────────────────────────
// Runs before form submission. Returns true if valid, false + toast if not.

function validateForm(fd) {
  const errors = [];

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const get = key => {
    const val = fd.get(key);
    if (val === null || val === undefined) return '';
    const cleanStr = String(val).trim();
    return cleanStr.toLowerCase() === 'null' ? '' : cleanStr;
  };

  const getNum  = key => parseFloat(fd.get(key));
  
  // Helper to push errors tagged with their specific step/section title
  const missing = (key, label, section) => { 
    if (!get(key)) errors.push({ section, label }); 
  };

  // ── Tab 0: About Me ───────────────────────────────────────────────────────────
  const SEC_ABOUT = "About Me";
  missing('APP_NAME',     'Full Name', SEC_ABOUT);
  missing('CARD_NAME',    'Name to Appear on Card', SEC_ABOUT);
  missing('APP_BDATE',    'Date of Birth', SEC_ABOUT);
  missing('APP_BPLACE',   'Place of Birth', SEC_ABOUT);
  missing('APP_SEX',      'Sex', SEC_ABOUT);
  missing('CIVIL_STATUS', 'Civil Status', SEC_ABOUT);
  missing('CITIZENSHIP',  'Citizenship', SEC_ABOUT);
  missing('MOTHER_NAME',  "Mother's Full Maiden Name", SEC_ABOUT);
  missing('HOME_ADDRESS', 'Home Address', SEC_ABOUT);
  missing('CARD_ADDR',    'Preferred Card Delivery Address', SEC_ABOUT);
  missing('APP_TIN',      'TIN', SEC_ABOUT);
  missing('SSS_GSIS',     'SSS / GSIS Number', SEC_ABOUT);
  missing('CAR_OWN',      'Car Ownership', SEC_ABOUT);
  missing('EDU_LEVEL',    'Educational Attainment', SEC_ABOUT);

  if (get('DEPENDENTS') === '')
    errors.push({ section: SEC_ABOUT, label: 'Number of Dependents' });

  if (get('YRS_RES') === '')
    errors.push({ section: SEC_ABOUT, label: 'Years in Current Residence' });

  missing('MOBILE_NO', 'Mobile Number', SEC_ABOUT);
  missing('APP_EMAIL', 'Email Address', SEC_ABOUT);

  const bdate = get('APP_BDATE');
  if (bdate) {
    const today     = new Date();
    const birth     = new Date(bdate);
    let age         = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    if (age < 21) {
      errors.push({ section: SEC_ABOUT, label: 'Applicant must be at least 21 years old (current age: ' + age + ')' });
    }
  }

  // ── Tab 1: About My Work ──────────────────────────────────────────────────────
  const SEC_WORK = "About My Work";
  missing('EMP_TYPE',       'Employment Type', SEC_WORK);
  missing('POSITION',       'Position / Job Title', SEC_WORK);
  missing('BUSINESS',       'Nature of Business / Industry', SEC_WORK);
  missing('EMPLOYER_NAME',  'Employer / Business Name', SEC_WORK);
  missing('OFFICE_ADDR',    'Office / Business Address', SEC_WORK);
  missing('OFFICE_NO',      'Office / Business Phone Number', SEC_WORK);
  missing('OFFICE_EMAIL',   'Office Email Address', SEC_WORK);

  // MATCHED TO HTML: Changed lookup string key from YRS_PRESENT_EMP to YRS_EMP
  if (get('YRS_EMP') === '') {
    errors.push({ section: SEC_WORK, label: 'Years with Present Employer' });
  }

  // MATCHED TO HTML: Changed lookup string key to MONTHLY_INCOME
  const income = getNum('MONTHLY_INCOME');
  if (!get('MONTHLY_INCOME') || isNaN(income) || income <= 0) {
    errors.push({ section: SEC_WORK, label: 'Monthly Income must be a positive amount' });
  }
  
  // ── Tab 2: Spouse ────────────────────────────────────────────────────────────
  const SEC_SPOUSE = "Spouse Details";
  if (get('CIVIL_STATUS').toUpperCase() === 'MARRIED') {
    missing('SPOUSE_NAME',   'Spouse Full Name', SEC_SPOUSE);
    missing('SPOUSE_BDATE',  'Spouse Date of Birth', SEC_SPOUSE);
    
    // FIXED HTML MATCH
    missing('SPOUSE_MOBILE', 'Spouse Mobile Number', SEC_SPOUSE);
    
    missing('SPOUSE_EMAIL',  'Spouse Email Address', SEC_SPOUSE);
  }

  // ── Tab 3: DOS Disclosure ─────────────────────────────────────────────────────
  const SEC_DOS = "DOS Disclosure";
  if (get('DOS_FLAG') === 'true') {
    missing('DOS_COMPANY', 'DOS Company / Subsidiary Name', SEC_DOS);
    missing('DOS_POS',     'DOS Position', SEC_DOS);
  }

  if (get('DOS_REL_FLAG') === 'true') {
    const relCards = document.querySelectorAll('[id^="dosrel-"]');
    if (relCards.length === 0) {
      errors.push({ section: SEC_DOS, label: 'Please add at least one DOS relative card' });
    } else {
      relCards.forEach((card) => {
        const cardId = card.id.replace('dosrel-', '');
        if (!get(`DOS_REL_NAME_${cardId}`)) errors.push({ section: SEC_DOS, label: `DOS Relative Name is required` });
        if (!get(`DOS_REL_${cardId}`))      errors.push({ section: SEC_DOS, label: `DOS Relative Relationship is required` });
        if (!get(`DOS_REL_COMP_${cardId}`)) errors.push({ section: SEC_DOS, label: `DOS Relative BPI Company is required` });
      });
    }
  }

  // ── Tab 4: Supplementary Cardholders ─────────────────────────────────────────
  const SEC_SUP = "Supplementary Cardholders";
  const supCards = document.querySelectorAll('[id^="sup-"]');
  if (supCards.length > 2) {
    errors.push({ section: SEC_SUP, label: 'A maximum of 2 supplementary cardholders is allowed.' });
  }

  supCards.forEach((card) => {
    const cardId = card.id.replace('sup-', '');
    if (!get(`SUP_NAME_${cardId}`))       errors.push({ section: SEC_SUP, label: `Supplementary Full Name is required` });
    if (!get(`SUP_BDATE_${cardId}`))      errors.push({ section: SEC_SUP, label: `Supplementary Date of Birth is required` });
    if (!get(`SUP_BPLACE_${cardId}`))     errors.push({ section: SEC_SUP, label: `Supplementary Place of Birth is required` });
    if (!get(`SUP_SEX_${cardId}`))        errors.push({ section: SEC_SUP, label: `Supplementary Sex is required` });
    if (!get(`SUP_STATUS_${cardId}`))     errors.push({ section: SEC_SUP, label: `Supplementary Civil Status is required` });
    if (!get(`SUP_CITIZEN_${cardId}`))    errors.push({ section: SEC_SUP, label: `Supplementary Citizenship is required` });
    if (!get(`REL_PRINCIPAL_${cardId}`))  errors.push({ section: SEC_SUP, label: `Supplementary Relationship is required` });
    if (!get(`SUP_MOBILENO_${cardId}`))   errors.push({ section: SEC_SUP, label: `Supplementary Mobile Number is required` });
    if (!get(`SUP_ADDR_${cardId}`))       errors.push({ section: SEC_SUP, label: `Supplementary Home Address is required` });
    if (!get(`SUP_EMAIL_${cardId}`))      errors.push({ section: SEC_SUP, label: `Supplementary Email Address is required` });
    if (!get(`SUP_EMPLOYER_${cardId}`))   errors.push({ section: SEC_SUP, label: `Supplementary Employer is required` });
    if (!get(`SUP_EMP_ADDR_${cardId}`))   errors.push({ section: SEC_SUP, label: `Supplementary Employer Address is required` });
    if (!get(`SUP_BUSINESS_${cardId}`))   errors.push({ section: SEC_SUP, label: `Supplementary Nature of Business is required` });
    if (!get(`SUP_OFFICE_NO_${cardId}`))  errors.push({ section: SEC_SUP, label: `Supplementary Office Number is required` });
    if (!get(`SUP_FUNDS_${cardId}`))      errors.push({ section: SEC_SUP, label: `Supplementary Source of Funds is required` });
  });

  // ── Result / Render Banner ────────────────────────────────────────────────────
  if (errors.length > 0) {
    showValidationErrors(errors);
    return false;
  }

  return true;
}

function showValidationErrors(errors) {
  const existing = document.getElementById('validationBanner');
  if (existing) existing.remove();

  const grouped = errors.reduce((acc, curr) => {
    if (!acc[curr.section]) acc[curr.section] = [];
    acc[curr.section].push(curr.label);
    return acc;
  }, {});

  const banner = document.createElement('div');
  banner.id = 'validationBanner';
  
  let sectionsHTML = '';
  for (const [sectionName, fields] of Object.entries(grouped)) {
    sectionsHTML += `
      <div class="val-section-group">
        <span class="val-section-badge">${sectionName}</span>
        <ul class="val-list">
          ${fields.map(f => `<li>${f}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  banner.innerHTML = `
    <div class="val-banner-header">
      <strong>Application Blocked: Fix ${errors.length} Required Items</strong>
      <button type="button" onclick="document.getElementById('validationBanner').remove()" class="val-close">✕</button>
    </div>
    <div class="val-banner-body">
      ${sectionsHTML}
    </div>
  `;

  const targetForm = document.getElementById('appForm');
  if (targetForm) {
    targetForm.insertBefore(banner, targetForm.firstChild);
  } else {
    document.body.insertBefore(banner, document.body.firstChild);
  }

  banner.scrollIntoView({ behavior: 'smooth', block: 'start' });

  showToast(`Validation Failed: ${errors.length} fields missing across tabs.`, 4000);
}

document.addEventListener('input',  () => clearValidationBanner());
document.addEventListener('change', () => clearValidationBanner());

function clearValidationBanner() {
  const banner = document.getElementById('validationBanner');
  if (banner) banner.remove();
}