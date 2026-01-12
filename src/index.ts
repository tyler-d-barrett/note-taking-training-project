import { serve } from "bun";
import index from "./index.html";
import { db } from "./storage/db";
import { makeNotesRepo } from "./storage/notesRepo";
import { dbHandlers } from "./storage/notesDbHandler";
import { seedDatabase } from "./storage/seed";

const notesRepo = makeNotesRepo(db);
const { postNote, putNote, deleteNote, getNotes } = dbHandlers(notesRepo);

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
        const url = new URL(req.url);

        const limit = Number(url.searchParams.get("limit")) || 10;
        const offset = Number(url.searchParams.get("offset")) || 0;

        const res = getNotes(limit, offset);
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

const accountCount = db
  .query("SELECT COUNT(*) as count FROM account")
  .get() as {
  count: number;
};

if (accountCount.count === 0) {
  console.log("No accounts found. Running seed data...");
  seedDatabase();
}
console.log(`🚀 Server running at ${server.url}`);
