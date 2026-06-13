package com.dds.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.dds.model.Spouse;

@Repository
public class SpouseRepository {
    private final JdbcTemplate jdbcTemplate;

    public SpouseRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean populateSpouseTable(Spouse s) {
        String sql = "INSERT INTO spouse (" +
                        "applicant_id, name, app_bdate, mobile_no, app_email, employer) " +
                        "VALUES (?, ?, ?, ?, ?, ?)";

        int numberOfRowsAffected = jdbcTemplate.update(
                                        sql,
                                        s.getId(),            
                                        s.getName(),
                                        s.getBirthdate(),
                                        s.getMobileNumber(),
                                        s.getEmail(),
                                        s.getEmployer()
                                    );

        return numberOfRowsAffected > 0;
    }
}
                        