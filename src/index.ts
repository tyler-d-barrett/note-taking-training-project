import { serve } from "bun";
import index from "./index.html";
import { makeNote } from "./shared/note";
import type { EditNote, NewNote, Note } from "./shared/note";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    // "/api/hello": {
    //   async GET(req) {
    //     return Response.json({
    //       message: "Hello, world!",
    //       method: "GET",
    //     });
    //   },
    //   async PUT(req) {
    //     return Response.json({
    //       message: "Hello, world!",
    //       method: "PUT",
    //     });
    //   },
    // },

    "/api/notes": {
      async POST(req: Bun.BunRequest) {
        const data: NewNote = await req.json();
        if (!data?.title || !data?.body) {
          return Response.json(
            { error: "title and body are required" },
            { status: 422 },
          );
        }

        const note: Note = makeNote({ title: data.title, body: data.body });
        return Response.json(note, { status: 201 });
      },
    },

    "/api/notes/:id": {
      async PUT(req) {
        const id = req.params.id;
        const data: EditNote = await req.json();

        if (!data.title && !data.body) {
          return Response.json(
            { error: "title and body are required" },
            { status: 400 },
          );
        }

        const note: Note = {
          id: id,
          title: data.title,
          body: data.body,
          createdAt: new Date().toISOString(),
        };
        return Response.json(note, { status: 200 });
      },

      async DELETE(req) {
        const id = req.params.id;

        return new Response(null, { status: 204 });
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
