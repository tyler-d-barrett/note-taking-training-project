import { Database } from "bun:sqlite";
import { makeNotesRepo } from "@/storage/repo";
import { dbHandlers } from "@/storage/dbHandlers";
import { beforeEach, describe, expect, test } from "bun:test";
import type { NewNote, Note } from "@/shared/note";
import { ensureSchema } from "@/storage/db";

export function makeTestContext() {
  const db = new Database(":memory:", { strict: true });
  ensureSchema(db);
  const repo = makeNotesRepo(db);
  const handlers = dbHandlers(repo);

  return { db, repo, ...handlers };
}

let ctx: ReturnType<typeof makeTestContext>;

beforeEach(() => {
  ctx = makeTestContext();
});

describe("postNote", () => {
  test("returns 422 when title/body missing", () => {
    const bad: Partial<NewNote> = { title: "", body: "" };
    const res = ctx.postNote(bad);
    expect(res.status).toBe(422);
    expect(res.json).toEqual({ error: "title and body are required" });
  });

  test("creates a note and returns 201", () => {
    const res = ctx.postNote({ title: "Hello", body: "World" });
    expect(res.status).toBe(201);

    const note = res.json as Note;
    expect(note.id).toBeGreaterThan(0);
    expect(note.title).toBe("Hello");
    expect(note.body).toBe("World");

    const list = ctx.getNotes(10, 0);
    expect(list.status).toBe(200);
    expect(list.json!.notes.length).toBe(1);
  });
});

describe("putNote", () => {
  test("422 on missing fields", () => {
    const created = ctx.postNote({ title: "t", body: "b" }).json as Note;
    const res = ctx.putNote(created.id, { title: "", body: "" });
    expect(res.status).toBe(422);
  });

  test("404 when note does not exist", () => {
    const res = ctx.putNote(9999, { title: "x", body: "y" });
    expect(res.status).toBe(404);
  });

  test("updates note and returns 200", () => {
    const created = ctx.postNote({ title: "old", body: "body" }).json as Note;
    const res = ctx.putNote(created.id, { title: "new", body: "body2" });
    expect(res.status).toBe(200);

    const updated = res.json as Note;
    expect(updated.title).toBe("new");
    expect(updated.body).toBe("body2");
  });
});

describe("deleteNote", () => {
  test("404 when id does not exist", () => {
    const res = ctx.deleteNote(12345);
    expect(res.status).toBe(404);
  });

  test("204 when delete succeeds", () => {
    const created = ctx.postNote({ title: "bye", body: "body" }).json as Note;
    const res = ctx.deleteNote(created.id);
    expect(res.status).toBe(204);

    const list = ctx.getNotes(10, 0);
    expect(list.json!.notes.length).toBe(0);
  });
});

describe("getNotes", () => {
  test("returns empty array initially", () => {
    const res = ctx.getNotes(10, 0);
    expect(res.status).toBe(200);
    expect(res.json?.notes).toEqual([]);
  });

  test("respects inserted notes", () => {
    ctx.postNote({ title: "a", body: "1" });
    ctx.postNote({ title: "b", body: "2" });

    const res = ctx.getNotes(10, 0);
    expect(res.status).toBe(200);
    expect(res.json!.notes.length).toBe(2);
  });
});
