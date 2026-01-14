import { useState } from "react";
import type { Task } from "../shared/task";

export function TaskCard({
  task,
  deleteTask,
  onEditClick,
  toggleComplete,
}: {
  task: Task;
  deleteTask: (id: number) => Promise<void>;
  onEditClick: (task: Task) => void;
  toggleComplete: (task: Task) => Promise<void>;
}) {
  const [isPendingDelete, setIsPendingDelete] = useState(false);

  const priorityColors = [
    "bg-blue-100 text-blue-700",
    "bg-orange-100 text-orange-700",
    "bg-red-100 text-red-700",
  ];

  if (isPendingDelete) {
    return (
      <article className="flex min-h-48 flex-col items-center justify-center rounded border border-red-200 bg-red-50 p-4 text-center">
        <p className="text-sm font-bold text-red-700">Delete this task?</p>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setIsPendingDelete(false)}
            className="rounded border bg-white px-3 py-1 text-xs"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            className="rounded bg-red-600 px-3 py-1 text-xs text-white"
          >
            Confirm
          </button>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`group relative flex min-h-48 flex-col rounded border p-4 shadow-sm transition-all ${task.completed ? "bg-slate-50 opacity-75" : "bg-white"}`}
    >
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => onEditClick(task)}
          className="rounded-full bg-white p-1.5 text-blue-600 shadow-sm ring-1 ring-black/5"
        >
          ✎
        </button>
        <button
          onClick={() => setIsPendingDelete(true)}
          className="rounded-full bg-white p-1.5 text-red-600 shadow-sm ring-1 ring-black/5"
        >
          ✕
        </button>
      </div>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleComplete(task)}
          className="mt-1.5 h-4 w-4 rounded border-gray-300"
        />
        <div>
          <h2
            className={`font-semibold ${task.completed ? "text-slate-400 line-through" : "text-slate-800"}`}
          >
            {task.title}
          </h2>
          <p className="line-clamp-3 text-sm text-slate-600">
            {task.description}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-1">
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${priorityColors[task.priority]}`}
        >
          {["Low", "Med", "High"][task.priority]}
        </span>
        {task.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500"
          >
            #{tag}
          </span>
        ))}
      </div>

      {task.dueDate && (
        <span className="pt-4 text-xs text-slate-400">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </span>
      )}
      <time className="mt-auto pt-4 text-[10px] text-slate-400">
        Created: {new Date(task.createdAt).toLocaleDateString()}
      </time>
    </article>
  );
}
