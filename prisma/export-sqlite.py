#!/usr/bin/env python3
"""Export all tables from the local SQLite db to a JSON seed file
for migrating Randap data from SQLite to Postgres (Neon on Vercel)."""
import json
import sqlite3
import datetime

SRC = "db/custom.db"
OUT = "prisma/seed-data.json"

# Insertion-safe order: parents (referenced) first.
TABLES = [
    "User",
    "Subject",
    "Video",
    "Lesson",
    "Quiz",
    "Question",
    "ChatProfile",
    "Like",
    "Comment",
    "Subscription",
    "QuizAttempt",
    "Conversation",
    "Message",
    "RandomQueue",
    "TypingState",
    "AuthAccount",
]

con = sqlite3.connect(SRC)
con.row_factory = sqlite3.Row
data = {}
for t in TABLES:
    rows = [dict(r) for r in con.execute(f"SELECT * FROM {t}")]
    for row in rows:
        for k, v in row.items():
            if isinstance(v, (datetime.date, datetime.datetime)):
                row[k] = v.isoformat()
    data[t] = rows
    print(f"{t}: {len(rows)} rows")
con.close()

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False)
print(f"Saved -> {OUT}")
