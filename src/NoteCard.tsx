import type { Note, EditNote } from "./shared/note";

export function NoteCard({
  note,
  deleteNote,
  onEditClick,
}: {
  note: Note;
  deleteNote: (i: number) => Promise<void> | void;
  onEditClick: (note: Note) => void;
}) {
  return (
    <article className="group relative flex min-h-48 max-w-sm flex-col rounded border bg-white p-4 shadow-sm">
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <button
          onClick={() => onEditClick(note)}
          className="scale-95 rounded-full bg-white/95 p-1.5 text-blue-600 opacity-0 shadow ring-1 ring-black/10 contrast-125 saturate-125 transition duration-300 group-hover:scale-100 group-hover:opacity-100"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        </button>
        <button
          onClick={() => deleteNote(note.id)}
          className="scale-95 rounded-full bg-white/95 p-1.5 text-red-600 opacity-0 shadow ring-1 ring-black/10 contrast-125 saturate-125 transition duration-300 group-hover:scale-100 group-hover:opacity-100"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
          </svg>
        </button>
      </div>
      <div className="transition duration-150 group-hover:blur-[1.5px] group-hover:brightness-75">
        <h2 className="text-lg font-semibold text-slate-500">{note.title}</h2>
        <p className="mt-1 mb-1 text-sm wrap-break-word text-slate-700">
          {note.body}
        </p>
        <time className="mt-auto text-xs text-slate-500">
          Created: {new Date(note.createdAt).toLocaleString()}
        </time>
      </div>
    </article>
  );
}
