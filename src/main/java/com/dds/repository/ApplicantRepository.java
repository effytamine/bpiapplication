package com.dds.repository;

import java.sql.PreparedStatement;
import java.sql.Statement;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import com.dds.model.Applicant;

@Repository
public class ApplicantRepository {
    private final JdbcTemplate jdbcTemplate;

    public ApplicantRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public int createApplicant(Applicant a) {
        String sql = "INSERT INTO applicants (" +
        "app_name, app_bdate, app_bplace, app_sex, card_name, mother_name, edu_level, civil_status, " +
        "dependents, app_tin, sss_gsis, car_own, citizenship, mobile_no, home_no, home_address, " +
        "yrs_res, dos_flag, rel_dos_flag, app_email, card_addr) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"; 

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);

            ps.setString(1, a.getName());
            ps.setDate(2, java.sql.Date.valueOf(a.getBirthdate()));
            ps.setString(3, a.getBirthPlace());
            ps.setString(4, a.getSex() != null ? String.valueOf(a.getSex().name().charAt(0)) : null);
            ps.setString(5, a.getCardName());
            ps.setString(6, a.getMamaName());
            ps.setString(7, a.getEducationalAttainment().name());
            ps.setString(8, a.getCivilStatus().name());
            ps.setInt(9, a.getNumberOfDependents());
            ps.setString(10, a.getTinNumber());
            ps.setString(11, a.getSSSorGSISnumber());
            ps.setString(12, a.getCarOwnership().name());
            ps.setString(13, a.getCitizenship());
            ps.setString(14, a.getMobileNumber());
            ps.setString(15, a.getHomeNumber());
            ps.setString(16, a.getHomeAddress());
            ps.setInt(17, a.getYearsOfResidence());
            ps.setBoolean(18, a.isDosFlag());
            ps.setBoolean(19, a.isRelDosFlag());
            ps.setString(20, a.getEmail());
            ps.setString(21, a.getCardAddress());

            return ps;

        }, keyHolder);

        return keyHolder.getKey().intValue();
    }
}
