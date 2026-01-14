import { useState, useEffect } from "react";
import type { EditTask, Task, NewTask } from "@/shared/task";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hasMoreTasks, setHasMoreTasks] = useState<boolean>(true);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const headers = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  useEffect(() => {
    let mounted = true;

    const fetchInitialData = async () => {
      if (!localStorage.getItem("token")) return;
      setIsInitialLoading(true);
      try {
        const res = await fetch(`/api/tasks?limit=10&offset=0`, {
          headers: headers(),
        });
        if (!res.ok) throw new Error("Auth failed or server error");

        const data: { tasks: Task[]; hasMore: boolean } = await res.json();

        if (mounted) {
          setTasks(data.tasks);
          setHasMoreTasks(data.hasMore);
        }
      } catch (error) {
        console.error("Initial fetch failed:", error);
      } finally {
        if (mounted) setIsInitialLoading(false);
      }
    };

    fetchInitialData();

    return () => {
      mounted = false;
    };
  }, []);

  const fetchMoreTasks = async () => {
    setIsLoadingMore(true);
    try {
      const currentCount = tasks.length;
      const res = await fetch(`/api/tasks?limit=10&offset=${currentCount}`, {
        headers: headers(),
      });

      if (!res.ok) throw new Error(await res.text());

      const data: { tasks: Task[]; hasMore: boolean } = await res.json();

      setTasks((prev) => [...prev, ...data.tasks]);
      setHasMoreTasks(data.hasMore);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  async function createTask(input: NewTask) {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(input),
    });

    if (!res.ok) throw new Error(await res.text());

    const task: Task = await res.json();
    setTasks((prev) => [task, ...prev]);
  }

  async function deleteTask(id: number) {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
      headers: headers(),
    });

    if (!res.ok) throw new Error("Delete failed");

    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  async function editTask(id: number, payload: EditTask) {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(await res.text());

    const task: Task = await res.json();
    setTasks((ts) => ts.map((t) => (t.id === id ? task : t)));
  }

  return {
    tasks,
    hasMoreTasks,
    isInitialLoading,
    isLoadingMore,
    fetchMoreTasks,
    createTask,
    deleteTask,
    editTask,
  };
}
