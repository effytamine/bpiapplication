package com.dds.model;

import java.math.BigDecimal;

public class Work {
    private int id; // foreign key
    private String employmentType;
    private String employer;
    private int yearsWithPresentEmployer;
    private String position;
    private String business;
    private String officeAddress;
    private String officeNumber;
    private BigDecimal monthlyIncome;
    private String officeEmail;
    private String previousEmployer;

    
    @Override
    public String toString() {
        return "Work {" +
                "id=" + id +
                ", employmentType='" + employmentType + '\'' +
                ", employer='" + employer + '\'' +
                ", yearsWithPresentEmployer=" + yearsWithPresentEmployer +
                ", position='" + position + '\'' +
                ", business='" + business + '\'' +
                ", officeAddress='" + officeAddress + '\'' +
                ", officeNumber='" + officeNumber + '\'' +
                ", monthlyIncome=" + monthlyIncome +
                ", officeEmail='" + officeEmail + '\'' +
                ", previousEmployer='" + previousEmployer + '\'' +
                '}';
    }
    
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getEmploymentType() {
        return employmentType;
    }

    public void setEmploymentType(String employmentType) {
        this.employmentType = employmentType;
    }

    public int getYearsWithPresentEmployer() {
        return yearsWithPresentEmployer;
    }

    public void setYearsWithPresentEmployer(int yearsWithPresentEmployer) {
        this.yearsWithPresentEmployer = yearsWithPresentEmployer;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getBusiness() {
        return business;
    }

    public void setBusiness(String business) {
        this.business = business;
    }

    public String getOfficeAddress() {
        return officeAddress;
    }

    public void setOfficeAddress(String officeAddress) {
        this.officeAddress = officeAddress;
    }

    public String getOfficeNumber() {
        return officeNumber;
    }

    public void setOfficeNumber(String officeNumber) {
        this.officeNumber = officeNumber;
    }

    public BigDecimal getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(BigDecimal monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public String getOfficeEmail() {
        return officeEmail;
    }

    public void setOfficeEmail(String officeEmail) {
        this.officeEmail = officeEmail;
    }

    public String getPreviousEmployer() {
        return previousEmployer;
    }

    public void setPreviousEmployer(String previousEmployer) {
        this.previousEmployer = previousEmployer;
    }

    public String getEmployer() {
        return employer;
    }

    public void setEmployer(String employer) {
        this.employer = employer;
    }
}
