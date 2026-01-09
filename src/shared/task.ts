export interface Task {
  id: number;
  account_id: number;
  title: string;
  description?: string;
  completed: boolean;
  due_date?: number;
  priority: number;
  tags?: string;
  created_at: string;
  updated_at: string;
}
