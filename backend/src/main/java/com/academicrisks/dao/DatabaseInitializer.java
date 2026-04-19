package com.academicrisks.dao;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import java.io.File;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

@WebListener
public class DatabaseInitializer implements ServletContextListener {

    private static final String DEFAULT_DB_DIR = System.getProperty("user.dir") + File.separator + "data";
    private static final String DB_URL_PREFIX = "jdbc:sqlite:";
    
    private static String resolveDbUrl() {
        String envPath = System.getenv("DATABASE_PATH");
        if (envPath != null && !envPath.isEmpty()) {
            return DB_URL_PREFIX + envPath;
        }
        return DB_URL_PREFIX + DEFAULT_DB_DIR + File.separator + "academic_risk.db";
    }

    private static final String DB_URL = resolveDbUrl();

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        try {
            // Ensure data directory exists
            File dbFile = new File(DB_URL.substring(DB_URL_PREFIX.length()));
            File dir = dbFile.getParentFile();
            if (dir != null && !dir.exists()) {
                dir.mkdirs();
            }

            Class.forName("org.sqlite.JDBC");

            try (Connection conn = DriverManager.getConnection(DB_URL);
                 Statement stmt = conn.createStatement()) {

                // Enable WAL mode for better concurrent access
                stmt.execute("PRAGMA journal_mode=WAL");

                // Create users table
                stmt.execute(
                    "CREATE TABLE IF NOT EXISTS users (" +
                    "  id INTEGER PRIMARY KEY AUTOINCREMENT," +
                    "  username TEXT UNIQUE NOT NULL," +
                    "  password TEXT NOT NULL," +
                    "  role TEXT NOT NULL," +
                    "  name TEXT," +
                    "  email TEXT" +
                    ")"
                );

                // Migrate: add email column if it doesn't exist yet
                try {
                    stmt.execute("ALTER TABLE users ADD COLUMN email TEXT");
                    System.out.println("[DB] Migrated: added email column to users");
                } catch (Exception ignored) {
                    // Column already exists — safe to ignore
                }

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

                // Create activity_log table
                stmt.execute(
                    "CREATE TABLE IF NOT EXISTS activity_log (" +
                    "  id INTEGER PRIMARY KEY AUTOINCREMENT," +
                    "  type TEXT NOT NULL," +
                    "  description TEXT NOT NULL," +
                    "  user_name TEXT NOT NULL," +
                    "  created_at TEXT DEFAULT (datetime('now'))" +
                    ")"
                );
 
                // Create notifications table
                stmt.execute(
                    "CREATE TABLE IF NOT EXISTS notifications (" +
                    "  id INTEGER PRIMARY KEY AUTOINCREMENT," +
                    "  message TEXT NOT NULL," +
                    "  target_group TEXT NOT NULL," + // ALL_STUDENTS, HIGH_RISK_STUDENTS, ALL_FACULTY
                    "  sender_name TEXT," +
                    "  created_at TEXT DEFAULT (datetime('now'))" +
                    ")"
                );

                // Seed default users (only if table is empty)
                ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM users");
                if (rs.next() && rs.getInt(1) == 0) {
                    seedUsers(stmt);
                }
                rs.close();

                // Always ensure emails are set (handles pre-existing DB without emails)
                ensureUserEmails(stmt);

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
        stmt.execute("INSERT INTO users (username, password, role, name, email) VALUES ('admin', 'admin123', 'admin', 'Administrator', 'admin@academicrisks.edu')");
        stmt.execute("INSERT INTO users (username, password, role, name, email) VALUES ('faculty1', 'faculty123', 'faculty', 'Dr. Smith', 'dr.smith@academicrisks.edu')");
        stmt.execute("INSERT INTO users (username, password, role, name, email) VALUES ('faculty2', 'faculty123', 'faculty', 'Prof. Johnson', 'prof.johnson@academicrisks.edu')");
        // Student accounts — username = roll number
        stmt.execute("INSERT INTO users (username, password, role, name, email) VALUES ('21CSE001', 'student123', 'student', 'John Doe', 'john.doe@student.academicrisks.edu')");
        stmt.execute("INSERT INTO users (username, password, role, name, email) VALUES ('21CSE002', 'student123', 'student', 'Jane Smith', 'jane.smith@student.academicrisks.edu')");
        stmt.execute("INSERT INTO users (username, password, role, name, email) VALUES ('21ECE001', 'student123', 'student', 'Bob Johnson', 'bob.johnson@student.academicrisks.edu')");
        stmt.execute("INSERT INTO users (username, password, role, name, email) VALUES ('21ECE002', 'student123', 'student', 'Alice Brown', 'alice.brown@student.academicrisks.edu')");
        stmt.execute("INSERT INTO users (username, password, role, name, email) VALUES ('21MECH001', 'student123', 'student', 'Charlie Wilson', 'charlie.wilson@student.academicrisks.edu')");
        stmt.execute("INSERT INTO users (username, password, role, name, email) VALUES ('21MECH002', 'student123', 'student', 'Diana Lee', 'diana.lee@student.academicrisks.edu')");
        stmt.execute("INSERT INTO users (username, password, role, name, email) VALUES ('21CIVIL001', 'student123', 'student', 'Eve Davis', 'eve.davis@student.academicrisks.edu')");
        stmt.execute("INSERT INTO users (username, password, role, name, email) VALUES ('21EEE001', 'student123', 'student', 'Frank Miller', 'frank.miller@student.academicrisks.edu')");
        stmt.execute("INSERT INTO users (username, password, role, name, email) VALUES ('21IT001', 'student123', 'student', 'Grace Taylor', 'grace.taylor@student.academicrisks.edu')");
        stmt.execute("INSERT INTO users (username, password, role, name, email) VALUES ('21CSE003', 'student123', 'student', 'Henry Anderson', 'henry.anderson@student.academicrisks.edu')");
        stmt.execute("INSERT INTO users (username, password, role, name, email) VALUES ('21ECE003', 'student123', 'student', 'Ivy Thomas', 'ivy.thomas@student.academicrisks.edu')");
        stmt.execute("INSERT INTO users (username, password, role, name, email) VALUES ('21MECH003', 'student123', 'student', 'Jack White', 'jack.white@student.academicrisks.edu')");
        System.out.println("[DB] Seeded default users with emails");
    }

    private void ensureUserEmails(Statement stmt) throws Exception {
        Object[][] emailMap = {
            {"admin",      "admin@academicrisks.edu"},
            {"faculty1",   "dr.smith@academicrisks.edu"},
            {"faculty2",   "prof.johnson@academicrisks.edu"},
            {"21CSE001",   "john.doe@student.academicrisks.edu"},
            {"21CSE002",   "jane.smith@student.academicrisks.edu"},
            {"21CSE003",   "henry.anderson@student.academicrisks.edu"},
            {"21ECE001",   "bob.johnson@student.academicrisks.edu"},
            {"21ECE002",   "alice.brown@student.academicrisks.edu"},
            {"21ECE003",   "ivy.thomas@student.academicrisks.edu"},
            {"21MECH001",  "charlie.wilson@student.academicrisks.edu"},
            {"21MECH002",  "diana.lee@student.academicrisks.edu"},
            {"21MECH003",  "jack.white@student.academicrisks.edu"},
            {"21CIVIL001", "eve.davis@student.academicrisks.edu"},
            {"21EEE001",   "frank.miller@student.academicrisks.edu"},
            {"21IT001",    "grace.taylor@student.academicrisks.edu"},
        };
        for (Object[] entry : emailMap) {
            stmt.execute("UPDATE users SET email = '" + entry[1] + "' WHERE username = '" + entry[0] + "' AND (email IS NULL OR email = '' OR email NOT LIKE '%@%')");
        }
        System.out.println("[DB] User emails ensured");
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
