import { Database } from "bun:sqlite";
import { beforeEach, describe, expect, test } from "bun:test";
import { ensureSchema } from "@/storage/db";
import { makeTaskRepo } from "@/storage/taskRepo";
import { makeTaskHandlers } from "@/storage/taskHandlers";
import { makeAccountRepo } from "@/storage/accountRepo";
import { authHandlers } from "@/storage/accountHandlers";
import type { NewTask, Task } from "@/shared/task";

export function makeTestContext() {
  const db = new Database(":memory:", { strict: true });
  ensureSchema(db);

  const tasksRepo = makeTaskRepo(db);
  const authRepo = makeAccountRepo(db);

  const tasks = makeTaskHandlers(tasksRepo);
  const auth = authHandlers(authRepo);

  return { db, tasks, auth };
}

let ctx: ReturnType<typeof makeTestContext>;

beforeEach(() => {
  ctx = makeTestContext();
});

describe("Auth Logic & Isolation", () => {
  test("password should be hashed and verify correctly", async () => {
    await ctx.auth.register({
      email: "test@task.com",
      password: "SecurePassword123",
    });

    const user = ctx.db
      .prepare("SELECT password_hash FROM account WHERE email = ?")
      .get("test@task.com") as { password_hash: string };
    expect(user.password_hash).not.toBe("SecurePassword123");

    const res = await ctx.auth.login({
      email: "test@task.com",
      password: "SecurePassword123",
    });
    expect(res.status).toBe(200);
  });

  test("User A cannot see or modify User B tasks", async () => {
    const resA = await ctx.auth.register({
      email: "a@t.com",
      password: "password",
    });
    const resB = await ctx.auth.register({
      email: "b@t.com",
      password: "password",
    });

    const userAId = (resA.json as any).id;
    const userBId = (resB.json as any).id;

    const taskARes = ctx.tasks.postTask(userAId, { title: "A's Task" });
    const taskA = taskARes.json as Task;

    const listB = ctx.tasks.getTasks(userBId, 10, 0);
    const bTasks = (listB.json as any).tasks as Task[];

    expect(bTasks.find((t) => t.id === taskA.id)).toBeUndefined();

    const delRes = ctx.tasks.deleteTask(userBId, taskA.id);
    expect(delRes.status).toBe(404);
  });
});

describe("Task CRUD", () => {
  let userId: number;

  beforeEach(async () => {
    const res = await ctx.auth.register({
      email: "dev@task.com",
      password: "password123",
    });
    userId = (res.json as any).id;
  });

  test("returns 422 when title is missing", () => {
    const res = ctx.tasks.postTask(userId, { description: "no title" });
    expect(res.status).toBe(422);
  });

  test("creates and deletes a task", () => {
    const postRes = ctx.tasks.postTask(userId, { title: "Delete Me" });
    const task = postRes.json as Task;
    expect(postRes.status).toBe(201);

    const delRes = ctx.tasks.deleteTask(userId, task.id);
    expect(delRes.status).toBe(204);

    const list = ctx.tasks.getTasks(userId, 10, 0);
    expect((list.json as any).tasks.length).toBe(0);
  });
});
