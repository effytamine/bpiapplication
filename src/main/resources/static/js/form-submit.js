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

  // ── Build structured payload ──

  const applicant = {
    name: fd.get('name'),
    birthdate: fd.get('birthdate'),
    birthPlace: fd.get('birthPlace'),
    cardName: fd.get('cardName'),
    mamaName: fd.get('mamaName'),
    educationalAttainment: fd.get('educationalAttainment'),
    numberOfDependents: fd.get('numberOfDependents'),
    tinNumber: fd.get('tinNumber'),
    SSSorGSISnumber: fd.get('SSSorGSISnumber'),
    citizenship: fd.get('citizenship'),
    mobileNumber: fd.get('mobileNumber'),
    homeNumber: fd.get('homeNumber'),
    homeAddress: fd.get('homeAddress'),
    yearsOfResidence: fd.get('yearsOfResidence'),
    dosFlag: fd.get('dosFlag'),
    relDosFlag: fd.get('relDosFlag'),
    email: fd.get('email'),
    cardAddress: fd.get('cardAddress'),
    sex: fd.get('sex'),
    civilStatus: fd.get('civilStatus'),
    carOwnership: fd.get('carOwnership')
  };

  const work = {
    employmentType: fd.get('employmentType'),
    yearsWithEmployer: fd.get('yearsWithEmployer'),
    position: fd.get('position'),
    natureOfBusiness: fd.get('natureOfBusiness'),
    employerName: fd.get('employerName'),
    officeAddress: fd.get('officeAddress'),
    officePhoneNumber: fd.get('officePhoneNumber'),
    monthlyIncome: fd.get('monthlyIncome'),
    officeEmailAddress: fd.get('officeEmailAddress'),
    previousEmployer: fd.get('previousEmployer')
  };

  const dos = {
    dosFlag: fd.get('dosFlag'),
    dosCompany: fd.get('dosCompany'),
    dosPosition: fd.get('dosPosition'),
    relDosFlag: fd.get('relDosFlag')
  };

  // Spouse: only include if married
  const spouse = isMarried ? {
    spouseName: fd.get('spouseName'),
    spouseBirthdate: fd.get('spouseBirthdate'),
    spouseMobileNumber: fd.get('spouseMobileNumber'),
    spouseEmailAddress: fd.get('spouseEmailAddress'),
    spouseEmployer: fd.get('spouseEmployer')
  } : null;

  // DOS Relatives: collect all rendered cards without processing or passing DOM IDs
  const dosRelCards = document.querySelectorAll('[id^="dosrel-"]');
  const dosrel = Array.from(dosRelCards).map(card => {
    return new DOSRel(fd);
  });

  // Supplementary cardholders: collect all rendered cards without processing or passing DOM IDs
  const supCards = document.querySelectorAll('[id^="sup-"]');
  const supplementarycardholder = Array.from(supCards).map(card => {
    return new SupplementaryCardholder(fd);
  });

  const payload = {
    applicant,
    work,
    spouse,
    dos,
    dosrel,
    supplementarycardholder,
  };

  // ── Safely Flatten and Clean Payload Properties ──
  const urlParams = new URLSearchParams();

  // Helper function to prevent sending empty text strings for optional fields
  const appendSafe = (key, value) => {
    if (value === null || value === undefined || value === '') return;
    urlParams.append(key, value);
  };

  // 1. Flatten Applicant properties with Enum Value Transformers
  if (payload.applicant) {
    appendSafe('name', payload.applicant.name);
    appendSafe('birthdate', payload.applicant.birthdate);
    appendSafe('birthPlace', payload.applicant.birthPlace);
    appendSafe('cardName', payload.applicant.cardName);
    appendSafe('mamaName', payload.applicant.mamaName);
    appendSafe('numberOfDependents', payload.applicant.numberOfDependents);
    appendSafe('tinNumber', payload.applicant.tinNumber);
    appendSafe('SSSorGSISnumber', payload.applicant.SSSorGSISnumber);
    appendSafe('citizenship', payload.applicant.citizenship);
    appendSafe('mobileNumber', payload.applicant.mobileNumber);
    appendSafe('homeNumber', payload.applicant.homeNumber);
    appendSafe('homeAddress', payload.applicant.homeAddress);
    appendSafe('yearsOfResidence', payload.applicant.yearsOfResidence);
    appendSafe('dosFlag', payload.applicant.dosFlag);
    appendSafe('relDosFlag', payload.applicant.relDosFlag);
    appendSafe('email', payload.applicant.email);
    appendSafe('cardAddress', payload.applicant.cardAddress);

    // ── TRANSFORM FRONTEND CODES TO MATCH JAVA ENUM CONSTANTS ──
    
    // Convert 'C' / 'P' / 'G' to full Java Enum names matching EducationalAttainment
    let eduEnum = payload.applicant.educationalAttainment;
    if (eduEnum === 'C') eduEnum = 'COLLEGE';
    if (eduEnum === 'P') eduEnum = 'POST_GRADUATE';
    if (eduEnum === 'G') eduEnum = 'UNDERGRADUATE';
    appendSafe('educationalAttainment', eduEnum);

    // Convert 'M' / 'F' to full Java Enum names
    let sexEnum = payload.applicant.sex;
    if (sexEnum === 'M') sexEnum = 'MALE';
    if (sexEnum === 'F') sexEnum = 'FEMALE';
    appendSafe('sex', sexEnum);

    // Convert 'S' / 'M' / 'E' / 'W' to full Java Enum names
    let civilStatusEnum = payload.applicant.civilStatus;
    if (civilStatusEnum === 'S') civilStatusEnum = 'SINGLE';
    if (civilStatusEnum === 'M') civilStatusEnum = 'MARRIED';
    if (civilStatusEnum === 'E') civilStatusEnum = 'SEPARATED';
    if (civilStatusEnum === 'W') civilStatusEnum = 'WIDOWED';
    appendSafe('civilStatus', civilStatusEnum);

    // Convert 'O' / 'M' / 'N' to full Java Enum names
    let carEnum = payload.applicant.carOwnership;
    if (carEnum === 'O') carEnum = 'OWNED';
    if (carEnum === 'M') carEnum = 'MORTGAGED';
    if (carEnum === 'N') carEnum = 'NONE';
    appendSafe('carOwnership', carEnum);
  } 

  // 2. Flatten Work properties
  if (payload.work) {
    for (const [key, value] of Object.entries(payload.work)) {
      appendSafe(key, value);
    }
  }

  // 3. Flatten Spouse properties
  if (payload.spouse) {
    for (const [key, value] of Object.entries(payload.spouse)) {
      appendSafe(key, value);
    }
  }

  // 4. Flatten DOS Info properties
  if (payload.dos) {
    for (const [key, value] of Object.entries(payload.dos)) {
      appendSafe(key, value);
    }
  }

  // 5. Flatten the first Relative & Supplementary records
  if (payload.dosrel && payload.dosrel.length > 0) {
    for (const [key, value] of Object.entries(payload.dosrel[0])) {
      appendSafe(key, value);
    }
  }
  if (payload.supplementarycardholder && payload.supplementarycardholder.length > 0) {
    for (const [key, value] of Object.entries(payload.supplementarycardholder[0])) {
      appendSafe(key, value);
    }
  }

  // ── Send the payload to your untouched Java Controller ──
  try {
    const res = await fetch('/bpi/create', {   
      method: 'PUT',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, 
      body: urlParams.toString(), 
    });

    if (!res.ok) {
      const errText = await res.text();
      showToast(`Submission failed: ${res.status} — ${errText}`, 5000);
      return;
    }

    showToast('✓ Application submitted successfully! You will receive a confirmation email shortly.', 5000);

    // ── Reset form state ──
    setTimeout(() => {
      if (typeof goTo === 'function') goTo(0);
      this.reset();
      if (typeof supCount !== 'undefined') supCount = 0;
      if (typeof dosRelCount !== 'undefined') dosRelCount = 0;
      
      const supContainer = document.getElementById('supContainer');
      const dosRelContainer = document.getElementById('dosRelContainer');
      const dosInfoFields = document.getElementById('dosInfoFields');
      const dosRelFields = document.getElementById('dosRelFields');
      const addSupBtn = document.getElementById('addSupBtn');

      if (supContainer) supContainer.innerHTML = '';
      if (dosRelContainer) dosRelContainer.innerHTML = '';
      if (dosInfoFields) dosInfoFields.style.display = 'none';
      if (dosRelFields) dosRelFields.style.display = 'none';
      if (addSupBtn) addSupBtn.style.display = 'flex';
    }, 5500);

  } catch (err) {
    console.error('Submit error:', err);
    showToast('Network error — please check your connection and try again.', 5000);
  }
});