package com.dds.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.dds.model.Work;

@Repository
public class WorkRepository {
    private final JdbcTemplate jdbcTemplate;

    public WorkRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean populateWorkTable(Work w) {
        String sql = "INSERT INTO work_details (" +
            "applicant_id, emp_type, employer, yrs_emp, position, business, " +
            "office_addr, office_no, monthly_income, office_email, prev_emp) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        int numberOfRowsAffected = jdbcTemplate.update(
                                        sql,
                                        w.getId(),                      
                                        w.getEmploymentType(),
                                        w.getEmployer(),         
                                        w.getYearsWithPresentEmployer(),
                                        w.getPosition(),
                                        w.getBusiness(),
                                        w.getOfficeAddress(),
                                        w.getOfficeNumber(),
                                        w.getMonthlyIncome(),
                                        w.getOfficeEmail(),
                                        w.getPreviousEmployer()
                                    );

        return numberOfRowsAffected > 0;
    }
}
