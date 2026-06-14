// ── Data Models ──
// Each class maps form field names to a structured object
// matching the backend's expected payload shape.

class Applicant {
  constructor(fd) {
    this.name       = fd.get('APP_NAME')       || null;
    this.cardName      = fd.get('CARD_NAME')       || null;
    this.birthdate     = fd.get('APP_BDATE')       || null;
    this.birthPlace    = fd.get('APP_BPLACE')      || null;
    this.sex           = fd.get('APP_SEX')         || null;
    this.civilStatus   = fd.get('CIVIL_STATUS')    || null;
    this.numberOfDependents    = fd.get('DEPENDENTS') !== null ? Number(fd.get('DEPENDENTS')) : null;
    this.educationalAttainment      = fd.get('EDU_LEVEL')       || null;
    this.citizenship   = fd.get('CITIZENSHIP')     || null;
    this.mamaName    = fd.get('MOTHER_NAME')     || null;
    this.mobileNumber      = fd.get('MOBILE_NO')       || null;
    this.homeNumber        = fd.get('HOME_NO')         || null;
    this.email         = fd.get('APP_EMAIL')       || null;
    this.homeAddress   = fd.get('HOME_ADDRESS')    || null;
    this.yearsOfResidence    = fd.get('YRS_RES') !== null ? Number(fd.get('YRS_RES')) : null;
    this.cardAddress  = fd.get('CARD_ADDR')       || null;
    this.tinNumber           = fd.get('APP_TIN')         || null;
    this.SSSorGSISNumber       = fd.get('SSS_GSIS')        || null;
    this.carOwnership  = fd.get('CAR_OWN')         || null;
    this.dosFlag               = fd.get('DOS_FLAG') === 'true';
    this.relDosFlag            = fd.get('DOS_REL_FLAG') === 'true';
  }
}

class Work {
  constructor(fd) {
    this.employmentType       = fd.get('EMP_TYPE')        || null;
    this.yearsWithPresentEmployer      = fd.get('YRS_EMP') !== null ? Number(fd.get('YRS_EMP')) : null;
    this.position      = fd.get('POSITION')        || null;
    this.business      = fd.get('BUSINESS')        || null;
    this.employer  = fd.get('EMPLOYER_NAME')   || null;
    this.officeAddress    = fd.get('OFFICE_ADDR')     || null;
    this.officeNumber      = fd.get('OFFICE_NO')       || null;
    this.monthlyIncome = fd.get('MONTHLY_INCOME') !== null ? Number(fd.get('MONTHLY_INCOME')) : null;
    this.officeEmail   = fd.get('OFFICE_EMAIL')    || null;
    this.previousEmployer       = fd.get('PREV_EMP')        || null;
  }
}

class Spouse {
  constructor(fd) {
    this.name          = fd.get('SPOUSE_NAME')     || null;
    this.birthdate     = fd.get('SPOUSE_BDATE')    || null;
    this.mobileNumber      = fd.get('SPOUSE_MOBILE')   || null;
    this.email         = fd.get('SPOUSE_EMAIL')    || null;
    this.employer      = fd.get('SPOUSE_EMPLOYER') || null;
  }
}

class DOS {
  constructor(fd) {
    this.dosFlag = fd.get('DOS_FLAG') === 'true';
    this.company       = fd.get('DOS_COMPANY')     || null;
    this.position      = fd.get('DOS_POS')         || null;
  }
}

class DOSRel {
  // id: integer (1-based) matching the dynamic field suffix
  constructor(fd, id) {
    this.name          = fd.get(`DOS_REL_NAME_${id}`) || null;
    this.relationship  = fd.get(`DOS_REL_${id}`)      || null;
    this.company       = fd.get(`DOS_REL_COMP_${id}`) || null;
  }
}

class SupplementaryCardholder {
  constructor(fd, id) {
    // 1. Define the translation map
    const statusMap = {
      'S': 'SINGLE',
      'M': 'MARRIED',
      'E': 'SEPARATED',
      'W': 'WIDOWED',
      'SINGLE': 'SINGLE',
      'MARRIED': 'MARRIED',
      'SEPARATED': 'SEPARATED',
      'WIDOWED': 'WIDOWED'
    };

    const rawStatus = fd.get(`SUP_STATUS_${id}`);

    this.name                     = fd.get(`SUP_NAME_${id}`)     || null;
    this.birthdate                = fd.get(`SUP_BDATE_${id}`)    || null;
    this.birthplace               = fd.get(`SUP_BPLACE_${id}`)   || null;
    this.sex                      = fd.get(`SUP_SEX_${id}`)      || null;
    
    // 2. Apply the map here
    this.civilStatus              = statusMap[rawStatus] || rawStatus;
    
    this.citizenship              = fd.get(`SUP_CITIZEN_${id}`)  || null;
    this.relationshipToPrincipal  = fd.get(`REL_PRINCIPAL_${id}`)|| null;
    this.mobileNumber             = fd.get(`SUP_MOBILENO_${id}`) || null;
    this.homeNumber               = fd.get(`SUP_HOME_NO_${id}`)  || null;
    this.address                  = fd.get(`SUP_ADDR_${id}`)     || null;
    this.email                    = fd.get(`SUP_EMAIL_${id}`)    || null;
    this.employer                 = fd.get(`SUP_EMPLOYER_${id}`) || null;
    this.employerAddress          = fd.get(`SUP_EMP_ADDR_${id}`) || null;
    this.natureOfBusiness         = fd.get(`SUP_BUSINESS_${id}`) || null;
    this.officeNumber             = fd.get(`SUP_OFFICE_NO_${id}`)|| null;
    this.sourceOfFunds            = fd.get(`SUP_FUNDS_${id}`)    || null;
  }
}
