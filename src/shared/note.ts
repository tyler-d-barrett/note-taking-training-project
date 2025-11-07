export interface NewNote {
  title: string;
  body: string;
}

export interface Note extends NewNote {
  id: string;
  createdAt: string;
}

export function makeNote(input: NewNote): Note {
  return {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    body: input.body.trim(),
    createdAt: new Date().toISOString(),
  };
}
