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

  // Common styles for all form inputs
  const inputClasses = `
    block w-full rounded-lg p-2.5 text-sm transition-colors outline-none
    bg-gray-100 dark:bg-gray-800 
    text-gray-900 dark:text-gray-100 
    placeholder-gray-500 dark:placeholder-gray-400
    border border-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500
    [color-scheme:light] dark:[color-scheme:dark]
  `;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className={inputClasses}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title..."
        autoFocus
        required
      />
      <textarea
        className={`${inputClasses} h-24 resize-none`}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Details..."
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
          className={`${inputClasses} flex-1 cursor-pointer`}
        >
          <option value={0}>Low Priority</option>
          <option value={1}>Medium</option>
          <option value={2}>High</option>
        </select>

        <input
          className={`${inputClasses} flex-1`}
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma separated)"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="px-1 text-[10px] font-bold tracking-wider text-gray-500 uppercase">
          Due Date
        </label>
        <input
          type="date"
          className={inputClasses}
          value={dateStr}
          onChange={(e) => setDateStr(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="mt-2 w-full rounded-lg bg-blue-600 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 active:scale-[0.98]"
      >
        {submitLabel}
      </button>
    </form>
  );
}
