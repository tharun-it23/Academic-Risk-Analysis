package com.academicrisks.dao;

import com.academicrisks.model.Notification;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class NotificationDAO {

    public boolean create(Notification n) {
        String sql = "INSERT INTO notifications (message, target_group, sender_name) VALUES (?, ?, ?)";
        try (Connection conn = DatabaseInitializer.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, n.getMessage());
            ps.setString(2, n.getTargetGroup());
            ps.setString(3, n.getSenderName());
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public List<Notification> getNotificationsForUser(String role, String riskStatus) {
        List<Notification> list = new ArrayList<>();
        // Logic: 
        // 1. If faculty: target_group = 'ALL_FACULTY'
        // 2. If student: target_group = 'ALL_STUDENTS' OR (riskStatus='High' AND target_group='HIGH_RISK_STUDENTS')
        
        StringBuilder sql = new StringBuilder("SELECT * FROM notifications WHERE ");
        if ("faculty".equalsIgnoreCase(role)) {
            sql.append("target_group = 'ALL_FACULTY'");
        } else if ("student".equalsIgnoreCase(role)) {
            sql.append("target_group = 'ALL_STUDENTS'");
            if ("High".equalsIgnoreCase(riskStatus)) {
                sql.append(" OR target_group = 'HIGH_RISK_STUDENTS'");
            }
        } else if ("admin".equalsIgnoreCase(role)) {
            // Admins can see all notifications for monitoring
            sql.append("1=1");
        } else {
            return list;
        }
        sql.append(" ORDER BY created_at DESC LIMIT 50");

        try (Connection conn = DatabaseInitializer.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString());
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Notification n = new Notification();
                n.setId(rs.getInt("id"));
                n.setMessage(rs.getString("message"));
                n.setTargetGroup(rs.getString("target_group"));
                n.setSenderName(rs.getString("sender_name"));
                n.setCreatedAt(rs.getString("created_at"));
                list.add(n);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }
}
