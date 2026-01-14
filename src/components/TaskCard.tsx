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

  // Adjusted priority colors for dark mode compatibility
  const priorityColors = [
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  ];

  if (isPendingDelete) {
    return (
      <article className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-4 text-center transition-colors dark:border-red-900/50 dark:bg-red-900/20">
        <p className="text-sm font-bold text-red-700 dark:text-red-400">
          Delete this task?
        </p>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setIsPendingDelete(false)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            className="rounded-lg bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`group relative flex min-h-48 flex-col rounded-xl border p-4 shadow-sm transition-all duration-300 ${
        task.completed
          ? "border-gray-200 bg-gray-50/50 opacity-70 dark:border-gray-800 dark:bg-gray-900/30"
          : "bg-card-bg border-gray-200 hover:shadow-md dark:border-gray-800"
      }`}
    >
      {/* Action Buttons - Adjusted for dark mode background */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => onEditClick(task)}
          className="rounded-full bg-white p-1.5 text-blue-600 shadow-sm ring-1 ring-black/5 transition-transform hover:scale-110 dark:bg-gray-800 dark:text-blue-400 dark:ring-white/10"
        >
          ✎
        </button>
        <button
          onClick={() => setIsPendingDelete(true)}
          className="rounded-full bg-white p-1.5 text-red-600 shadow-sm ring-1 ring-black/5 transition-transform hover:scale-110 dark:bg-gray-800 dark:text-red-400 dark:ring-white/10"
        >
          ✕
        </button>
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleComplete(task)}
          className="mt-1.5 h-4 w-4 rounded border-gray-300 bg-white text-blue-600 dark:border-gray-700 dark:bg-gray-800"
        />
        <div className="min-w-0 flex-1">
          <h2
            className={`truncate font-semibold ${
              task.completed
                ? "text-gray-400 line-through dark:text-gray-600"
                : "text-gray-900 dark:text-gray-100"
            }`}
          >
            {task.title}
          </h2>
          <p
            className={`line-clamp-3 text-sm ${
              task.completed
                ? "text-gray-400 dark:text-gray-600"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {task.description}
          </p>
        </div>
      </div>

      {/* Metadata / Tags */}
      <div className="mt-4 flex flex-wrap gap-1">
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${priorityColors[task.priority]}`}
        >
          {["Low", "Med", "High"][task.priority]}
        </span>
        {task.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-transparent bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-1 pt-4">
        {task.dueDate && (
          <span
            className={`text-[10px] font-medium ${
              !task.completed && task.dueDate < Date.now()
                ? "text-red-500"
                : "text-gray-400 dark:text-gray-500"
            }`}
          >
            📅 Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
        <time className="text-[10px] text-gray-400 italic dark:text-gray-500">
          Created: {new Date(task.createdAt).toLocaleDateString()}
        </time>
      </div>
    </article>
  );
}
