import { useState, useEffect, useRef } from "react";
import "./index.css";
import { NoteCard } from "./NoteCard";
import logo from "./logo.svg";
import type { EditNote, NewNote, Note } from "./shared/note";
import { loadNotes, saveNotes } from "./storage/notes";
import { NoteForm } from "./NoteForm";

export function App() {
  const [notes, setNotes] = useState<Note[]>(() => loadNotes());
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  async function createNote(input: NewNote) {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!res.ok) throw new Error(await res.text());

    const note: Note = await res.json();
    setNotes((prev) => [note, ...prev]);
  }

  async function deleteNote(id: String) {
    const res = await fetch(`/api/notes/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Delete failed");

    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  async function editNote(id: string, payload: EditNote) {
    const res = await fetch(`/api/notes/${id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(await res.text());

    const note: Note = await res.json();
    setNotes((ns) => ns.map((n) => (n.id === id ? note : n)));
  }

  function openCreate() {
    setSelectedNote(null);
    setIsDialogOpen(true);
  }

  function openEdit(note: Note) {
    setSelectedNote(note);
    setIsDialogOpen(true);
  }

  useEffect(() => {
    const dialog = dialogRef.current!;
    if (!dialog) return;

    if (isDialogOpen && !dialog.open) dialog.showModal();

    if (!isDialogOpen && dialog.open) dialog.close();
  }, [isDialogOpen]);

  useEffect(() => {
    const dlg = dialogRef.current!;
    if (!dlg) return;
    const onClose = () => setIsDialogOpen(false);
    dlg.addEventListener("close", onClose);
    dlg.addEventListener("cancel", onClose);
    return () => {
      dlg.removeEventListener("close", onClose);
      dlg.removeEventListener("cancel", onClose);
    };
  }, []);

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  return (
    <div>
      <nav className="flex bg-gray-900">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between p-4">
          <a href="#" className="flex items-center space-x-3">
            <img src={logo} className="h-8" alt="HelloNoto Logo" />
            <span className="self-center text-2xl font-semibold text-white">
              HelloNoto
            </span>
          </a>
        </div>
      </nav>

      {!isDialogOpen && notes.length === 0 && (
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-5 p-8">
          {
            <p className="mt-6 text-center text-white">
              No notes yet. Let's get started!
            </p>
          }

          <div>
            <button
              onClick={() => openCreate()}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              New Note
            </button>
          </div>
        </div>
      )}

      {notes.length > 0 && (
        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-6">
          <div className="flex">
            <button
              onClick={() => openCreate()}
              className="m-auto h-full w-full justify-center rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              + New Note
            </button>
          </div>
          {notes.map((n: Note) => (
            <NoteCard
              key={n.id}
              note={n}
              deleteNote={deleteNote}
              onEditClick={(note) => openEdit(note)}
            />
          ))}
        </div>
      )}

      <dialog
        ref={dialogRef}
        className="fixed inset-0 m-auto w-full max-w-md rounded-lg shadow-xl backdrop:opacity-50 backdrop:backdrop-blur-3xl"
      >
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {selectedNote ? "Edit Note" : "Create Note"}
            </h2>
            <button
              onClick={() => setIsDialogOpen(false)}
              className="rounded px-2 py-1 text-sm text-slate-600 hover:bg-slate-100"
            >
              ✕
            </button>
          </div>

          <NoteForm
            key={selectedNote?.id ?? ""}
            initialTitle={selectedNote?.title ?? ""}
            initialBody={selectedNote?.body ?? ""}
            submitLabel={selectedNote ? "Save changes" : "Create"}
            onSubmit={async ({ title, body }) => {
              if (selectedNote) {
                await editNote(selectedNote.id, { title, body });
              } else {
                await createNote({ title, body });
              }
              setSelectedNote(null);
              setIsDialogOpen(false);
            }}
          />
        </div>
      </dialog>
    </div>
  );
}

export default App;
