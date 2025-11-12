import type { Database } from "bun:sqlite";
import type { Note } from "@/shared/note";

export type NotesRepo = {
  create(input: { title: string; body: string }): Note;
  list(limit?: number, offset?: number): Note[];
  delete(id: number): boolean;
};

export function makeNotesRepo(conn: Database): NotesRepo {
  const insert = conn.query(`
    INSERT INTO note (title, body, created_at)
    VALUES ($title, $body, $now)
  `);

  const listQuery = conn.query(`
    SELECT id, title, body, created_at
    FROM note
    ORDER BY created_at DESC
    
  `);
  //LIMIT $limit OFFSET $offset

  const deleteQuery = conn.query(`
    DELETE FROM note
    WHERE id = $id;
    `);

  const lastId = conn.query(`SELECT last_insert_rowid() AS id`);

  const row = (r: any): Note => ({
    id: Number(r.id),
    title: String(r.title),
    body: String(r.body),
    createdAt: Number(r.created_at),
  });

  return {
    create({ title, body }) {
      const now = Date.now();
      insert.run({ title: title, body: body, now: now });

      const id = Number((lastId.get() as any).id);
      return { id, title, body, createdAt: now };
    },

    list(limit = 50, offset = 0) {
      const rows = listQuery.all({ $limit: limit, $offset: offset }) as Note[];
      return rows.map(row);
    },

    delete(id) {
      const count = deleteQuery.run(id) as { changes?: number };
      return (count?.changes ?? 0) > 0;
    },
  };
}
