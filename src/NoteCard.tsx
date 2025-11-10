import type { Note } from "./shared/note";

export function NoteCard({ note }: { note: Note }) {
  return (
    <article className="flex min-h-48 max-w-sm flex-col rounded border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-500">{note.title}</h2>
      <p className="mt-1 mb-1 text-sm wrap-break-word text-slate-700">
        {note.body}
      </p>
      <time className="mt-auto text-xs text-slate-500">
        Created: {new Date(note.createdAt).toLocaleString()}
      </time>
    </article>
  );
}
