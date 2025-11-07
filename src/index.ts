import { serve } from "bun";
import index from "./index.html";
import { makeNote } from "./shared/note";
import type { NewNote } from "./shared/note";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async (req) => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },

    "/api/notes": {
      async POST(req) {
        const data = (await req.json()) as NewNote;
        if (!data?.title || !data?.body) {
          return Response.json(
            { error: "title and body are required" },
            { status: 422 }
          );
        }

        const note = makeNote({ title: data.title, body: data.body });
        return Response.json(note, { status: 201 });
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
