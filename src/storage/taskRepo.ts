// src/storage/taskRepo.ts
import type { Database } from "bun:sqlite";
import type { Task, TaskRow, NewTask, EditTask } from "../shared/task";

export type TaskRepo = {
  create(accountId: number, input: NewTask): Task;
  list(
    accountId: number,
    input: { limit: number; offset: number },
  ): {
    tasks: Task[];
    hasMore: boolean;
  };
  update(accountId: number, input: EditTask): Task | undefined;
  delete(accountId: number, id: number): boolean;
};

export function makeTaskRepo(conn: Database): TaskRepo {
  const insertQuery = conn.query(`
    INSERT INTO task (account_id, title, description, priority, tags, due_date)
    VALUES ($accountId, $title, $description, $priority, $tags, $dueDate)
    RETURNING *;
  `);

  const listQuery = conn.query(`
    SELECT * FROM task 
    WHERE account_id = $accountId
    ORDER BY created_at DESC 
    LIMIT $limit OFFSET $offset
  `);

  const updateQuery = conn.query(`
    UPDATE task 
    SET title = $title,
        description = $description,
        completed = $completed,
        priority = $priority,
        tags = $tags,
        due_date = $dueDate,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $id AND account_id = $accountId
    RETURNING *;
`);

  const deleteQuery = conn.query(`
    DELETE FROM task 
    WHERE id = $id AND account_id = $accountId
  `);

  // --- Mapper Logic ---
  const mapRow = (r: TaskRow): Task => ({
    id: r.id,
    accountId: r.account_id,
    title: r.title,
    description: r.description ?? undefined,
    completed: Boolean(r.completed),
    dueDate: r.due_date ?? undefined,
    priority: r.priority,
    tags: r.tags ? r.tags.split(",") : [],
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  });

  return {
    create(accountId, task) {
      const result = insertQuery.get({
        accountId: accountId,
        title: task.title,
        description: task.description ?? null,
        priority: task.priority ?? 0,
        tags: task.tags ?? "",
        dueDate: task.dueDate ?? null,
      }) as TaskRow;

      return mapRow(result);
    },

    list(accountId, { limit, offset }) {
      const queryLimit = limit + 1;
      const rows = listQuery.all({
        accountId: accountId,
        limit: queryLimit,
        offset: offset,
      }) as TaskRow[];

      const hasMore = rows.length === queryLimit;
      const tasks = rows.slice(0, limit).map(mapRow);

      return { tasks, hasMore };
    },

    update(accountId, input) {
      const result = updateQuery.get({
        id: input.id,
        accountId: accountId,
        title: input.title,
        description: input.description ?? null,
        completed: input.completed ? 1 : 0,
        priority: input.priority,
        tags: input.tags,
        dueDate: input.dueDate ?? null,
      }) as TaskRow | null;

      return result ? mapRow(result) : undefined;
    },

    delete(accountId, id) {
      const result = deleteQuery.run({ id: id, accountId: accountId });
      return result.changes > 0;
    },
  };
}
