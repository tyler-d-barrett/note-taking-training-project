import { useState, useEffect, useRef } from "react";
import { AddNote } from "./AddNote";
import { APITester } from "./APITester";
import "./index.css";
import { NoteCard } from "./NoteCard";

import logo from "./logo.svg";
import type { NewNote, Note } from "./shared/note";

export function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
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
  // useEffect(() => {
  //   console.log("notes changed:", notes);
  // }, [notes]);

  return (
    <div>
      <nav className="border-gray-200 bg-white dark:bg-gray-900">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between p-4">
          <a
            href="#"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img src={logo} className="h-8" alt="Flowbite Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              HelloNoto
            </span>
          </a>
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 focus:outline-none md:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-5 w-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0 rtl:space-x-reverse dark:border-gray-700 dark:bg-gray-800 md:dark:bg-gray-900">
              <li>
                <a
                  href="#"
                  className="block rounded-sm bg-blue-700 px-3 py-2 text-white md:bg-transparent md:p-0 md:text-blue-700 dark:text-white md:dark:text-blue-500"
                  aria-current="page"
                >
                  Home
                </a>
              </li>
            </ul>
          </div>
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
              onClick={() => setIsDialogOpen(true)}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              New Note
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-6">
        <div className="flex">
          <button
            onClick={() => setIsDialogOpen(true)}
            className="m-auto h-full w-full justify-center rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            + New Note
          </button>
        </div>
        {notes.map((n: Note) => (
          <NoteCard key={n.id} note={n} />
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="fixed inset-0 m-auto w-full max-w-md rounded-lg shadow-xl backdrop:opacity-50"
      >
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Create Note</h2>
            <button
              onClick={() => setIsDialogOpen(false)}
              className="rounded px-2 py-1 text-sm text-slate-600 hover:bg-slate-100"
            >
              ✕
            </button>
          </div>

          <AddNote
            onCreate={async (n) => {
              await createNote(n);
              setIsDialogOpen(false);
            }}
          />
        </div>
      </dialog>
    </div>
  );
}

export default App;
