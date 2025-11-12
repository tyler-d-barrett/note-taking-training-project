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
        const id = req.params.id;
        const res = deleteNote(id);
        return new Response(null, { status: res.status });
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
  const d = data as Partial<EditNote>;
  if (!d?.title && !d?.body) {
    return { status: 400, json: { error: "title and body are required" } };
  }
  const note: Note = {
    id,
    title: d.title ?? "",
    body: d.body ?? "",
    createdAt: Date.now(),
  };
  return { status: 200, json: note };
}

export function deleteNote(id: string): HttpResult<void> {
  return { status: 204 };
}

export function getNotes(): HttpResult<Note[]> {
  const notes: Note[] = notesRepo.list(50, 0);

  return { status: 200, json: notes };
}
