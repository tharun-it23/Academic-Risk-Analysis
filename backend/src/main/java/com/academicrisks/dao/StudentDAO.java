package com.academicrisks.dao;

import com.academicrisks.model.Student;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class StudentDAO {

    private Student mapRow(ResultSet rs) throws Exception {
        Student s = new Student();
        s.setId(rs.getInt("id"));
        s.setName(rs.getString("name"));
        s.setRollNo(rs.getString("roll_no"));
        s.setDepartment(rs.getString("department"));
        s.setRiskStatus(rs.getString("risk_status"));
        s.setSemester(rs.getInt("semester"));
        s.setGpa(rs.getDouble("gpa"));
        s.setAttendance(rs.getDouble("attendance"));
        s.setEmail(rs.getString("email"));
        s.setPhone(rs.getString("phone"));
        s.setYear(rs.getInt("year"));
        s.setAddress(rs.getString("address"));
        s.setBacklogs(rs.getInt("backlogs"));
        return s;
    }

    public List<Student> findAll() {
        List<Student> students = new ArrayList<>();
        String sql = "SELECT * FROM students ORDER BY name";
        try (Connection conn = DatabaseInitializer.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                students.add(mapRow(rs));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return students;
    }

    public Student findById(int id) {
        String sql = "SELECT * FROM students WHERE id = ?";
        try (Connection conn = DatabaseInitializer.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return mapRow(rs);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public Student findByRollNo(String rollNo) {
        String sql = "SELECT * FROM students WHERE roll_no = ?";
        try (Connection conn = DatabaseInitializer.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, rollNo);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return mapRow(rs);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public Student create(Student student) {
        String sql = "INSERT INTO students (name, roll_no, department, risk_status, semester, gpa, attendance, email, phone, year, address, backlogs) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseInitializer.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, student.getName());
            ps.setString(2, student.getRollNo());
            ps.setString(3, student.getDepartment());
            ps.setString(4, student.getRiskStatus() != null ? student.getRiskStatus() : calculateRisk(student.getGpa(), student.getAttendance()));
            ps.setInt(5, student.getSemester());
            ps.setDouble(6, student.getGpa());
            ps.setDouble(7, student.getAttendance());
            ps.setString(8, student.getEmail());
            ps.setString(9, student.getPhone());
            ps.setInt(10, student.getYear());
            ps.setString(11, student.getAddress());
            ps.setInt(12, student.getBacklogs());
            ps.executeUpdate();

            ResultSet keys = ps.getGeneratedKeys();
            if (keys.next()) {
                student.setId(keys.getInt(1));
            }
            return student;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<Student> createBulk(List<Student> students) {
        List<Student> created = new ArrayList<>();
        for (Student s : students) {
            Student result = create(s);
            if (result != null) {
                created.add(result);
            }
        }
        return created;
    }

    public boolean delete(int id) {
        String sql = "DELETE FROM students WHERE id = ?";
        try (Connection conn = DatabaseInitializer.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean update(Student student) {
        String sql = "UPDATE students SET name = ?, roll_no = ?, department = ?, risk_status = ?, semester = ?, " +
                     "gpa = ?, attendance = ?, email = ?, phone = ?, year = ?, address = ?, backlogs = ? " +
                     "WHERE id = ?";
        try (Connection conn = DatabaseInitializer.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, student.getName());
            ps.setString(2, student.getRollNo());
            ps.setString(3, student.getDepartment());
            ps.setString(4, student.getRiskStatus() != null ? student.getRiskStatus() : calculateRisk(student.getGpa(), student.getAttendance()));
            ps.setInt(5, student.getSemester());
            ps.setDouble(6, student.getGpa());
            ps.setDouble(7, student.getAttendance());
            ps.setString(8, student.getEmail());
            ps.setString(9, student.getPhone());
            ps.setInt(10, student.getYear());
            ps.setString(11, student.getAddress());
            ps.setInt(12, student.getBacklogs());
            ps.setInt(13, student.getId());
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    // ---- Stats Methods ----

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        try (Connection conn = DatabaseInitializer.getConnection();
             Statement stmt = conn.createStatement()) {

            ResultSet rs = stmt.executeQuery("SELECT COUNT(*) as total FROM students");
            if (rs.next()) stats.put("totalStudents", rs.getInt("total"));

            rs = stmt.executeQuery("SELECT COUNT(*) as cnt FROM students WHERE risk_status = 'High'");
            if (rs.next()) stats.put("highRisk", rs.getInt("cnt"));

            rs = stmt.executeQuery("SELECT COUNT(*) as cnt FROM students WHERE risk_status = 'Medium'");
            if (rs.next()) stats.put("mediumRisk", rs.getInt("cnt"));

            rs = stmt.executeQuery("SELECT COUNT(*) as cnt FROM students WHERE risk_status = 'Low'");
            if (rs.next()) stats.put("lowRisk", rs.getInt("cnt"));

            rs = stmt.executeQuery("SELECT AVG(attendance) as avg_att, AVG(gpa) as avg_gpa FROM students");
            if (rs.next()) {
                stats.put("avgAttendance", rs.getDouble("avg_att"));
                stats.put("avgCGPA", rs.getDouble("avg_gpa"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return stats;
    }

    public Map<String, Object> getMonthlyStats(int month, int year) {
        // Since SQLite doesn't have month-based partitioning on our schema,
        // we return department-wise risk breakdown as the monthly analytics
        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> departments = new ArrayList<>();

        try (Connection conn = DatabaseInitializer.getConnection();
             Statement stmt = conn.createStatement()) {

            ResultSet rs = stmt.executeQuery("SELECT DISTINCT department FROM students ORDER BY department");
            List<String> deptNames = new ArrayList<>();
            while (rs.next()) {
                deptNames.add(rs.getString("department"));
            }

            for (String dept : deptNames) {
                Map<String, Object> deptStats = new HashMap<>();
                deptStats.put("name", dept);

                PreparedStatement ps = conn.prepareStatement(
                    "SELECT " +
                    "  COUNT(*) as total, " +
                    "  SUM(CASE WHEN risk_status = 'High' THEN 1 ELSE 0 END) as highRisk, " +
                    "  SUM(CASE WHEN risk_status = 'Medium' THEN 1 ELSE 0 END) as mediumRisk, " +
                    "  SUM(CASE WHEN risk_status = 'Low' THEN 1 ELSE 0 END) as lowRisk, " +
                    "  AVG(CASE WHEN risk_status = 'High' THEN 5 WHEN risk_status = 'Medium' THEN 3 ELSE 1 END) as avgRiskScore " +
                    "FROM students WHERE department = ?"
                );
                ps.setString(1, dept);
                ResultSet drs = ps.executeQuery();
                if (drs.next()) {
                    deptStats.put("total", drs.getInt("total"));
                    deptStats.put("highRisk", drs.getInt("highRisk"));
                    deptStats.put("mediumRisk", drs.getInt("mediumRisk"));
                    deptStats.put("lowRisk", drs.getInt("lowRisk"));
                    deptStats.put("avgRiskScore", drs.getDouble("avgRiskScore"));
                }
                departments.add(deptStats);
                ps.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        result.put("departments", departments);
        result.put("month", month);
        result.put("year", year);
        return result;
    }

    private String calculateRisk(double gpa, double attendance) {
        if (gpa < 5.0 || attendance < 60) return "High";
        if (gpa < 7.0 || attendance < 75) return "Medium";
        return "Low";
    }
}
