package com.academicrisks.dao;

import java.sql.*;
import java.util.*;

public class ActivityLogDAO {

    public void log(String type, String description, String userName) {
        String sql = "INSERT INTO activity_log (type, description, user_name, created_at) VALUES (?, ?, ?, datetime('now'))";
        try (Connection conn = DatabaseInitializer.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, type);
            ps.setString(2, description);
            ps.setString(3, userName);
            ps.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<Map<String, Object>> getRecent(int limit) {
        List<Map<String, Object>> activities = new ArrayList<>();
        String sql = "SELECT id, type, description, user_name, created_at FROM activity_log ORDER BY created_at DESC LIMIT ?";
        try (Connection conn = DatabaseInitializer.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, limit);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Map<String, Object> activity = new HashMap<>();
                activity.put("id", String.valueOf(rs.getInt("id")));
                activity.put("type", rs.getString("type"));
                activity.put("description", rs.getString("description"));
                activity.put("user", rs.getString("user_name"));
                activity.put("timestamp", rs.getString("created_at"));
                activities.add(activity);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return activities;
    }
}
