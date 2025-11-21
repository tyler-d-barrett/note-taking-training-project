export interface NewNote {
  title: string;
  body: string;
}

export interface Note extends NewNote {
  id: number;
  createdAt: number;
}

export interface EditNote {
  title: string;
  body: string;
}
