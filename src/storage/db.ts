import { Database } from "bun:sqlite";

export const db = new Database("./src/storage/tasks.sqlite", {
  create: true,
  strict: true,
});

export function ensureSchema(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS account (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS task (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      account_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      completed BOOLEAN NOT NULL DEFAULT 0,
      due_date INTEGER, 
      priority INTEGER DEFAULT 0,
      tags TEXT, 
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (account_id) REFERENCES account (id) ON DELETE CASCADE
    );
  `);
}

db.run(`PRAGMA journal_mode = WAL;`);
db.run("PRAGMA foreign_keys = ON;");

ensureSchema(db);
