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
    // Applicants who live in Manila or Cavite
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
    // Applicants whose citizenship is not Filipino
    public List<Map<String, Object>> getNonFilipinoApplicants() {
        String sql = """
                SELECT applicant_id, app_name, app_email, citizenship
                FROM applicants
                WHERE citizenship != 'Filipino'
                """;
        return jdbcTemplate.queryForList(sql);
    }

    // ── Query 3 ──────────────────────────────────────────────────────────────────
    // Monthly income 20k-60k, employed 4+ years, employer ends with Inc. or Corp.
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
    // DOS applicants (Director, Officer, Stockholder), sorted by name
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
    // Average monthly income by education level (only where avg > 50,000)
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
    // Total applicants per birthplace (only where count > 3), descending
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
    // Married applicants with monthly income > 50,000
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
    // Married, not Manila, supplementary cardholder is Sibling or Other
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
    // Cavite/Laguna residents, with office email, Relative sup., total income > 200k
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
    // Ensures app_age column exists, refreshes it, then queries car ownership stats
    // Safe to call repeatedly — checks for column existence before altering table
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

    // ── Helpers for Query 10 ─────────────────────────────────────────────────────

    private void ensureAppAgeColumn() {
        try {
            // Try a lightweight probe — if column missing this throws
            jdbcTemplate.execute("SELECT app_age FROM applicants LIMIT 1");
        } catch (DataAccessException e) {
            // Column does not exist yet — add it
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
}