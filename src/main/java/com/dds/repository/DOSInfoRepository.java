package com.dds.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.dds.model.DOSInfo;

@Repository
public class DOSInfoRepository {
    private final JdbcTemplate jdbcTemplate;

    public DOSInfoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean populateDOSInfoTable(DOSInfo d) {
        String sql = "INSERT INTO dos_info (applicant_id, dos_company, dos_pos) VALUES (?, ?, ?)";

        int numberOfRowsAffected = jdbcTemplate.update(
                                        sql,
                                        d.getId(),
                                        d.getCompany(),
                                        d.getPosition()
                                    );

        return numberOfRowsAffected > 0;
    }
}
