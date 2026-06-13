// ── Review & Summary Builder ──

function buildSummary() {
  const fd = new FormData(document.getElementById('appForm'));
  const get = k => fd.get(k) || '<span style="color:#b0aec8">—</span>';
  const civMap = { S: 'Single', M: 'Married', E: 'Separated', W: 'Widowed' };
  const eduMap = { G: 'Grade School', H: 'High School', C: 'College', P: 'Post Graduate' };
  const carMap = { O: 'Owned', M: 'Mortgaged', N: 'None' };
  const cardMap = { H: 'Home Address', O: 'Office Address' };

  document.getElementById('summaryContent').innerHTML = `
    <table style="width:100%;border-collapse:collapse;font-size:13.5px">

      <tr style="background:var(--red-light)">
        <td colspan="2" style="padding:10px 14px;font-weight:700;color:var(--red);font-size:13px;letter-spacing:.5px;text-transform:uppercase">About Me</td>
      </tr>
      <tr><td style="padding:8px 14px;color:var(--ink-light);width:40%">Full Name</td><td style="padding:8px 14px">${get('APP_NAME')}</td></tr>
      <tr style="background:var(--surface)"><td style="padding:8px 14px;color:var(--ink-light)">Card Name</td><td style="padding:8px 14px">${get('CARD_NAME')}</td></tr>
      <tr><td style="padding:8px 14px;color:var(--ink-light)">Birthdate / Birthplace</td><td style="padding:8px 14px">${get('APP_BDATE')} / ${get('APP_BPLACE')}</td></tr>
      <tr style="background:var(--surface)"><td style="padding:8px 14px;color:var(--ink-light)">Sex</td><td style="padding:8px 14px">${get('APP_SEX') === 'M' ? 'Male' : get('APP_SEX') === 'F' ? 'Female' : '—'}</td></tr>
      <tr><td style="padding:8px 14px;color:var(--ink-light)">Civil Status</td><td style="padding:8px 14px">${civMap[get('CIVIL_STATUS')] || get('CIVIL_STATUS')}</td></tr>
      <tr style="background:var(--surface)"><td style="padding:8px 14px;color:var(--ink-light)">Dependents</td><td style="padding:8px 14px">${get('DEPENDENTS')}</td></tr>
      <tr><td style="padding:8px 14px;color:var(--ink-light)">Education</td><td style="padding:8px 14px">${eduMap[get('EDU_LEVEL')] || get('EDU_LEVEL')}</td></tr>
      <tr style="background:var(--surface)"><td style="padding:8px 14px;color:var(--ink-light)">Citizenship</td><td style="padding:8px 14px">${get('CITIZENSHIP')}</td></tr>
      <tr><td style="padding:8px 14px;color:var(--ink-light)">Mobile</td><td style="padding:8px 14px">+63 ${get('MOBILE_NO')}</td></tr>
      <tr style="background:var(--surface)"><td style="padding:8px 14px;color:var(--ink-light)">Email</td><td style="padding:8px 14px">${get('APP_EMAIL')}</td></tr>
      <tr><td style="padding:8px 14px;color:var(--ink-light)">Home Address</td><td style="padding:8px 14px">${get('HOME_ADDRESS')}</td></tr>
      <tr style="background:var(--surface)"><td style="padding:8px 14px;color:var(--ink-light)">Years in Residence</td><td style="padding:8px 14px">${get('YRS_RES')}</td></tr>
      <tr><td style="padding:8px 14px;color:var(--ink-light)">Card Delivery</td><td style="padding:8px 14px">${cardMap[get('CARD_ADDR')] || get('CARD_ADDR')}</td></tr>
      <tr style="background:var(--surface)"><td style="padding:8px 14px;color:var(--ink-light)">TIN</td><td style="padding:8px 14px">${get('APP_TIN')}</td></tr>
      <tr><td style="padding:8px 14px;color:var(--ink-light)">SSS/GSIS</td><td style="padding:8px 14px">${get('SSS_GSIS')}</td></tr>
      <tr style="background:var(--surface)"><td style="padding:8px 14px;color:var(--ink-light)">Car Ownership</td><td style="padding:8px 14px">${carMap[get('CAR_OWN')] || get('CAR_OWN')}</td></tr>

      <tr style="background:var(--red-light)">
        <td colspan="2" style="padding:10px 14px;font-weight:700;color:var(--red);font-size:13px;letter-spacing:.5px;text-transform:uppercase">About My Work</td>
      </tr>
      <tr><td style="padding:8px 14px;color:var(--ink-light)">Employment Type</td><td style="padding:8px 14px">${get('EMP_TYPE')}</td></tr>
      <tr style="background:var(--surface)"><td style="padding:8px 14px;color:var(--ink-light)">Position</td><td style="padding:8px 14px">${get('POSITION')}</td></tr>
      <tr><td style="padding:8px 14px;color:var(--ink-light)">Industry</td><td style="padding:8px 14px">${get('BUSINESS')}</td></tr>
      <tr style="background:var(--surface)"><td style="padding:8px 14px;color:var(--ink-light)">Monthly Income</td><td style="padding:8px 14px">₱ ${get('MONTHLY_INCOME')}</td></tr>
      <tr><td style="padding:8px 14px;color:var(--ink-light)">Years of Employment</td><td style="padding:8px 14px">${get('YRS_EMP')}</td></tr>
      <tr style="background:var(--surface)"><td style="padding:8px 14px;color:var(--ink-light)">Office Email</td><td style="padding:8px 14px">${get('OFFICE_EMAIL')}</td></tr>

      ${isMarried ? `
      <tr style="background:var(--red-light)">
        <td colspan="2" style="padding:10px 14px;font-weight:700;color:var(--red);font-size:13px;letter-spacing:.5px;text-transform:uppercase">About My Spouse</td>
      </tr>
      <tr><td style="padding:8px 14px;color:var(--ink-light)">Spouse Name</td><td style="padding:8px 14px">${get('SPOUSE_NAME')}</td></tr>
      <tr style="background:var(--surface)"><td style="padding:8px 14px;color:var(--ink-light)">Spouse Birthdate</td><td style="padding:8px 14px">${get('SPOUSE_BDATE')}</td></tr>
      <tr><td style="padding:8px 14px;color:var(--ink-light)">Spouse Mobile</td><td style="padding:8px 14px">+63 ${get('SPOUSE_MOBILE')}</td></tr>
      <tr style="background:var(--surface)"><td style="padding:8px 14px;color:var(--ink-light)">Spouse Email</td><td style="padding:8px 14px">${get('SPOUSE_EMAIL')}</td></tr>
      <tr><td style="padding:8px 14px;color:var(--ink-light)">Spouse Employer</td><td style="padding:8px 14px">${get('SPOUSE_EMPLOYER')}</td></tr>
      ` : ''}

      <tr style="background:var(--red-light)">
        <td colspan="2" style="padding:10px 14px;font-weight:700;color:var(--red);font-size:13px;letter-spacing:.5px;text-transform:uppercase">DOS Disclosure</td>
      </tr>
      <tr><td style="padding:8px 14px;color:var(--ink-light)">Is DOS?</td><td style="padding:8px 14px">${get('DOS_FLAG') === 'true' ? 'Yes' : 'No'}</td></tr>
      <tr style="background:var(--surface)"><td style="padding:8px 14px;color:var(--ink-light)">Related to DOS?</td><td style="padding:8px 14px">${get('REL_DOS_FLAG') === 'true' ? 'Yes' : 'No'}</td></tr>
      ${get('DOS_FLAG') === 'true' ? `
      <tr><td style="padding:8px 14px;color:var(--ink-light)">DOS Company</td><td style="padding:8px 14px">${get('DOS_COMPANY')}</td></tr>
      <tr style="background:var(--surface)"><td style="padding:8px 14px;color:var(--ink-light)">DOS Position</td><td style="padding:8px 14px">${get('DOS_POS')}</td></tr>
      ` : ''}

      <tr style="background:var(--red-light)">
        <td colspan="2" style="padding:10px 14px;font-weight:700;color:var(--red);font-size:13px;letter-spacing:.5px;text-transform:uppercase">Supplementary Cardholders</td>
      </tr>
      <tr><td colspan="2" style="padding:8px 14px;color:var(--ink-light)">${supCount === 0 ? 'None added.' : supCount + ' supplementary cardholder(s) added.'}</td></tr>

    </table>
  `;
}
