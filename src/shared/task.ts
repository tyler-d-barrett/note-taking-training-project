export interface TaskRow {
  id: number;
  account_id: number;
  title: string;
  description: string | null;
  completed: number;
  due_date: number | null;
  priority: number;
  tags: string | null;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  accountId: number;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: number;
  priority: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type NewTask = {
  title: string;
  description?: string;
  priority?: number;
  tags?: string;
  dueDate?: number;
};

export type EditTask = Partial<NewTask> & {
  id: number;
  completed?: boolean;
};
