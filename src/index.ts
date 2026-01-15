import { serve } from "bun";
import index from "./index.html";
import { db } from "./storage/db";
import { seedDatabase } from "./storage/seed";
import { makeAccountRepo } from "./storage/accountRepo";
import { authHandlers } from "./storage/accountHandlers";
import { getAuthenticatedId } from "./shared/utils";
import { makeTaskRepo } from "./storage/taskRepo";
import { makeTaskHandlers } from "./storage/taskHandlers";

const taskRepo = makeTaskRepo(db);
const accountRepo = makeAccountRepo(db);

const authApi = authHandlers(accountRepo);
const taskApi = makeTaskHandlers(taskRepo);

export const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/register": {
      async POST(req) {
        const data = await req.json().catch(() => ({}));
        const res = await authApi.register(data);
        return Response.json(res.json ?? null, { status: res.status });
      },
    },

    "/api/login": {
      async POST(req) {
        const data = await req.json().catch(() => ({}));
        const res = await authApi.login(data);
        return Response.json(res.json ?? null, { status: res.status });
      },
    },

    "/api/tasks": {
      async GET(req) {
        const accountId = getAuthenticatedId(req);

        if (accountId === null)
          return Response.json({ error: "Unauthorized" }, { status: 401 });

        const url = new URL(req.url);
        const limit = Number(url.searchParams.get("limit")) || 10;
        const offset = Number(url.searchParams.get("offset")) || 0;
        const res = taskApi.getTasks(accountId, limit, offset);
        return Response.json(res.json, { status: res.status });
      },

      async POST(req) {
        const accountId = getAuthenticatedId(req);
        if (accountId === null)
          return Response.json({ error: "Unauthorized" }, { status: 401 });

        const data = await req.json().catch(() => ({}));
        const res = taskApi.postTask(accountId, data);
        return Response.json(res.json, { status: res.status });
      },
    },

    "/api/tasks/:id": {
      async PUT(req) {
        const accountId = getAuthenticatedId(req);
        const id = Number(req.params.id);
        if (accountId === null)
          return Response.json({ error: "Unauthorized" }, { status: 401 });

        const data = await req.json().catch(() => ({}));
        const res = taskApi.putTask(accountId, id, data);
        return Response.json(res.json, { status: res.status });
      },

      async DELETE(req) {
        const accountId = getAuthenticatedId(req);
        const id = Number(req.params.id);
        if (accountId === null)
          return Response.json({ error: "Unauthorized" }, { status: 401 });

        const res = taskApi.deleteTask(accountId, id);
        return Response.json(res.json, { status: res.status });
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
