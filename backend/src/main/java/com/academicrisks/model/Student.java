package com.academicrisks.model;

public class Student {
    private int id;
    private String name;
    private String rollNo;
    private String department;
    private String riskStatus; // High, Medium, Low
    private int semester;
    private double gpa;
    private double attendance;
    private String email;
    private String phone;
    private int year;
    private String address;
    private int backlogs;

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

    public int getSemester() { return semester; }
    public void setSemester(int semester) { this.semester = semester; }

    public double getGpa() { return gpa; }
    public void setGpa(double gpa) { this.gpa = gpa; }

    public double getAttendance() { return attendance; }
    public void setAttendance(double attendance) { this.attendance = attendance; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public int getBacklogs() { return backlogs; }
    public void setBacklogs(int backlogs) { this.backlogs = backlogs; }
}
