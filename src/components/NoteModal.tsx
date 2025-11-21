import React from "react";
import type { Note, EditNote, NewNote } from "../shared/note";
import { NoteForm } from "./NoteForm";

interface NoteModalProps {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  selectedNote: Note | null;
  setIsDialogOpen: (isOpen: boolean) => void;
  setSelectedNote: (note: Note | null) => void;
  createNote: (input: NewNote) => Promise<void>;
  editNote: (id: number, payload: EditNote) => Promise<void>;
}

export function NoteModal({
  dialogRef,
  selectedNote,
  setIsDialogOpen,
  setSelectedNote,
  createNote,
  editNote,
}: NoteModalProps) {
  const handleSubmit = async ({
    title,
    body,
  }: {
    title: string;
    body: string;
  }) => {
    if (selectedNote) {
      await editNote(selectedNote.id, { title, body });
    } else {
      await createNote({ title, body });
    }

    setSelectedNote(null);
    setIsDialogOpen(false);
  };

  return (
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
          onSubmit={handleSubmit}
        />
      </div>
    </dialog>
  );
}
