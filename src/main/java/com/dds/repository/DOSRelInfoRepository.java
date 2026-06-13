package com.dds.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.dds.model.DOSRelInfo;

@Repository
public class DOSRelInfoRepository {
    private final JdbcTemplate jdbcTemplate;

    public DOSRelInfoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean populateDOSInfoTable(DOSRelInfo d) {
        String sql = "INSERT INTO dos_rel_info (applicant_id, dos_rel_name, dos_rel) VALUES (?, ?, ?)";

        int numberOfRowsAffected = jdbcTemplate.update(
                        sql,
                        d.getId(),          
                        d.getName(),        
                        d.getRelationship() 
                    );

        return numberOfRowsAffected > 0;
    }
}
