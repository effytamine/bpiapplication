package com.dds.repository;

import java.util.List;
import java.util.Map;

import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class AdminRepository {

    private final JdbcTemplate jdbcTemplate;

    public AdminRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // ── Query 1 ──────────────────────────────────────────────────────────────────
    public List<Map<String, Object>> getApplicantsInManilaOrCavite() {
        String sql = """
                SELECT applicant_id, app_name
                FROM applicants
                WHERE home_address LIKE '%Manila%'
                   OR home_address LIKE '%Cavite%'
                """;
        return jdbcTemplate.queryForList(sql);
    }

    // ── Query 2 ──────────────────────────────────────────────────────────────────
    public List<Map<String, Object>> getNonFilipinoApplicants() {
        String sql = """
                SELECT applicant_id, app_name, app_email, citizenship
                FROM applicants
                WHERE citizenship != 'Filipino'
                """;
        return jdbcTemplate.queryForList(sql);
    }

    // ── Query 3 ──────────────────────────────────────────────────────────────────
    public List<Map<String, Object>> getFilteredWorkDetails() {
        String sql = """
                SELECT applicant_id, employer, monthly_income
                FROM work_details
                WHERE (monthly_income BETWEEN 20000.00 AND 60000.00)
                  AND (yrs_emp >= 4)
                  AND (employer LIKE '%Inc.' OR employer LIKE '%Corp.')
                """;
        return jdbcTemplate.queryForList(sql);
    }

    // ── Query 4 ──────────────────────────────────────────────────────────────────
    public List<Map<String, Object>> getDOSApplicants() {
        String sql = """
                SELECT a.app_name, d.dos_company, d.dos_pos
                FROM applicants a
                JOIN dos_info d ON a.applicant_id = d.applicant_id
                ORDER BY a.app_name ASC
                """;
        return jdbcTemplate.queryForList(sql);
    }

    // ── Query 5 ──────────────────────────────────────────────────────────────────
    public List<Map<String, Object>> getAvgIncomeByEducation() {
        String sql = """
                SELECT a.edu_level, AVG(w.monthly_income) AS average_income
                FROM applicants a
                JOIN work_details w ON a.applicant_id = w.applicant_id
                GROUP BY a.edu_level
                HAVING AVG(w.monthly_income) > 50000.00
                """;
        return jdbcTemplate.queryForList(sql);
    }

    // ── Query 6 ──────────────────────────────────────────────────────────────────
    public List<Map<String, Object>> getApplicantCountByBirthplace() {
        String sql = """
                SELECT app_bplace, COUNT(applicant_id) AS total_applicants
                FROM applicants
                GROUP BY app_bplace
                HAVING COUNT(applicant_id) > 3
                ORDER BY total_applicants DESC
                """;
        return jdbcTemplate.queryForList(sql);
    }

    // ── Query 7 ──────────────────────────────────────────────────────────────────
    public List<Map<String, Object>> getHighIncomeMarriedApplicants() {
        String sql = """
                SELECT a.app_name, s.name AS spouse_name, w.employer, w.monthly_income
                FROM applicants a
                JOIN spouse s ON a.applicant_id = s.applicant_id
                JOIN work_details w ON a.applicant_id = w.applicant_id
                WHERE w.monthly_income > 50000.00
                """;
        return jdbcTemplate.queryForList(sql);
    }

    // ── Query 8 ──────────────────────────────────────────────────────────────────
    public List<Map<String, Object>> getMarriedNonManilaWithSiblingOrOtherSup() {
        String sql = """
                SELECT a.app_name, a.home_address, s.name AS spouse_name, sup.sup_name
                FROM applicants a
                JOIN spouse s ON a.applicant_id = s.applicant_id
                JOIN supplementary_cardholder_details sup ON a.applicant_id = sup.applicant_id
                WHERE a.civil_status = 'MARRIED'
                  AND a.home_address NOT LIKE '%Manila%'
                  AND (sup.rel_principal = 'Sibling' OR sup.rel_principal = 'Other')
                ORDER BY a.app_name ASC
                """;
        return jdbcTemplate.queryForList(sql);
    }

    // ── Query 9 ──────────────────────────────────────────────────────────────────
    public List<Map<String, Object>> getHighIncomeCaviteLagunaByBirthplace() {
        String sql = """
                SELECT a.app_bplace, SUM(w.monthly_income) AS total_group_income
                FROM applicants a
                JOIN work_details w ON a.applicant_id = w.applicant_id
                JOIN supplementary_cardholder_details sup ON a.applicant_id = sup.applicant_id
                WHERE (a.home_address LIKE '%Cavite%' OR a.home_address LIKE '%Laguna%')
                  AND w.office_email IS NOT NULL
                  AND sup.rel_principal = 'Relative'
                GROUP BY a.app_bplace
                HAVING SUM(w.monthly_income) > 200000.00
                """;
        return jdbcTemplate.queryForList(sql);
    }

    // ── Query 10 ─────────────────────────────────────────────────────────────────
    public List<Map<String, Object>> getCarOwnershipStats() {
        ensureAppAgeColumn();
        refreshAppAge();
        String sql = """
                SELECT a.car_own, AVG(a.dependents) AS average_dependents,
                       SUM(w.monthly_income) AS total_monthly_income
                FROM applicants a
                JOIN work_details w ON a.applicant_id = w.applicant_id
                WHERE a.app_age >= 40
                  AND w.emp_type = 'Employed'
                  AND a.yrs_res >= 5
                GROUP BY a.car_own
                HAVING SUM(w.monthly_income) > 150000.00
                ORDER BY total_monthly_income DESC
                """;
        return jdbcTemplate.queryForList(sql);
    }

    private void ensureAppAgeColumn() {
        try {
            jdbcTemplate.execute("SELECT app_age FROM applicants LIMIT 1");
        } catch (DataAccessException e) {
            jdbcTemplate.execute("ALTER TABLE applicants ADD app_age INT");
        }
    }

    private void refreshAppAge() {
        jdbcTemplate.execute("SET SQL_SAFE_UPDATES = 0");
        jdbcTemplate.execute(
            "UPDATE applicants SET app_age = TIMESTAMPDIFF(YEAR, app_bdate, CURDATE())"
        );
        jdbcTemplate.execute("SET SQL_SAFE_UPDATES = 1");
    }

    // ════════════════════════════════════════════════════════════════════════════
    // ── QUERY 11 — DELETE: High-Risk Supplementary Cardholders ──────────────────
    // ════════════════════════════════════════════════════════════════════════════

    // Seed mock data for Query 11
    public void seedQuery11() {
        // Use INSERT IGNORE so re-seeding is safe and won't duplicate rows
        jdbcTemplate.update("""
            INSERT IGNORE INTO applicants
              (applicant_id, app_name, app_bdate, app_bplace, app_sex, card_name,
               mother_name, edu_level, civil_status, dependents, app_tin, sss_gsis,
               car_own, citizenship, mobile_no, home_no, home_address, yrs_res,
               dos_flag, rel_dos_flag, app_email, card_addr, app_age)
            VALUES (31, 'Mark David', '1995-11-12', 'Manila', 'M', 'MARK DAVID',
                    'Jane David', 'COLLEGE', 'SINGLE', 0, '111-222-331', '11-2222222-1',
                    'NONE', 'Filipino', '+639170001131', NULL,
                    '456 Taft Ave, Manila', 1, 0, 0, 'mark.d@email.com', 'H', 31)
            """);

        jdbcTemplate.update("""
            INSERT IGNORE INTO work_details
              (applicant_id, emp_type, employer, yrs_emp, position, business,
               office_addr, office_no, monthly_income, office_email, prev_emp)
            VALUES (31, 'Employed', 'Retail Pros Inc.', 2, 'Cashier', 'Retail',
                    'Pasay City', '028111222', 25000.00, 'mark@retailpros.com', NULL)
            """);

        jdbcTemplate.update("""
            INSERT IGNORE INTO supplementary_cardholder_details
              (sup_id, applicant_id, sup_name, sup_bdate, sup_bplace, sup_sex,
               sup_status, sup_citizen, sup_addr, sup_home_no, sup_mobileno,
               sup_email, sup_employer, sup_emp_addr, sup_funds, sup_business,
               sup_office_no, rel_principal)
            VALUES (1, 31, 'Luke David', '2006-02-14', 'Manila', 'M', 'Single',
                    'Filipino', '456 Taft Ave, Manila', NULL, '+639170002231',
                    'luke.d@email.com', 'N/A', 'N/A', 'Allowance', 'None', '0', 'Sibling')
            """);

        jdbcTemplate.update("""
            INSERT IGNORE INTO applicants
              (applicant_id, app_name, app_bdate, app_bplace, app_sex, card_name,
               mother_name, edu_level, civil_status, dependents, app_tin, sss_gsis,
               car_own, citizenship, mobile_no, home_no, home_address, yrs_res,
               dos_flag, rel_dos_flag, app_email, card_addr, app_age)
            VALUES (32, 'Sarah Jenkins', '1998-04-20', 'Quezon City', 'F', 'SARAH JENKINS',
                    'Mary Jenkins', 'COLLEGE', 'SINGLE', 0, '111-222-332', '11-2222222-2',
                    'NONE', 'Filipino', '+639170001132', NULL,
                    '789 Commonwealth, Quezon City', 1, 0, 0, 'sarah.j@email.com', 'H', 28)
            """);

        jdbcTemplate.update("""
            INSERT IGNORE INTO work_details
              (applicant_id, emp_type, employer, yrs_emp, position, business,
               office_addr, office_no, monthly_income, office_email, prev_emp)
            VALUES (32, 'Employed', 'Quick Fast Food', 1, 'Crew', 'Food Service',
                    'Quezon City', '028333444', 22000.00, 'sarah@quickfood.com', NULL)
            """);

        jdbcTemplate.update("""
            INSERT IGNORE INTO supplementary_cardholder_details
              (sup_id, applicant_id, sup_name, sup_bdate, sup_bplace, sup_sex,
               sup_status, sup_citizen, sup_addr, sup_home_no, sup_mobileno,
               sup_email, sup_employer, sup_emp_addr, sup_funds, sup_business,
               sup_office_no, rel_principal)
            VALUES (1, 32, 'Clara Jenkins', '2007-08-19', 'Quezon City', 'F', 'Single',
                    'Filipino', '789 Commonwealth, Quezon City', NULL, '+639170002232',
                    'clara.j@email.com', 'N/A', 'N/A', 'Allowance', 'None', '0', 'Sibling')
            """);
    }

    // Verification SELECT — shows rows that will be deleted
    public List<Map<String, Object>> verifyQuery11() {
        String sql = """
                SELECT
                    sup.applicant_id,
                    a.app_name         AS principal_name,
                    sup.sup_id,
                    sup.sup_name       AS supplementary_name,
                    a.car_own,
                    a.yrs_res,
                    w.monthly_income
                FROM supplementary_cardholder_details sup
                JOIN applicants a  ON sup.applicant_id = a.applicant_id
                JOIN work_details w ON a.applicant_id  = w.applicant_id
                WHERE a.car_own = 'NONE'
                  AND a.yrs_res < 2
                  AND w.monthly_income < 35000.00
                """;
        return jdbcTemplate.queryForList(sql);
    }

    // Execution DELETE — removes the high-risk supplementary rows
    public int executeQuery11() {
        jdbcTemplate.execute("SET SQL_SAFE_UPDATES = 0");
        int rows = jdbcTemplate.update("""
                DELETE sup
                FROM supplementary_cardholder_details sup
                JOIN applicants a  ON sup.applicant_id = a.applicant_id
                JOIN work_details w ON a.applicant_id  = w.applicant_id
                WHERE a.car_own = 'NONE'
                  AND a.yrs_res < 2
                  AND w.monthly_income < 35000.00
                """);
        jdbcTemplate.execute("SET SQL_SAFE_UPDATES = 1");
        return rows;
    }

    // ════════════════════════════════════════════════════════════════════════════
    // ── QUERY 12 — UPDATE: Reassign Employer for Cebu City / Pasig City Sups ───
    // ════════════════════════════════════════════════════════════════════════════

    // Seed mock data for Query 12
    public void seedQuery12() {
        jdbcTemplate.update("""
            INSERT IGNORE INTO applicants
              (applicant_id, app_name, app_bdate, app_bplace, app_sex, card_name,
               mother_name, edu_level, civil_status, dependents, app_tin, sss_gsis,
               car_own, citizenship, mobile_no, home_no, home_address, yrs_res,
               dos_flag, rel_dos_flag, app_email, card_addr, app_age)
            VALUES (33, 'John Doe', '1982-05-14', 'Cebu City', 'M', 'JOHN DOE',
                    'Jane Doe', 'COLLEGE', 'MARRIED', 1, '111-222-333', '11-2222222-3',
                    'OWNED', 'Filipino', '+639170001133', '032111222',
                    '123 Mango Avenue, Cebu City', 6, 0, 0, 'johndoe@email.com', 'H', 44)
            """);

        jdbcTemplate.update("""
            INSERT IGNORE INTO work_details
              (applicant_id, emp_type, employer, yrs_emp, position, business,
               office_addr, office_no, monthly_income, office_email, prev_emp)
            VALUES (33, 'Employed', 'Cebu Shipping Corp', 8, 'Manager', 'Logistics',
                    'Cebu Port Area', '032333444', 85000.00, 'j.doe@shipping.com', NULL)
            """);

        jdbcTemplate.update("""
            INSERT IGNORE INTO supplementary_cardholder_details
              (sup_id, applicant_id, sup_name, sup_bdate, sup_bplace, sup_sex,
               sup_status, sup_citizen, sup_addr, sup_home_no, sup_mobileno,
               sup_email, sup_employer, sup_emp_addr, sup_funds, sup_business,
               sup_office_no, rel_principal)
            VALUES (1, 33, 'Robert Doe', '1985-09-20', 'Cebu City', 'M', 'Married',
                    'Filipino', '123 Mango Avenue, Cebu City', NULL, '+639170002233',
                    'robert.d@email.com', 'Old Tech Inc', 'Mandaue City',
                    'Salary', 'Technology', '032555666', 'Brother')
            """);

        jdbcTemplate.update("""
            INSERT IGNORE INTO applicants
              (applicant_id, app_name, app_bdate, app_bplace, app_sex, card_name,
               mother_name, edu_level, civil_status, dependents, app_tin, sss_gsis,
               car_own, citizenship, mobile_no, home_no, home_address, yrs_res,
               dos_flag, rel_dos_flag, app_email, card_addr, app_age)
            VALUES (34, 'Alice Vance', '1987-08-22', 'Pasig City', 'F', 'ALICE VANCE',
                    'Helen Vance', 'POST_GRADUATE', 'MARRIED', 2, '111-222-334', '11-2222222-4',
                    'MORTGAGED', 'Filipino', '+639170001134', '028444555',
                    '456 Ortigas Center, Pasig City', 4, 0, 0, 'alice.v@email.com', 'O', 38)
            """);

        jdbcTemplate.update("""
            INSERT IGNORE INTO work_details
              (applicant_id, emp_type, employer, yrs_emp, position, business,
               office_addr, office_no, monthly_income, office_email, prev_emp)
            VALUES (34, 'Employed', 'Ortigas Finance Ltd', 5, 'Director', 'Finance',
                    'ADB Avenue, Pasig', '028777888', 120000.00, 'avance@ortigasfin.com', NULL)
            """);

        jdbcTemplate.update("""
            INSERT IGNORE INTO supplementary_cardholder_details
              (sup_id, applicant_id, sup_name, sup_bdate, sup_bplace, sup_sex,
               sup_status, sup_citizen, sup_addr, sup_home_no, sup_mobileno,
               sup_email, sup_employer, sup_emp_addr, sup_funds, sup_business,
               sup_office_no, rel_principal)
            VALUES (1, 34, 'Grace Vance', '1990-11-05', 'Pasig City', 'F', 'Single',
                    'Filipino', '456 Ortigas Center, Pasig City', NULL, '+639170002234',
                    'grace.v@email.com', 'Local Retail shop', 'Pasig City',
                    'Business', 'Retail', '028999111', 'Sister')
            """);
    }

    // Verification SELECT — shows rows that will be updated, with before-values
    public List<Map<String, Object>> verifyQuery12() {
        String sql = """
                SELECT
                    sup.applicant_id,
                    a.app_name         AS principal_name,
                    a.home_address,
                    sup.sup_name       AS supplementary_name,
                    sup.sup_funds,
                    sup.sup_employer   AS old_employer,
                    sup.sup_business   AS old_business
                FROM supplementary_cardholder_details sup
                JOIN applicants a ON sup.applicant_id = a.applicant_id
                WHERE (a.home_address LIKE '%Cebu City%' OR a.home_address LIKE '%Pasig City%')
                  AND sup.sup_funds != 'Allowance'
                """;
        return jdbcTemplate.queryForList(sql);
    }

    // Execution UPDATE — reassigns employer/business to BPI Unibank / Banking
    public int executeQuery12() {
        jdbcTemplate.execute("SET SQL_SAFE_UPDATES = 0");
        int rows = jdbcTemplate.update("""
                UPDATE supplementary_cardholder_details sup
                JOIN applicants a ON sup.applicant_id = a.applicant_id
                SET sup.sup_employer = 'BPI Unibank',
                    sup.sup_business = 'Banking'
                WHERE (a.home_address LIKE '%Cebu City%' OR a.home_address LIKE '%Pasig City%')
                  AND sup.sup_funds != 'Allowance'
                """);
        jdbcTemplate.execute("SET SQL_SAFE_UPDATES = 1");
        return rows;
    }
}