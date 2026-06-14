package com.dds.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.dds.model.SupplementaryCardHolder;

@Repository
public class SupplementaryCardholderRepository {
    private final JdbcTemplate jdbcTemplate;

    public SupplementaryCardholderRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean populateSupplementaryCardholderTable(SupplementaryCardHolder s) {
        int currentCount = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM supplementary_cardholder_details WHERE applicant_id = ?", 
            Integer.class, 
            Integer.valueOf(s.getApplicantID())
        );
        
        s.setId(currentCount + 1);

        String sql = "INSERT INTO supplementary_cardholder_details (" +
                "applicant_id, sup_id, sup_name, sup_bdate, sup_bplace, sup_sex, sup_status, sup_citizen, " +
                "sup_addr, sup_home_no, sup_mobileno, sup_email, sup_employer, sup_emp_addr, " +
                "sup_funds, sup_business, sup_office_no, rel_principal) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        // Safely extract CHAR(1) for sex, handling potential null values
        String sexChar = (s.getSex() != null) ? String.valueOf(s.getSex().name().charAt(0)) : null;
        String civilStatusStr = (s.getCivilStatus() != null) ? s.getCivilStatus().name() : null;

        int rows = jdbcTemplate.update(
                    sql,
                    s.getApplicantID(),
                    s.getId(),
                    s.getName(),
                    s.getBirthdate(),
                    s.getBirthplace(),
                    sexChar,           // Now safely matching your CHAR(1) db layout
                    civilStatusStr,
                    s.getCitizenship(),
                    s.getAddress(),
                    s.getHomeNumber(),
                    s.getMobileNumber(),
                    s.getEmail(),
                    s.getEmployer(),
                    s.getEmployerAddress(),
                    s.getSourceOfFunds(),
                    s.getNatureOfBusiness(),
                    s.getOfficeNumber(),
                    s.getRelationshipToPrincipal()
                );

        return rows > 0;
    }
}