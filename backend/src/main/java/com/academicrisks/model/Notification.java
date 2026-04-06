package com.academicrisks.model;

public class Notification {
    private int id;
    private String message;
    private String targetGroup; // ALL_STUDENTS, HIGH_RISK_STUDENTS, ALL_FACULTY
    private String senderName;
    private String createdAt;

    public Notification() {}

    public Notification(String message, String targetGroup, String senderName) {
        this.message = message;
        this.targetGroup = targetGroup;
        this.senderName = senderName;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getTargetGroup() {
        return targetGroup;
    }

    public void setTargetGroup(String targetGroup) {
        this.targetGroup = targetGroup;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
