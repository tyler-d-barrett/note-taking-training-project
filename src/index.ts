import { serve } from "bun";
import index from "./index.html";
import { db } from "./storage/db";
import { makeNotesRepo } from "./storage/repo";
import type { EditNote, NewNote, Note } from "./shared/note";

const notesRepo = makeNotesRepo(db);

export const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/notes": {
      async POST(req: Bun.BunRequest) {
        const data = await req.json().catch(() => ({}));
        const res = postNote(data);
        return Response.json(res.json ?? null, { status: res.status });
      },

      async GET(req) {
        const res = getNotes();
        return Response.json(res.json ?? null, { status: res.status });
      },
    },

    "/api/notes/:id": {
      async PUT(req) {
        const id = Number(req.params.id);
        if (!Number.isSafeInteger(id)) {
          return Response.json({ status: 400, json: { error: "invalid id" } });
        }

        const data = await req.json();
        const res = putNote(id, data);
        return Response.json(res.json ?? null, { status: res.status });
      },

      async DELETE(req) {
        const id = Number(req.params.id);
        if (!Number.isSafeInteger(id)) {
          return Response.json({ status: 400, json: { error: "invalid id" } });
        }
        const res = deleteNote(id);
        return Response.json(res.json ?? null, { status: res.status });
      },
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
console.log(process.cwd());

export type HttpResult<T = unknown> = { status: number; json?: T };

export function postNote(data: unknown): HttpResult<Note | { error: string }> {
  const d = data as Partial<NewNote>;
  if (!d?.title || !d?.body) {
    return { status: 422, json: { error: "title and body are required" } };
  }

  const note = notesRepo.create({ title: d.title, body: d.body });
  return { status: 201, json: note };
}

export function putNote(
  id: number,
  data: unknown,
): HttpResult<Note | { error: string }> {
  const d = data as Partial<NewNote>;
  if (!d?.title || !d?.body) {
    return { status: 422, json: { error: "title and body are required" } };
  }

  const note = notesRepo.update({ id: id, title: d.title, body: d.body });

  if (note) return { status: 200, json: note };
  else return { status: 404, json: { error: "note does not exist" } };
}

export function deleteNote(
  id: number,
): HttpResult<boolean | { error: string }> {
  const result = notesRepo.delete(id);

  if (result) return { status: 204, json: true };
  else return { status: 404, json: { error: "id does not exist" } };
}

export function getNotes(): HttpResult<Note[]> {
  const notes: Note[] = notesRepo.list({ limit: 5, offset: 0 });

  return { status: 200, json: notes };
}
