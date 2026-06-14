CREATE TABLE IF NOT EXISTS applicants (
    applicant_id INT PRIMARY KEY AUTO_INCREMENT,
    app_name VARCHAR(30) NOT NULL,
    app_bdate DATE NOT NULL,
    app_bplace VARCHAR(50) NOT NULL,
    app_sex CHAR(1) NOT NULL,
    card_name VARCHAR(21) NOT NULL,
    mother_name VARCHAR(30) NOT NULL,
    edu_level VARCHAR(30) NOT NULL,
    civil_status VARCHAR(30) NOT NULL,
    dependents INT NOT NULL,
    app_tin VARCHAR(20) NOT NULL,
    sss_gsis VARCHAR(20) NOT NULL,
    car_own VARCHAR(30) NOT NULL,
    citizenship VARCHAR(30) NOT NULL,
    mobile_no CHAR(13) NOT NULL,
    home_no VARCHAR(15),
    home_address VARCHAR(100) NOT NULL,
    yrs_res INT NOT NULL,
    dos_flag BOOLEAN NOT NULL,
    rel_dos_flag BOOLEAN NOT NULL,
    app_email VARCHAR(30) NOT NULL,
    card_addr CHAR(1) NOT NULL
);

CREATE TABLE IF NOT EXISTS dos_info (
    applicant_id INT NOT NULL,
    dos_company VARCHAR(30) NOT NULL,
    dos_pos VARCHAR(20) NOT NULL,

    PRIMARY KEY (applicant_id),
    CONSTRAINT fk_dos_applicant
        FOREIGN KEY (applicant_id)
        REFERENCES applicants(applicant_id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS dos_rel_info (
    dos_rel_id INT NOT NULL,
    applicant_id INT NOT NULL, 
    dos_rel_name VARCHAR(30) NOT NULL,
    dos_rel VARCHAR(15) NOT NULL,
    dos_rel_comp VARCHAR(30) NOT NULL,

    PRIMARY KEY(applicant_id, dos_rel_id),
    CONSTRAINT fk_dos_rel_applicant
        FOREIGN KEY (applicant_id)
        REFERENCES applicants(applicant_id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS spouse (
    applicant_id INT NOT NULL,
    name VARCHAR(30) NOT NULL,
    app_bdate DATE NOT NULL,
    mobile_no VARCHAR(15) NOT NULL,
    app_email VARCHAR(30) NOT NULL,
    employer VARCHAR(30),

    PRIMARY KEY (applicant_id),
    CONSTRAINT fk_spouse_applicant
        FOREIGN KEY (applicant_id)
        REFERENCES applicants(applicant_id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS work_details (
    applicant_id INT NOT NULL,
    emp_type VARCHAR(20) NOT NULL,
    employer VARCHAR(20) NOT NULL,
    yrs_emp INT NOT NULL,
    position VARCHAR(20) NOT NULL, 
    business VARCHAR(15) NOT NULL, 
    office_addr VARCHAR(100) NOT NULL, 
    office_no VARCHAR(15) NOT NULL,
    monthly_income DECIMAL(11, 2) NOT NULL,
    office_email VARCHAR (30) NOT NULL,
    prev_emp VARCHAR(30),

    PRIMARY KEY (applicant_id),
    CONSTRAINT fk_work_details_applicant
        FOREIGN KEY (applicant_id)
        REFERENCES applicants(applicant_id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS supplementary_cardholder_details (
    sup_id INT NOT NULL,
    applicant_id INT NOT NULL,
    sup_name VARCHAR(30) NOT NULL,
    sup_bdate DATE NOT NULL,
    sup_bplace VARCHAR(50) NOT NULL,
    sup_sex CHAR(1) NOT NULL,
    sup_status VARCHAR(30) NOT NULL,
    sup_citizen VARCHAR(15) NOT NULL,
    sup_addr VARCHAR(100) NOT NULL,
    sup_home_no VARCHAR(15),
    sup_mobileno CHAR(13) NOT NULL,
    sup_email VARCHAR(30) NOT NULL,
    sup_employer VARCHAR(30) NOT NULL,
    sup_emp_addr VARCHAR(100) NOT NULL,
    sup_funds VARCHAR(15) NOT NULL,
    sup_business VARCHAR(15) NOT NULL,
    sup_office_no VARCHAR(15) NOT NULL,
    rel_principal VARCHAR(15) NOT NULL,

    PRIMARY KEY (applicant_id, sup_id),
    CONSTRAINT fk_supplementary_cardholder_details_applicant
        FOREIGN KEY (applicant_id)
        REFERENCES applicants(applicant_id)
        ON DELETE CASCADE
);