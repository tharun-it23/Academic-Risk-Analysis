package com.academicrisks.model;

public class Student {
    private int id;
    private String name;
    private String rollNo;
    private String department;
    private String riskStatus;
    private double riskScore;
    private int semester;
    private int year;
    private double cgpa;
    private double attendance;
    private String email;
    private String phone;
    private String address;
    private int arrearCount;
    private String placementEligibilityStatus;

    public Student() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRollNo() { return rollNo; }
    public void setRollNo(String rollNo) { this.rollNo = rollNo; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getRiskStatus() { return riskStatus; }
    public void setRiskStatus(String riskStatus) { this.riskStatus = riskStatus; }

    public double getRiskScore() { return riskScore; }
    public void setRiskScore(double riskScore) { this.riskScore = riskScore; }

    public int getSemester() { return semester; }
    public void setSemester(int semester) { this.semester = semester; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public double getCgpa() { return cgpa; }
    public void setCgpa(double cgpa) { this.cgpa = cgpa; }

    public double getAttendance() { return attendance; }
    public void setAttendance(double attendance) { this.attendance = attendance; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public int getArrearCount() { return arrearCount; }
    public void setArrearCount(int arrearCount) { this.arrearCount = arrearCount; }

    public String getPlacementEligibilityStatus() { return placementEligibilityStatus; }
    public void setPlacementEligibilityStatus(String placementEligibilityStatus) { this.placementEligibilityStatus = placementEligibilityStatus; }
}
