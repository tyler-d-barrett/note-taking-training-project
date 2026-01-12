// src/api/taskHandlers.ts
import type { TaskRepo } from "../storage/taskRepo";
import type { Task, NewTask, EditTask } from "../shared/task";
import type { HttpResult } from "@/shared/httpResult";

export function makeTaskHandlers(repo: TaskRepo) {
  return {
    getTasks(
      accountId: number,
      limit: number,
      offset: number,
    ): HttpResult<{ tasks: Task[]; hasMore: boolean }> {
      const result = repo.list(accountId, { limit, offset });
      return { status: 200, json: result };
    },

    postTask(
      accountId: number,
      data: unknown,
    ): HttpResult<Task | { error: string }> {
      const d = data as Partial<NewTask>;
      if (!d?.title) {
        return { status: 422, json: { error: "title is required" } };
      }

      const task = repo.create(accountId, {
        title: d.title,
        description: d.description,
        priority: d.priority,
        tags: d.tags,
        dueDate: d.dueDate,
      });
      return { status: 201, json: task };
    },

    putTask(
      accountId: number,
      id: number,
      data: unknown,
    ): HttpResult<Task | { error: string }> {
      const d = data as EditTask;
      const task = repo.update(accountId, { ...d, id });

      if (task) return { status: 200, json: task };
      return { status: 404, json: { error: "task not found or unauthorized" } };
    },

    deleteTask(
      accountId: number,
      id: number,
    ): HttpResult<{ success: boolean } | { error: string }> {
      const deleted = repo.delete(accountId, id);
      if (deleted) return { status: 204, json: { success: true } };
      return { status: 404, json: { error: "task not found or unauthorized" } };
    },
  };
}
