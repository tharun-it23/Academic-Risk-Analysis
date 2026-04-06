# Database Schema and Data

## Table: `users`
```sql
CREATE TABLE users (  id INTEGER PRIMARY KEY AUTOINCREMENT,  username TEXT UNIQUE NOT NULL,  password TEXT NOT NULL,  role TEXT NOT NULL,  name TEXT)
```

**Row count:** 15

### Sample Data (Top 5 rows)
| id | username | password | role | name |
|---|---|---|---|---|
| 1 | admin | admin123 | admin | Administrator |
| 2 | faculty1 | faculty123 | faculty | Dr. Smith |
| 3 | faculty2 | faculty123 | faculty | Prof. Johnson |
| 4 | 21CSE001 | student123 | student | John Doe |
| 5 | 21CSE002 | student123 | student | Jane Smith |

## Table: `sqlite_sequence`
```sql
CREATE TABLE sqlite_sequence(name,seq)
```

**Row count:** 3

### Sample Data (Top 5 rows)
| name | seq |
|---|---|
| users | 15 |
| students | 12 |
| activity_log | 26 |

## Table: `students`
```sql
CREATE TABLE students (  id INTEGER PRIMARY KEY AUTOINCREMENT,  name TEXT NOT NULL,  roll_no TEXT UNIQUE NOT NULL,  department TEXT,  risk_status TEXT DEFAULT 'Low',  semester INTEGER DEFAULT 1,  gpa REAL DEFAULT 0.0,  attendance REAL DEFAULT 0.0,  email TEXT,  phone TEXT,  year INTEGER DEFAULT 1,  address TEXT,  backlogs INTEGER DEFAULT 0)
```

**Row count:** 12

### Sample Data (Top 5 rows)
| id | name | roll_no | department | risk_status | semester | gpa | attendance | email | phone | year | address | backlogs |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | John Doe | 21CSE001 | CSE | High | 5 | 5.8 | 58.0 | john.doe@example.com | +91 98765 43210 | 3 | 123 College Road, City | 3 |
| 2 | Jane Smith | 21CSE002 | CSE | Low | 5 | 9.1 | 95.0 | jane.smith@example.com | +91 98765 43211 | 3 | 456 University Ave, City | 0 |
| 3 | Bob Johnson | 21ECE001 | ECE | Medium | 5 | 7.2 | 75.0 | bob.johnson@example.com | +91 98765 43212 | 3 | 789 Campus Rd, City | 1 |
| 4 | Alice Brown | 21ECE002 | ECE | Low | 3 | 8.5 | 90.0 | alice.brown@example.com | +91 98765 43213 | 2 | 321 Scholar St, City | 0 |
| 5 | Charlie Wilson | 21MECH001 | MECH | High | 7 | 4.9 | 52.0 | charlie.wilson@example.com | +91 98765 43214 | 4 | 654 Engineer Blvd, City | 4 |

## Table: `activity_log`
```sql
CREATE TABLE activity_log (  id INTEGER PRIMARY KEY AUTOINCREMENT,  type TEXT NOT NULL,  description TEXT NOT NULL,  user_name TEXT NOT NULL,  created_at TEXT DEFAULT (datetime('now')))
```

**Row count:** 26

### Sample Data (Top 5 rows)
| id | type | description | user_name | created_at |
|---|---|---|---|---|
| 1 | login | Dr. Smith (faculty) logged in | Dr. Smith | 2026-03-09 16:35:03 |
| 2 | login | Dr. Smith (faculty) logged in | Dr. Smith | 2026-03-09 16:35:05 |
| 3 | login | John Doe (student) logged in | John Doe | 2026-03-09 16:35:54 |
| 4 | login | Bob Johnson (student) logged in | Bob Johnson | 2026-03-09 16:36:46 |
| 5 | login | Administrator (admin) logged in | Administrator | 2026-03-09 16:38:04 |

