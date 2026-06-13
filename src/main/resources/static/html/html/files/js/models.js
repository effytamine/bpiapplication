// ── Data Models ──
// Each class maps form field names to a structured object
// matching the backend's expected payload shape.

class Applicant {
  constructor(fd) {
    this.appName       = fd.get('APP_NAME')       || null;
    this.cardName      = fd.get('CARD_NAME')       || null;
    this.birthDate     = fd.get('APP_BDATE')       || null;
    this.birthPlace    = fd.get('APP_BPLACE')      || null;
    this.sex           = fd.get('APP_SEX')         || null;
    this.civilStatus   = fd.get('CIVIL_STATUS')    || null;
    this.dependents    = fd.get('DEPENDENTS') !== null ? Number(fd.get('DEPENDENTS')) : null;
    this.eduLevel      = fd.get('EDU_LEVEL')       || null;
    this.citizenship   = fd.get('CITIZENSHIP')     || null;
    this.motherName    = fd.get('MOTHER_NAME')     || null;
    this.mobileNo      = fd.get('MOBILE_NO')       || null;
    this.homeNo        = fd.get('HOME_NO')         || null;
    this.email         = fd.get('APP_EMAIL')       || null;
    this.homeAddress   = fd.get('HOME_ADDRESS')    || null;
    this.yearsInRes    = fd.get('YRS_RES') !== null ? Number(fd.get('YRS_RES')) : null;
    this.cardDelivery  = fd.get('CARD_ADDR')       || null;
    this.tin           = fd.get('APP_TIN')         || null;
    this.sssGsis       = fd.get('SSS_GSIS')        || null;
    this.carOwnership  = fd.get('CAR_OWN')         || null;
  }
}

class Work {
  constructor(fd) {
    this.empType       = fd.get('EMP_TYPE')        || null;
    this.yearsEmp      = fd.get('YRS_EMP') !== null ? Number(fd.get('YRS_EMP')) : null;
    this.position      = fd.get('POSITION')        || null;
    this.business      = fd.get('BUSINESS')        || null;
    this.employerName  = fd.get('EMPLOYER_NAME')   || null;
    this.officeAddr    = fd.get('OFFICE_ADDR')     || null;
    this.officeNo      = fd.get('OFFICE_NO')       || null;
    this.monthlyIncome = fd.get('MONTHLY_INCOME') !== null ? Number(fd.get('MONTHLY_INCOME')) : null;
    this.officeEmail   = fd.get('OFFICE_EMAIL')    || null;
    this.prevEmp       = fd.get('PREV_EMP')        || null;
  }
}

class Spouse {
  constructor(fd) {
    this.name          = fd.get('SPOUSE_NAME')     || null;
    this.birthDate     = fd.get('SPOUSE_BDATE')    || null;
    this.mobileNo      = fd.get('SPOUSE_MOBILE')   || null;
    this.email         = fd.get('SPOUSE_EMAIL')    || null;
    this.employer      = fd.get('SPOUSE_EMPLOYER') || null;
  }
}

class DOS {
  constructor(fd) {
    this.isDOS         = fd.get('DOS_FLAG') === 'true';
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
  // id: integer (1-based) matching the dynamic field suffix
  constructor(fd, id) {
    this.name          = fd.get(`SUP_NAME_${id}`)     || null;
    this.birthDate     = fd.get(`SUP_BDATE_${id}`)    || null;
    this.birthPlace    = fd.get(`SUP_BPLACE_${id}`)   || null;
    this.sex           = fd.get(`SUP_SEX_${id}`)      || null;
    this.civilStatus   = fd.get(`SUP_STATUS_${id}`)   || null;
    this.citizenship   = fd.get(`SUP_CITIZEN_${id}`)  || null;
    this.relationship  = fd.get(`REL_PRINCIPAL_${id}`)|| null;
    this.mobileNo      = fd.get(`SUP_MOBILENO_${id}`) || null;
    this.homeNo        = fd.get(`SUP_HOME_NO_${id}`)  || null;
    this.homeAddress   = fd.get(`SUP_ADDR_${id}`)     || null;
    this.email         = fd.get(`SUP_EMAIL_${id}`)    || null;
    this.employer      = fd.get(`SUP_EMPLOYER_${id}`) || null;
    this.empAddress    = fd.get(`SUP_EMP_ADDR_${id}`) || null;
    this.business      = fd.get(`SUP_BUSINESS_${id}`) || null;
    this.officeNo      = fd.get(`SUP_OFFICE_NO_${id}`)|| null;
    this.sourceOfFunds = fd.get(`SUP_FUNDS_${id}`)    || null;
  }
}
