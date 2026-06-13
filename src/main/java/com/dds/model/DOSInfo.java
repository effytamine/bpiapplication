package com.dds.model;

public class DOSInfo {
    private int id; // foreign key
    private String company;
    private String position;

    @Override
    public String toString() {
        return "DOSInfo {" +
                "id=" + id +
                ", company='" + company + '\'' +
                ", position='" + position + '\'' +
                '}';
    }
    
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }
}
