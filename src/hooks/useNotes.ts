import { useState, useEffect } from "react";
import type { EditNote, Note, NewNote } from "@/shared/note";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [hasMoreNotes, setHasMoreNotes] = useState<boolean>(true);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  useEffect(() => {
    let mounted = false;

    const fetchInitialData = async () => {
      setIsInitialLoading(true);
      try {
        const res = await fetch(`/api/notes?limit=10&offset=0`);
        const data: { notes: Note[]; hasMore: boolean } = await res.json();

        if (!mounted) {
          setNotes(data.notes);
          setHasMoreNotes(data.hasMore);
        }
      } catch (error) {
        console.error("Initial fetch failed:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchInitialData();

    return () => {
      mounted = true;
    };
  }, []);

  const fetchMoreNotes = async () => {
    setIsLoadingMore(true);
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
      setIsLoadingMore(false);
    }
  };

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

  return {
    notes,
    hasMoreNotes,
    isInitialLoading,
    isLoadingMore,
    fetchMoreNotes,
    createNote,
    deleteNote,
    editNote,
  };
}
