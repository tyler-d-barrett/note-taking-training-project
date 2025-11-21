import type { Note, NewNote, EditNote } from "../shared/note";
import type { NotesRepo } from "./repo";

export type HttpResult<T = unknown> = { status: number; json?: T };

export function dbHandlers(repo: NotesRepo) {
  function postNote(data: unknown): HttpResult<Note | { error: string }> {
    const d = data as Partial<NewNote>;
    if (!d?.title || !d?.body) {
      return { status: 422, json: { error: "title and body are required" } };
    }

    const note = repo.create({ title: d.title, body: d.body });
    return { status: 201, json: note };
  }

  function putNote(
    id: number,
    data: unknown,
  ): HttpResult<Note | { error: string }> {
    const d = data as Partial<EditNote>;
    if (!d?.title || !d?.body) {
      return { status: 422, json: { error: "title and body are required" } };
    }

    const note = repo.update({ id, title: d.title, body: d.body });

    if (note) return { status: 200, json: note };
    else return { status: 404, json: { error: "note does not exist" } };
  }

  function deleteNote(id: number): HttpResult<boolean | { error: string }> {
    const result = repo.delete(id);

    if (result) return { status: 204, json: true };
    else return { status: 404, json: { error: "id does not exist" } };
  }

  function getNotes(
    limit: number,
    offset: number,
  ): HttpResult<{ notes: Note[]; hasMore: boolean }> {
    const result: { notes: Note[]; hasMore: boolean } = repo.list({
      limit: limit,
      offset: offset,
    });
    return {
      status: 200,
      json: { notes: result.notes, hasMore: result.hasMore },
    };
  }

  return { postNote, putNote, deleteNote, getNotes };
}
