import type { Database } from "bun:sqlite";
import type { Note } from "@/shared/note";

export type NotesRepo = {
  create(input: { title: string; body: string }): Note;
  list(input: { limit: number; offset: number }): Note[];
  update(input: { id: number; title: string; body: string }): Note | undefined;
  delete(id: number): boolean;
};

export function makeNotesRepo(conn: Database): NotesRepo {
  const insertQuery = conn.query(`
    INSERT INTO note (title, body, created_at)
    VALUES ($title, $body, $now)
  `);

  const getByIdQuery = conn.query(`
    SELECT id, title, body, created_at
    FROM note
    WHERE id = $id;
    `);

  const listQuery = conn.query(`
    SELECT id, title, body, created_at
    FROM note
    ORDER BY created_at DESC
    LIMIT $limit OFFSET $offset
  `);

  const updateQuery = conn.query(`
    UPDATE note
    SET title = $title
    , body = $body
    WHERE id = $id;
    `);

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
      insertQuery.run({ title: title, body: body, now: now });

      const id = Number((lastId.get() as any).id);
      return { id, title, body, createdAt: now };
    },

    list({ limit, offset }) {
      const rows = listQuery.all({ limit: limit, offset: offset }) as Note[];
      return rows.map(row);
    },

    update({ id, title, body }) {
      updateQuery.run({ id: id, title: title, body: body });
      const result = getByIdQuery.get(id);

      return result ? row(result) : undefined;
    },

    delete(id) {
      const count = deleteQuery.run(id) as { changes?: number };
      return (count?.changes ?? 0) > 0;
    },
  };
}
