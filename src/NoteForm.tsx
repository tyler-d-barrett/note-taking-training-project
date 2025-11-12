import { useEffect, useState } from "react";

export function NoteForm({
  initialTitle = "",
  initialBody = "",
  submitLabel,
  onSubmit,
}: {
  initialTitle?: string;
  initialBody?: string;
  submitLabel: string;
  onSubmit: (p: { title: string; body: string }) => Promise<void> | void;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ title, body });

    setTitle("");
    setBody("");
  }

  return (
    <form
      onSubmit={(e) => {
        handleSubmit(e);
      }}
      className="space-y-3"
    >
      <input
        className="block w-full rounded-lg bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:outline-none"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My Day"
        autoFocus
        required
      />
      <textarea
        className="block h-28 w-full rounded-lg bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:outline-none"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Start typing…"
        required
      />
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:outline-none"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
