import type { NewNote, Note } from "./shared/note";
import { useState } from "react";

export function AddNote({
  onCreate,
}: {
  onCreate: (n: NewNote) => Promise<void> | void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload: NewNote = {
      title: String(fd.get("title") ?? "").trim(),
      body: String(fd.get("body") ?? "").trim(),
    };

    try {
      setSubmitting(true);
      await onCreate(payload);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="max-w-sm" onSubmit={onSubmit}>
      <div className="mb-5">
        <label
          htmlFor="title"
          className="mb-2 block text-left text-sm font-medium text-gray-900"
        >
          Title
        </label>
        <input
          id="title"
          name="title"
          className="block w-full rounded-lg bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:outline-none"
          placeholder="My Day"
          required
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="body"
          className="mb-2 block text-left text-sm font-medium text-gray-900"
        >
          Notes
        </label>
        <textarea
          id="body"
          name="body"
          className="block w-full rounded-lg bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:outline-none"
          placeholder="Start your note..."
        ></textarea>
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:outline-none"
        >
          {submitting ? "Creating…" : "Create"}
        </button>
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </form>
  );
}
