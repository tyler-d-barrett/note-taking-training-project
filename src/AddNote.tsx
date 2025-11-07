import type { NewNote, Note } from "./shared/note";
import { useState } from "react";

export function AddNote() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<Note | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setCreated(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      title: String(fd.get("title") ?? "").trim(),
      body: String(fd.get("body") ?? "").trim(),
    } satisfies NewNote;

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Request failed: ${res.status}`);
      }

      const note: Note = await res.json();
      setCreated(note);
      form.reset();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="max-w-sm mx-auto" onSubmit={onSubmit}>
      <div className="mb-5">
        <label
          htmlFor="title"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left"
        >
          Title
        </label>
        <input
          id="title"
          name="title"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="My Day"
          required
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="body"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left"
        >
          Notes
        </label>
        <textarea
          id="body"
          name="body"
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Start your note..."
        ></textarea>
      </div>
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        {submitting ? "Creating…" : "Create"}
      </button>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {created && (
        <pre className="mt-3 rounded bg-gray-100 p-3 text-xs dark:bg-gray-800 dark:text-gray-100 overflow-x-auto">
          {JSON.stringify(created, null, 2)}
        </pre>
      )}
    </form>
  );
}
