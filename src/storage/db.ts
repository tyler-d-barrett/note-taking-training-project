import { Database } from "bun:sqlite";

export const db = new Database("./src/storage/notes.sqlite", {
  create: true,
  strict: true,
});

export function ensureSchema(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS note (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      body  TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);
}

db.run(`
  PRAGMA journal_mode = WAL;
`);

ensureSchema(db);
