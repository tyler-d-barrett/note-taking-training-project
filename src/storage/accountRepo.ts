import type { Database } from "bun:sqlite";

export type AccountRecord = {
  id: number;
  email: string;
  password_hash: string;
};

export type AccountRepo = {
  create(email: string, passwordHash: string): number;
  findByEmail(email: string): AccountRecord | undefined;
};

export function makeAccountRepo(conn: Database): AccountRepo {
  const insertQuery = conn.query(`
    INSERT INTO account (email, password_hash)
    VALUES ($email, $passwordHash)
  `);

  const findQuery = conn.query(`
    SELECT id, email, password_hash
    FROM account
    WHERE email = $email
  `);

  const lastId = conn.query(`SELECT last_insert_rowid() AS id`);

  return {
    create(email, passwordHash) {
      insertQuery.run({ email, passwordHash });
      return Number((lastId.get() as any).id);
    },
    findByEmail(email) {
      return findQuery.get({ email }) as AccountRecord | undefined;
    },
  };
}
