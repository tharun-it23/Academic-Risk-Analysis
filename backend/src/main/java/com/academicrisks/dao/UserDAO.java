package com.academicrisks.dao;

import com.academicrisks.model.User;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class UserDAO {

    public User findByUsername(String username) {
        String sql = "SELECT * FROM users WHERE username = ?";
        try (Connection conn = DatabaseInitializer.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, username);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                User user = new User();
                user.setId(rs.getInt("id"));
                user.setUsername(rs.getString("username"));
                user.setPassword(rs.getString("password"));
                user.setRole(rs.getString("role"));
                user.setName(rs.getString("name"));
                return user;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public User findById(int id) {
        String sql = "SELECT * FROM users WHERE id = ?";
        try (Connection conn = DatabaseInitializer.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                User user = new User();
                user.setId(rs.getInt("id"));
                user.setUsername(rs.getString("username"));
                user.setPassword(rs.getString("password"));
                user.setRole(rs.getString("role"));
                user.setName(rs.getString("name"));
                return user;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public User findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = ?";
        try (Connection conn = DatabaseInitializer.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, email);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                User user = new User();
                user.setId(rs.getInt("id"));
                user.setUsername(rs.getString("username"));
                user.setPassword(rs.getString("password"));
                user.setRole(rs.getString("role"));
                user.setName(rs.getString("name"));
                user.setEmail(rs.getString("email"));
                return user;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Finds a user by Google email. If none exists, creates a new student account.
     * Uses email as username (with @ replaced by _at_) to ensure uniqueness.
     */
    public User findOrCreateGoogleUser(String email, String name) {
        // 1. Try matching by stored email
        User user = findByEmail(email);
        if (user != null) return user;

        // 2. Try matching by username = email (some users may have registered with email)
        user = findByUsername(email);
        if (user != null) return user;

        // 3. Try matching by the 'safe' username we generate for Google users
        String safeUsername = email.replace("@", "_at_");
        user = findByUsername(safeUsername);
        if (user != null) {
            // Update the user's email if it was missing (migration scenario)
            try (Connection conn = DatabaseInitializer.getConnection();
                 PreparedStatement ps = conn.prepareStatement("UPDATE users SET email = ? WHERE username = ?")) {
                ps.setString(1, email);
                ps.setString(2, safeUsername);
                ps.executeUpdate();
            } catch (Exception e) { e.printStackTrace(); }
            return findByUsername(safeUsername); // Return updated user
        }

        // 4. Create a new student account
        String sql = "INSERT INTO users (username, password, role, name, email) VALUES (?, ?, 'student', ?, ?)";
        try (Connection conn = DatabaseInitializer.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, safeUsername);
            ps.setString(2, "GOOGLE_AUTH_NO_PASSWORD");
            ps.setString(3, name != null ? name : safeUsername);
            ps.setString(4, email);
            ps.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

        return findByEmail(email);
    }

    public boolean updatePassword(int userId, String newPassword) {
        String sql = "UPDATE users SET password = ? WHERE id = ?";
        try (Connection conn = DatabaseInitializer.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, newPassword);
            ps.setInt(2, userId);
            int rowsAffected = ps.executeUpdate();
            return rowsAffected > 0;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean addUser(User user) {
        String sql = "INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)";
        try (Connection conn = DatabaseInitializer.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, user.getUsername());
            ps.setString(2, user.getPassword());
            ps.setString(3, user.getRole());
            ps.setString(4, user.getName());
            int rowsAffected = ps.executeUpdate();
            return rowsAffected > 0;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}
