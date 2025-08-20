import sqlite3

# Connect to your SQLite DB
conn = sqlite3.connect("users.db")
cursor = conn.cursor()

# Show all users
cursor.execute("SELECT id, username, password FROM users")
rows = cursor.fetchall()

print("\n=== USERS IN DATABASE ===")
for row in rows:
    print(row)

conn.close()
