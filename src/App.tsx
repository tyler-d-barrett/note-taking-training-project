import { useState, useEffect, useRef } from "react";
import "./index.css";
import { NoteCard } from "./NoteCard";
import logo from "./logo.svg";
import type { EditNote, NewNote, Note } from "./shared/note";
import { NoteForm } from "./NoteForm";

export function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [hasMoreNotes, setHasMoreNotes] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const fetchMoreNotes = async () => {
    try {
      const currentCount = notes.length;

      const res = await fetch(`/api/notes?limit=10&offset=${currentCount}`);
      if (!res.ok) throw new Error(await res.text());

      const data: { notes: Note[]; hasMore: boolean } = await res.json();

      setNotes((prev) => [...prev, ...data.notes]);
      setHasMoreNotes(data.hasMore);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  useEffect(() => {
    let mounted = false;

    const fetchInitialData = async () => {
      const res = await fetch(`/api/notes?limit=10&offset=0`);
      const data = await res.json();

      if (!mounted) {
        setNotes(data.notes);
        setHasMoreNotes(data.hasMore);
      }
    };

    fetchInitialData();

    return () => {
      mounted = true;
    };
  }, []);

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

  async function deleteNote(id: number) {
    const res = await fetch(`/api/notes/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Delete failed");

    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  async function editNote(id: number, payload: EditNote) {
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
        <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
          <div>
            <button
              onClick={() => openCreate()}
              className="m-auto flex w-full items-center justify-center rounded bg-green-600 px-4 py-3 text-lg font-bold text-white shadow-md transition-all duration-150 ease-in-out hover:bg-green-700 hover:shadow-lg active:scale-95 sm:w-auto md:w-56"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="mr-2 h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              New Note
            </button>
          </div>
          <div>
            <button
              onClick={() => fetchMoreNotes()}
              disabled={!hasMoreNotes}
              className="m-auto flex w-full items-center justify-center rounded bg-blue-600 px-4 py-3 text-lg font-bold text-white shadow-md transition-all duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto md:w-56"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="mr-2 h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
              Load More
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-5">
        {notes.map((n: Note) => (
          <NoteCard
            key={n.id}
            note={n}
            deleteNote={deleteNote}
            onEditClick={(note) => openEdit(note)}
          />
        ))}
      </div>

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
