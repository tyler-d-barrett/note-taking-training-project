import { useState, useEffect, useRef } from "react";
import "./index.css";
import { NoteCard } from "./components/NoteCard";
import logo from "./logo.svg";
import type { Note } from "./shared/note";
import { NoteControls } from "./components/NoteControls";
import { useNotes } from "./hooks/useNotes";
import { NoteModal } from "./components/NoteModal";
import { AuthForm } from "./components/AuthForm.tsx";

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

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Logic to handle successful login
  const handleAuthSuccess = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

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

  // If not authenticated, show the login/register screen
  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <AuthForm
          mode={authMode}
          setMode={setAuthMode}
          onSuccess={handleAuthSuccess}
        />
      </div>
    );
  }

  return (
    <div>
      <div>
        <nav className="flex bg-gray-900">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <img src={logo} className="h-8" alt="Logo" />
              <span className="text-2xl font-semibold text-white">
                HelloNoto
              </span>
            </div>
            <button
              onClick={logout}
              className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </nav>
        {/* Rest of your existing Notes UI */}
      </div>

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
