import type { Note } from "../shared/note";

const KEY = "notes";

export function saveNotes(notes: Note[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(notes));
  } catch {}
}
