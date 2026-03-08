package com.academicrisks.dao;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import java.io.File;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class DatabaseInitializer implements ServletContextListener {

    private static final String DB_DIR = System.getProperty("user.dir") + File.separator + "data";
    private static final String DB_URL = "jdbc:sqlite:" + DB_DIR + File.separator + "academic_risk.db";

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        try {
            // Ensure data directory exists
            File dir = new File(DB_DIR);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            Class.forName("org.sqlite.JDBC");

            try (Connection conn = DriverManager.getConnection(DB_URL);
                 Statement stmt = conn.createStatement()) {

                // Enable WAL mode for better concurrent access
                stmt.execute("PRAGMA journal_mode=WAL");

                // Drop existing tables for a fresh start during development
                stmt.execute("DROP TABLE IF EXISTS users");
                stmt.execute("DROP TABLE IF EXISTS students");

                // Create users table
                stmt.execute(
                    "CREATE TABLE IF NOT EXISTS users (" +
                    "  id INTEGER PRIMARY KEY AUTOINCREMENT," +
                    "  username TEXT UNIQUE NOT NULL," +
                    "  password TEXT NOT NULL," +
                    "  role TEXT NOT NULL," +
                    "  name TEXT" +
                    ")"
                );

                // Create students table
                stmt.execute(
                    "CREATE TABLE IF NOT EXISTS students (" +
                    "  id INTEGER PRIMARY KEY AUTOINCREMENT," +
                    "  name TEXT NOT NULL," +
                    "  roll_no TEXT UNIQUE NOT NULL," +
                    "  department TEXT," +
                    "  risk_status TEXT DEFAULT 'Low'," +
                    "  semester INTEGER DEFAULT 1," +
                    "  gpa REAL DEFAULT 0.0," +
                    "  attendance REAL DEFAULT 0.0," +
                    "  email TEXT," +
                    "  phone TEXT," +
                    "  year INTEGER DEFAULT 1," +
                    "  address TEXT," +
                    "  backlogs INTEGER DEFAULT 0" +
                    ")"
                );

                // Seed default users (only if table is empty)
                ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM users");
                if (rs.next() && rs.getInt(1) == 0) {
                    seedUsers(stmt);
                }
                rs.close();

                // Seed sample students (only if table is empty)
                rs = stmt.executeQuery("SELECT COUNT(*) FROM students");
                if (rs.next() && rs.getInt(1) == 0) {
                    seedStudents(stmt);
                }
                rs.close();

                System.out.println("[DB] Database initialized successfully at: " + DB_URL);
            }
        } catch (Exception e) {
            System.err.println("[DB] Failed to initialize database: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void seedUsers(Statement stmt) throws Exception {
        stmt.execute("INSERT INTO users (username, password, role, name) VALUES ('admin', 'admin123', 'admin', 'Administrator')");
        stmt.execute("INSERT INTO users (username, password, role, name) VALUES ('faculty1', 'faculty123', 'faculty', 'Dr. Smith')");
        stmt.execute("INSERT INTO users (username, password, role, name) VALUES ('faculty2', 'faculty123', 'faculty', 'Prof. Johnson')");
        stmt.execute("INSERT INTO users (username, password, role, name) VALUES ('student1', 'student123', 'student', 'John Doe')");
        stmt.execute("INSERT INTO users (username, password, role, name) VALUES ('student2', 'student123', 'student', 'Jane Smith')");
        System.out.println("[DB] Seeded default users");
    }

    private void seedStudents(Statement stmt) throws Exception {
        String[] inserts = {
            "INSERT INTO students (name, roll_no, department, risk_status, semester, gpa, attendance, email, phone, year, address, backlogs) VALUES ('John Doe', '21CSE001', 'CSE', 'High', 5, 5.8, 58, 'john.doe@example.com', '+91 98765 43210', 3, '123 College Road, City', 3)",
            "INSERT INTO students (name, roll_no, department, risk_status, semester, gpa, attendance, email, phone, year, address, backlogs) VALUES ('Jane Smith', '21CSE002', 'CSE', 'Low', 5, 9.1, 95, 'jane.smith@example.com', '+91 98765 43211', 3, '456 University Ave, City', 0)",
            "INSERT INTO students (name, roll_no, department, risk_status, semester, gpa, attendance, email, phone, year, address, backlogs) VALUES ('Bob Johnson', '21ECE001', 'ECE', 'Medium', 5, 7.2, 75, 'bob.johnson@example.com', '+91 98765 43212', 3, '789 Campus Rd, City', 1)",
            "INSERT INTO students (name, roll_no, department, risk_status, semester, gpa, attendance, email, phone, year, address, backlogs) VALUES ('Alice Brown', '21ECE002', 'ECE', 'Low', 3, 8.5, 90, 'alice.brown@example.com', '+91 98765 43213', 2, '321 Scholar St, City', 0)",
            "INSERT INTO students (name, roll_no, department, risk_status, semester, gpa, attendance, email, phone, year, address, backlogs) VALUES ('Charlie Wilson', '21MECH001', 'MECH', 'High', 7, 4.9, 52, 'charlie.wilson@example.com', '+91 98765 43214', 4, '654 Engineer Blvd, City', 4)",
            "INSERT INTO students (name, roll_no, department, risk_status, semester, gpa, attendance, email, phone, year, address, backlogs) VALUES ('Diana Lee', '21MECH002', 'MECH', 'Medium', 5, 6.8, 72, 'diana.lee@example.com', '+91 98765 43215', 3, '987 Tech Park, City', 2)",
            "INSERT INTO students (name, roll_no, department, risk_status, semester, gpa, attendance, email, phone, year, address, backlogs) VALUES ('Eve Davis', '21CIVIL001', 'CIVIL', 'Low', 3, 8.9, 92, 'eve.davis@example.com', '+91 98765 43216', 2, '147 Structure Lane, City', 0)",
            "INSERT INTO students (name, roll_no, department, risk_status, semester, gpa, attendance, email, phone, year, address, backlogs) VALUES ('Frank Miller', '21EEE001', 'EEE', 'High', 7, 5.2, 55, 'frank.miller@example.com', '+91 98765 43217', 4, '258 Circuit Ave, City', 3)",
            "INSERT INTO students (name, roll_no, department, risk_status, semester, gpa, attendance, email, phone, year, address, backlogs) VALUES ('Grace Taylor', '21IT001', 'IT', 'Medium', 5, 7.5, 78, 'grace.taylor@example.com', '+91 98765 43218', 3, '369 Digital Rd, City', 1)",
            "INSERT INTO students (name, roll_no, department, risk_status, semester, gpa, attendance, email, phone, year, address, backlogs) VALUES ('Henry Anderson', '21CSE003', 'CSE', 'Low', 3, 8.7, 88, 'henry.anderson@example.com', '+91 98765 43219', 2, '741 Code St, City', 0)",
            "INSERT INTO students (name, roll_no, department, risk_status, semester, gpa, attendance, email, phone, year, address, backlogs) VALUES ('Ivy Thomas', '21ECE003', 'ECE', 'Medium', 7, 6.5, 70, 'ivy.thomas@example.com', '+91 98765 43220', 4, '852 Signal Rd, City', 2)",
            "INSERT INTO students (name, roll_no, department, risk_status, semester, gpa, attendance, email, phone, year, address, backlogs) VALUES ('Jack White', '21MECH003', 'MECH', 'Low', 3, 9.3, 96, 'jack.white@example.com', '+91 98765 43221', 2, '963 Gear Lane, City', 0)"
        };
        for (String sql : inserts) {
            stmt.execute(sql);
        }
        System.out.println("[DB] Seeded 12 sample students");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("[DB] Application shutting down");
    }

    public static String getDbUrl() {
        return DB_URL;
    }

    public static Connection getConnection() throws Exception {
        Class.forName("org.sqlite.JDBC");
        return DriverManager.getConnection(DB_URL);
    }
}
