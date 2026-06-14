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
        int currentCount = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM dos_rel_info WHERE applicant_id = ?", 
            Integer.class, 
            Integer.valueOf(d.getId())
        );
        
        d.setRelID(currentCount + 1);

        String sql = "INSERT INTO dos_rel_info (dos_rel_id, applicant_id, dos_rel_name, dos_rel, dos_rel_comp) VALUES (?, ?,?, ?, ?)";

        int numberOfRowsAffected = jdbcTemplate.update(
                        sql,
                        d.getRelID(),
                        d.getId(),          
                        d.getName(),        
                        d.getRelationship(),
                        d.getCompany() 
                    );

        return numberOfRowsAffected > 0;
    }
}
