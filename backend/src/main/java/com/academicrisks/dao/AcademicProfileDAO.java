package com.academicrisks.dao;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class AcademicProfileDAO {

    public JsonObject getFullStudentProfile(int studentId) {
        JsonObject profile = new JsonObject();
        try (Connection conn = DatabaseInitializer.getConnection()) {
            
            // 1. Fetch Semester Records
            JsonArray semesters = new JsonArray();
            try (PreparedStatement ps = conn.prepareStatement("SELECT * FROM semester_records WHERE student_id = ? ORDER BY semester_no ASC")) {
                ps.setInt(1, studentId);
                ResultSet rs = ps.executeQuery();
                while (rs.next()) {
                    JsonObject sem = new JsonObject();
                    sem.addProperty("semesterNo", rs.getInt("semester_no"));
                    sem.addProperty("gpa", rs.getDouble("gpa"));
                    sem.addProperty("cgpaSoFar", rs.getDouble("cgpa_so_far"));
                    sem.addProperty("creditsEarned", rs.getInt("credits_earned"));
                    semesters.add(sem);
                }
            }
            profile.add("semesterHistory", semesters);

            // 2. Fetch Internal Marks
            JsonArray internalMarks = new JsonArray();
            try (PreparedStatement ps = conn.prepareStatement("SELECT * FROM internal_marks WHERE student_id = ? ORDER BY semester_no DESC")) {
                ps.setInt(1, studentId);
                ResultSet rs = ps.executeQuery();
                while (rs.next()) {
                    JsonObject mark = new JsonObject();
                    mark.addProperty("semesterNo", rs.getInt("semester_no"));
                    mark.addProperty("subjectCode", rs.getString("subject_code"));
                    mark.addProperty("subjectName", rs.getString("subject_name"));
                    mark.addProperty("ia1", rs.getDouble("ia1"));
                    mark.addProperty("ia2", rs.getDouble("ia2"));
                    mark.addProperty("ia3", rs.getDouble("ia3"));
                    mark.addProperty("assignment", rs.getDouble("assignment"));
                    mark.addProperty("total", rs.getDouble("total"));
                    internalMarks.add(mark);
                }
            }
            profile.add("internalMarks", internalMarks);

            // 3. Fetch Attendance Breakdown
            JsonArray attendanceRecords = new JsonArray();
            try (PreparedStatement ps = conn.prepareStatement("SELECT * FROM attendance_records WHERE student_id = ? ORDER BY month DESC")) {
                ps.setInt(1, studentId);
                ResultSet rs = ps.executeQuery();
                while (rs.next()) {
                    JsonObject att = new JsonObject();
                    att.addProperty("semesterNo", rs.getInt("semester_no"));
                    att.addProperty("subjectCode", rs.getString("subject_code"));
                    att.addProperty("month", rs.getString("month"));
                    att.addProperty("classesHeld", rs.getInt("classes_held"));
                    att.addProperty("classesAttended", rs.getInt("classes_attended"));
                    att.addProperty("attendancePct", rs.getDouble("attendance_pct"));
                    att.addProperty("detentionFlag", rs.getInt("detention_flag"));
                    attendanceRecords.add(att);
                }
            }
            profile.add("attendanceRecords", attendanceRecords);

            // 4. Fetch Arrears
            JsonArray arrears = new JsonArray();
            try (PreparedStatement ps = conn.prepareStatement("SELECT * FROM arrears WHERE student_id = ? ORDER BY status DESC, semester_no ASC")) {
                ps.setInt(1, studentId);
                ResultSet rs = ps.executeQuery();
                while (rs.next()) {
                    JsonObject arr = new JsonObject();
                    arr.addProperty("subjectCode", rs.getString("subject_code"));
                    arr.addProperty("subjectName", rs.getString("subject_name"));
                    arr.addProperty("semesterNo", rs.getInt("semester_no"));
                    arr.addProperty("examAttempt", rs.getInt("exam_attempt"));
                    arr.addProperty("status", rs.getString("status"));
                    arr.addProperty("clearedSemester", rs.getInt("cleared_semester"));
                    arrears.add(arr);
                }
            }
            profile.add("arrearHistory", arrears);

            // 5. Fetch Placement Record
            JsonObject placementInfo = new JsonObject();
            try (PreparedStatement ps = conn.prepareStatement("SELECT * FROM placement_records WHERE student_id = ? ORDER BY id DESC LIMIT 1")) {
                ps.setInt(1, studentId);
                ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    placementInfo.addProperty("cgpa", rs.getDouble("cgpa"));
                    placementInfo.addProperty("arrearCount", rs.getInt("arrear_count"));
                    placementInfo.addProperty("attendancePct", rs.getDouble("attendance_pct"));
                    placementInfo.addProperty("eligibilityStatus", rs.getString("eligibility_status"));
                    placementInfo.addProperty("drivesApplied", rs.getInt("drives_applied"));
                    placementInfo.addProperty("drivesSelected", rs.getInt("drives_selected"));
                }
            }
            profile.add("placementInfo", placementInfo);

            // 6. Fetch Risk Alerts
            JsonArray alerts = new JsonArray();
            try (PreparedStatement ps = conn.prepareStatement("SELECT * FROM alerts WHERE student_id = ? ORDER BY date_raised DESC")) {
                ps.setInt(1, studentId);
                ResultSet rs = ps.executeQuery();
                while (rs.next()) {
                    JsonObject alert = new JsonObject();
                    alert.addProperty("alertType", rs.getString("alert_type"));
                    alert.addProperty("triggerReason", rs.getString("trigger_reason"));
                    alert.addProperty("dateRaised", rs.getString("date_raised"));
                    alert.addProperty("resolvedStatus", rs.getInt("resolved_status"));
                    alerts.add(alert);
                }
            }
            profile.add("earlyWarningAlerts", alerts);

            // 7. Generate Mock Data if empty (since seeder didn't fill all deep tables yet)
            if (semesters.size() == 0) {
                profile.add("semesterHistory", generateMockSemesters());
                
                // Fetch department to generate relevant subjects
                String department = "CSE";
                try (PreparedStatement psDept = conn.prepareStatement("SELECT department FROM students WHERE id = ?")) {
                    psDept.setInt(1, studentId);
                    ResultSet rsDept = psDept.executeQuery();
                    if (rsDept.next() && rsDept.getString("department") != null) {
                        department = rsDept.getString("department");
                    }
                } catch (Exception e) {
                    // Ignore, use default
                }
                
                profile.add("internalMarks", generateMockMarks(department));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return profile;
    }

    private JsonArray generateMockSemesters() {
        JsonArray arr = new JsonArray();
        double[] gpas = {7.5, 7.8, 7.2, 8.0, 7.9, 8.2};
        double[] cgpas = {7.5, 7.65, 7.5, 7.62, 7.68, 7.76};
        for (int i = 0; i < 6; i++) {
            JsonObject s = new JsonObject();
            s.addProperty("semesterNo", i + 1);
            s.addProperty("gpa", gpas[i]);
            s.addProperty("cgpaSoFar", cgpas[i]);
            s.addProperty("creditsEarned", 22);
            arr.add(s);
        }
        return arr;
    }

    private JsonArray generateMockMarks(String department) {
        JsonArray arr = new JsonArray();
        String[] subjects;
        
        String depType = department != null ? department.toUpperCase().trim() : "CSE";
        switch (depType) {
            case "ECE":
                subjects = new String[]{"Analog Circuits", "Digital Signal Processing", "Microprocessors", "Communication Systems"};
                break;
            case "MECH":
                subjects = new String[]{"Thermodynamics", "Fluid Mechanics", "Kinematics of Machinery", "Heat Transfer"};
                break;
            case "CIVIL":
                subjects = new String[]{"Structural Analysis", "Geotechnical Engineering", "Transportation Engineering", "Fluid Mechanics"};
                break;
            case "EEE":
                subjects = new String[]{"Power Systems", "Control Systems", "Electrical Machines", "Power Electronics"};
                break;
            case "IT":
                subjects = new String[]{"Web Technologies", "Software Engineering", "Computer Networks", "Database Management"};
                break;
            case "AI&DS":
            case "AI":
                subjects = new String[]{"Machine Learning", "Deep Learning", "Data Mining", "Artificial Intelligence"};
                break;
            case "CSE":
            default:
                subjects = new String[]{"Data Structures", "Operating Systems", "Computer Networks", "Database Systems"};
                break;
        }

        for (String subject : subjects) {
            JsonObject m = new JsonObject();
            m.addProperty("semesterNo", 5);
            m.addProperty("subjectCode", subject.substring(0, 2).replace(" ", "").toUpperCase() + "301");
            m.addProperty("subjectName", subject);
            m.addProperty("ia1", 45.0);
            m.addProperty("ia2", 42.0);
            m.addProperty("ia3", 48.0);
            m.addProperty("assignment", 10.0);
            m.addProperty("total", 145.0);
            arr.add(m);
        }
        return arr;
    }

    public boolean addInternalMarks(int studentId, JsonObject marks) {
        String sql = "INSERT INTO internal_marks (student_id, semester_no, subject_code, subject_name, ia1, ia2, ia3, assignment, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseInitializer.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, studentId);
            ps.setInt(2, marks.get("semesterNo").getAsInt());
            ps.setString(3, marks.get("subjectCode").getAsString());
            ps.setString(4, marks.get("subjectName").getAsString());
            ps.setDouble(5, marks.get("ia1").getAsDouble());
            ps.setDouble(6, marks.get("ia2").getAsDouble());
            ps.setDouble(7, marks.get("ia3").getAsDouble());
            ps.setDouble(8, marks.get("assignment").getAsDouble());
            
            double total = marks.get("ia1").getAsDouble() + marks.get("ia2").getAsDouble() + marks.get("ia3").getAsDouble() + marks.get("assignment").getAsDouble();
            ps.setDouble(9, total);
            
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}
