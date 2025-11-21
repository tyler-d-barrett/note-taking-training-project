import { useState, useEffect, useRef } from "react";
import "./index.css";
import { NoteCard } from "./components/NoteCard";
import logo from "./logo.svg";
import type { Note } from "./shared/note";
import { NoteControls } from "./components/NoteControls";
import { useNotes } from "./hooks/useNotes";
import { NoteModal } from "./components/NoteModal";

export function App() {
  const {
    notes,
    hasMoreNotes,
    isInitialLoading,
    isLoadingMore,
    fetchMoreNotes,
    createNote,
    deleteNote,
    editNote,
  } = useNotes();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

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

      <NoteControls
        notesLength={notes.length}
        hasMoreNotes={hasMoreNotes}
        isInitialLoading={isInitialLoading}
        isLoadingMore={isLoadingMore}
        openCreate={openCreate}
        fetchMoreNotes={fetchMoreNotes}
      />

      <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-5">
        {notes.map((n: Note) => (
          <NoteCard
            key={n.id}
            note={n}
            deleteNote={deleteNote}
            onEditClick={openEdit}
          />
        ))}
      </div>

      <NoteModal
        dialogRef={dialogRef}
        selectedNote={selectedNote}
        setIsDialogOpen={setIsDialogOpen}
        setSelectedNote={setSelectedNote}
        createNote={createNote}
        editNote={editNote}
      />
    </div>
  );
}

export default App;
