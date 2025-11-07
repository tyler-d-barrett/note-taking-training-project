import { useState, useEffect, useRef } from "react";
import { AddNote } from "./AddNote";
import { APITester } from "./APITester";
import "./index.css";

import logo from "./logo.svg";
import type { NewNote, Note } from "./shared/note";

export function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const dlgRef = useRef<HTMLDialogElement>(null);

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

  const openDialog = () => dlgRef.current?.showModal();
  const closeDialog = () => dlgRef.current?.close();
  // useEffect(() => {
  //   console.log("notes changed:", notes);
  // }, [notes]);

  return (
    <div>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
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
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
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
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                  aria-current="page"
                >
                  Home
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8 text-center relative z-10">
        {/* <div className="flex justify-center items-center gap-8 mb-8">
        <img
          src={logo}
          alt="Bun Logo"
          className="h-24 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#646cffaa] scale-120"
        />
        <img
          src={reactLogo}
          alt="React Logo"
          className="h-24 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#61dafbaa] animate-[spin_20s_linear_infinite]"
        />
      </div> */}
        {/* {notes.length == 0 && <AddNote onCreate={createNote} />} */}
      </div>
      <div className="max-w-7xl mx-auto p-8 relative z-10">
        <div className="flex justify-end">
          <button
            onClick={openDialog}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            New Note
          </button>
        </div>

        {/* your existing list / empty state */}
        {notes.length === 0 && (
          <p className="mt-6 text-center text-slate-600">No notes yet.</p>
        )}
      </div>

      {/* Modal */}
      <dialog
        ref={dlgRef}
        className="rounded-lg p-0 w-full max-w-md shadow-xl backdrop:opacity-50"
      >
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Create Note</h2>
            <button
              onClick={closeDialog}
              className="rounded px-2 py-1 text-sm text-slate-600 hover:bg-slate-100"
            >
              ✕
            </button>
          </div>

          <AddNote
            onCreate={async (n) => {
              await createNote(n); // make note server-side (echo) + add to state
              closeDialog(); // then close the modal
            }}
          />
        </div>

        {/* optional: click outside / ESC already supported by <dialog> */}
        <form method="dialog" className="hidden">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

export default App;
