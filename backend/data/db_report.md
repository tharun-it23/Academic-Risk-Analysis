# Database Schema and Data

## Table: `users`
```sql
CREATE TABLE users (  id INTEGER PRIMARY KEY AUTOINCREMENT,  username TEXT UNIQUE NOT NULL,  password TEXT NOT NULL,  role TEXT NOT NULL,  name TEXT,  email TEXT,  department TEXT)
```

**Row count:** 55

### Sample Data (Top 5 rows)
| id | username | password | role | name | email | department |
|---|---|---|---|---|---|---|
| 1 | admin | admin123 | admin | Administrator | admin@academicrisks.edu | None |
| 2 | facultyIT | faculty123 | faculty | IT Staff | it.staff@academicrisks.edu | IT |
| 3 | facultyECE | faculty123 | faculty | ECE Staff | ece.staff@academicrisks.edu | ECE |
| 4 | facultyCSE | faculty123 | faculty | CSE Staff | cse.staff@academicrisks.edu | CSE |
| 5 | facultyMECH | faculty123 | faculty | MECH Staff | mech.staff@academicrisks.edu | MECH |

## Table: `sqlite_sequence`
```sql
CREATE TABLE sqlite_sequence(name,seq)
```

**Row count:** 4

### Sample Data (Top 5 rows)
| name | seq |
|---|---|
| users | 55 |
| students | 51 |
| placement_records | 50 |
| activity_log | 16 |

## Table: `students`
```sql
CREATE TABLE students (  id INTEGER PRIMARY KEY AUTOINCREMENT,  name TEXT NOT NULL,  roll_no TEXT UNIQUE NOT NULL,  department TEXT,  risk_status TEXT DEFAULT 'Low',  risk_score REAL DEFAULT 0.0,  semester INTEGER DEFAULT 1,  year INTEGER DEFAULT 1,  cgpa REAL DEFAULT 0.0,  attendance REAL DEFAULT 0.0,  email TEXT,  phone TEXT,  address TEXT,  arrear_count INTEGER DEFAULT 0,  placement_eligibility_status TEXT DEFAULT 'Eligible')
```

**Row count:** 51

### Sample Data (Top 5 rows)
| id | name | roll_no | department | risk_status | risk_score | semester | year | cgpa | attendance | email | phone | address | arrear_count | placement_eligibility_status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Uma Johnson | 21ECE001 | ECE | Low | 11.651236157175976 | 7 | 4 | 7.86 | 86.19 | uma.21ece001@student.academicrisks.edu | +91 9310954351 | 775 University Rd, City | 0 | Eligible |
| 2 | Aaron Johnson | 21MECH002 | MECH | Medium | 31.50786284482478 | 3 | 2 | 5.89 | 92.98 | aaron.21mech002@student.academicrisks.edu | +91 9929830825 | 128 University Rd, City | 3 | At Risk |
| 3 | Mike Lopez | 21IT003 | IT | Medium | 29.9459036492562 | 6 | 3 | 6.35 | 76.07 | mike.21it003@student.academicrisks.edu | +91 9251250728 | 525 University Rd, City | 2 | At Risk |
| 4 | Kevin Rodriguez | 21CSE004 | CSE | Medium | 20.66546433469268 | 8 | 4 | 6.71 | 69.54 | kevin.21cse004@student.academicrisks.edu | +91 9104186087 | 802 University Rd, City | 0 | At Risk |
| 5 | Hannah Martin | 21MECH005 | MECH | High | 54.31511416190028 | 6 | 3 | 3.94 | 72.96 | hannah.21mech005@student.academicrisks.edu | +91 9957520188 | 990 University Rd, City | 5 | At Risk |

## Table: `semester_records`
```sql
CREATE TABLE semester_records (  id INTEGER PRIMARY KEY AUTOINCREMENT,  student_id INTEGER NOT NULL,  semester_no INTEGER NOT NULL,  gpa REAL DEFAULT 0.0,  cgpa_so_far REAL DEFAULT 0.0,  credits_earned INTEGER DEFAULT 0,  FOREIGN KEY(student_id) REFERENCES students(id))
```

**Row count:** 0

## Table: `internal_marks`
```sql
CREATE TABLE internal_marks (  id INTEGER PRIMARY KEY AUTOINCREMENT,  student_id INTEGER NOT NULL,  semester_no INTEGER NOT NULL,  subject_code TEXT NOT NULL,  subject_name TEXT,  ia1 REAL DEFAULT 0.0,  ia2 REAL DEFAULT 0.0,  ia3 REAL DEFAULT 0.0,  assignment REAL DEFAULT 0.0,  total REAL DEFAULT 0.0,  FOREIGN KEY(student_id) REFERENCES students(id))
```

**Row count:** 0

## Table: `attendance_records`
```sql
CREATE TABLE attendance_records (  id INTEGER PRIMARY KEY AUTOINCREMENT,  student_id INTEGER NOT NULL,  semester_no INTEGER NOT NULL,  subject_code TEXT NOT NULL,  month TEXT,  classes_held INTEGER DEFAULT 0,  classes_attended INTEGER DEFAULT 0,  attendance_pct REAL DEFAULT 0.0,  detention_flag INTEGER DEFAULT 0,  FOREIGN KEY(student_id) REFERENCES students(id))
```

