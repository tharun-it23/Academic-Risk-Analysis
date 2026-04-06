import sqlite3

db_path = r"d:\Academic Risk Analysis System\backend\data\academic_risk.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = [row[0] for row in cursor.fetchall()]

with open(r"d:\Academic Risk Analysis System\backend\data\db_report.md", "w", encoding="utf-8") as f:
    f.write("# Database Schema and Data\n\n")
    for t in tables:
        f.write(f"## Table: `{t}`\n")
        cursor.execute(f"SELECT sql FROM sqlite_master WHERE type='table' AND name='{t}';")
        row = cursor.fetchone()
        if row and row[0]:
            f.write(f"```sql\n{row[0]}\n```\n\n")
        
        cursor.execute(f"SELECT COUNT(*) FROM {t};")
        count = cursor.fetchone()[0]
        f.write(f"**Row count:** {count}\n\n")
        
        if count > 0:
            cursor.execute(f"PRAGMA table_info({t});")
            columns = [col[1] for col in cursor.fetchall()]
            
            cursor.execute(f"SELECT * FROM {t} LIMIT 5;")
            sample = cursor.fetchall()
            
            f.write("### Sample Data (Top 5 rows)\n")
            f.write("| " + " | ".join(columns) + " |\n")
            f.write("|" + "|".join(["---"] * len(columns)) + "|\n")
            for s in sample:
                f.write("| " + " | ".join([str(val).replace('\n', ' ') for val in s]) + " |\n")
            f.write("\n")

conn.close()
