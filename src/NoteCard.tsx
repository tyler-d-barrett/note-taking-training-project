import type { Note } from "./shared/note";

export function NoteCard({ note }: { note: Note }) {
  return (
    <article className="max-w-sm rounded border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">{note.title}</h2>
      <p className="mt-1 text-sm whitespace-pre-wrap text-slate-700">
        {note.body}
      </p>
      <time className="mt-2 block text-xs text-slate-500">
        {new Date(note.createdAt).toLocaleString()}
      </time>
    </article>
  );
}
