import { useState } from "react";
import type { NewTask } from "../shared/task";

export function TaskForm({
  initialData,
  submitLabel,
  onSubmit,
}: {
  initialData?: Partial<NewTask>;
  submitLabel: string;
  onSubmit: (p: NewTask) => Promise<void> | void;
}) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [priority, setPriority] = useState(initialData?.priority ?? 0);
  const [tags, setTags] = useState(initialData?.tags ?? "");
  const [dateStr, setDateStr] = useState(
    initialData?.dueDate
      ? new Date(initialData.dueDate).toISOString().split("T")[0]
      : "",
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const dueDate = dateStr ? new Date(dateStr).getTime() : undefined;

    onSubmit({ title, description, priority, tags, dueDate });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        className="block w-full rounded-lg bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title..."
        autoFocus
        required
      />
      <textarea
        className="block h-24 w-full rounded-lg bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Details..."
      />

      <div className="flex gap-2">
        <select
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
          className="flex-1 rounded-lg bg-gray-700 p-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={0}>Low Priority</option>
          <option value={1}>Medium</option>
          <option value={2}>High</option>
        </select>
        <input
          className="flex-1 rounded-lg bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma separated)"
        />
      </div>

      <input
        type="date"
        className="flex-1 rounded-lg bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
        value={dateStr}
        onChange={(e) => setDateStr(e.target.value)}
      />
      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        {submitLabel}
      </button>
    </form>
  );
}
