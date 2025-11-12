import { describe, it, expect, test } from "bun:test";
import { postNote, putNote, deleteNote } from "..";
import type { Note } from "../shared/note";

test("sequential test", () => {
  expect(1 + 1).toBe(2);
});

describe("postNote", () => {
  it("201 and trims", () => {
    const res = postNote({ title: "  Test  ", body: "  Note " });
    expect(res.status).toBe(201);
    const note = res.json as Note;
    expect(note.title).toBe("Test");
    expect(note.body).toBe("Note");
    expect(note.id).toBeDefined();
    expect(note.createdAt).toBeDefined();
  });

  it("422 on missing fields", () => {
    const res = postNote({ title: "", body: "" });
    expect(res.status).toBe(422);
    expect((res.json as any).error).toMatch(/title and body/i);
  });
});

describe("putNote", () => {
  it("200 echoes provided fields", () => {
    const res = putNote(123, { title: "New", body: "Body" });
    expect(res.status).toBe(200);
    const n = res.json as any;
    expect(n.id).toBe(123);
    expect(n.title).toBe("New");
  });

  it("400 when neither provided", () => {
    const res = putNote(123, {});
    expect(res.status).toBe(400);
  });
});

describe("deleteNote", () => {
  it("204", () => {
    const res = deleteNote("xyz");
    expect(res.status).toBe(204);
  });
});