**Row count:** 0

## Table: `arrears`
```sql
CREATE TABLE arrears (  id INTEGER PRIMARY KEY AUTOINCREMENT,  student_id INTEGER NOT NULL,  subject_code TEXT NOT NULL,  subject_name TEXT,  semester_no INTEGER NOT NULL,  exam_attempt INTEGER DEFAULT 1,  status TEXT DEFAULT 'Pending',  cleared_semester INTEGER,  FOREIGN KEY(student_id) REFERENCES students(id))
```

**Row count:** 0

## Table: `placement_records`
```sql
CREATE TABLE placement_records (  id INTEGER PRIMARY KEY AUTOINCREMENT,  student_id INTEGER NOT NULL,  cgpa REAL DEFAULT 0.0,  arrear_count INTEGER DEFAULT 0,  attendance_pct REAL DEFAULT 0.0,  eligibility_status TEXT DEFAULT 'Eligible',  drives_applied INTEGER DEFAULT 0,  drives_selected INTEGER DEFAULT 0,  FOREIGN KEY(student_id) REFERENCES students(id))
```

**Row count:** 50

### Sample Data (Top 5 rows)
| id | student_id | cgpa | arrear_count | attendance_pct | eligibility_status | drives_applied | drives_selected |
|---|---|---|---|---|---|---|---|
| 1 | 1 | 7.8551881766333285 | 0 | 86.18535074869125 | Eligible | 0 | 0 |
| 2 | 2 | 5.88534543707709 | 3 | 92.97809375135135 | At Risk | 0 | 0 |
| 3 | 3 | 6.352493363596598 | 2 | 76.06789859385236 | At Risk | 0 | 0 |
| 4 | 4 | 6.706058041597721 | 0 | 69.54444173238431 | At Risk | 0 | 0 |
| 5 | 5 | 3.942331848145793 | 5 | 72.95574789863147 | At Risk | 0 | 0 |

## Table: `risk_scores`
```sql
CREATE TABLE risk_scores (  id INTEGER PRIMARY KEY AUTOINCREMENT,  student_id INTEGER NOT NULL,  semester_no INTEGER NOT NULL,  composite_score REAL DEFAULT 0.0,  gpa_score REAL DEFAULT 0.0,  attendance_score REAL DEFAULT 0.0,  arrear_score REAL DEFAULT 0.0,  placement_score REAL DEFAULT 0.0,  calculated_date TEXT DEFAULT (datetime('now')),  risk_level TEXT,  FOREIGN KEY(student_id) REFERENCES students(id))
```

**Row count:** 0

## Table: `counseling_logs`
```sql
CREATE TABLE counseling_logs (  id INTEGER PRIMARY KEY AUTOINCREMENT,  student_id INTEGER NOT NULL,  faculty_id INTEGER NOT NULL,  session_date TEXT DEFAULT (datetime('now')),  issue_discussed TEXT,  action_taken TEXT,  follow_up_date TEXT,  status TEXT DEFAULT 'Open',  FOREIGN KEY(student_id) REFERENCES students(id),  FOREIGN KEY(faculty_id) REFERENCES users(id))
```

**Row count:** 0

## Table: `alerts`
```sql
CREATE TABLE alerts (  id INTEGER PRIMARY KEY AUTOINCREMENT,  student_id INTEGER NOT NULL,  alert_type TEXT NOT NULL,  trigger_reason TEXT,  date_raised TEXT DEFAULT (datetime('now')),  resolved_status INTEGER DEFAULT 0,  FOREIGN KEY(student_id) REFERENCES students(id))
```

**Row count:** 0

## Table: `activity_log`
```sql
CREATE TABLE activity_log (  id INTEGER PRIMARY KEY AUTOINCREMENT,  type TEXT NOT NULL,  description TEXT NOT NULL,  user_name TEXT NOT NULL,  created_at TEXT DEFAULT (datetime('now')))
```

**Row count:** 16

### Sample Data (Top 5 rows)
| id | type | description | user_name | created_at |
|---|---|---|---|---|
| 1 | login | IT Staff (faculty) logged in | IT Staff | 2026-04-20 05:24:00 |
| 2 | login | IT Staff (faculty) logged in | IT Staff | 2026-04-20 05:25:41 |
| 3 | update | Added new student: SURYA (232IT265) | facultyIT | 2026-04-20 05:26:46 |
| 4 | login | IT Staff (faculty) logged in | IT Staff | 2026-04-20 12:25:22 |
| 5 | login | Uma Johnson (student) logged in | Uma Johnson | 2026-04-20 12:46:48 |

## Table: `notifications`
```sql
CREATE TABLE notifications (  id INTEGER PRIMARY KEY AUTOINCREMENT,  message TEXT NOT NULL,  target_group TEXT NOT NULL,  sender_name TEXT,  created_at TEXT DEFAULT (datetime('now')))
```

**Row count:** 0

