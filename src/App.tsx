import { useState, useEffect, useRef } from "react";
import "./index.css";
import logo from "./logo.svg";
import type { Task, EditTask } from "./shared/task";
import { AuthForm } from "./components/AuthForm.tsx";

// New Task Components
import { TaskCard } from "./components/TaskCard";
import { TaskControls } from "./components/TaskControls";
import { TaskModal } from "./components/TaskModal";
import { ThemeToggle } from "./components/ThemeToggle"; // Added
import { useTasks } from "./hooks/useTasks";

export function App() {
  const {
    tasks,
    hasMoreTasks,
    isInitialLoading,
    isLoadingMore,
    fetchMoreTasks,
    createTask,
    deleteTask,
    editTask,
  } = useTasks();

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [formId, setFormId] = useState(0);

  const [priorityFilter, setPriorityFilter] = useState<number | "all">("all");
  const filteredTasks =
    priorityFilter === "all"
      ? tasks
      : tasks.filter((t) => t.priority === priorityFilter);

  const handleAuthSuccess = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    window.location.reload();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  function openCreate() {
    setSelectedTask(null);
    setFormId((prev) => prev + 1);
    setIsDialogOpen(true);
  }

  function openEdit(task: Task) {
    setSelectedTask(task);
    setIsDialogOpen(true);
  }

  const toggleComplete = async (task: Task) => {
    const fullPayload: EditTask = {
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      tags: task.tags.join(","),
      completed: !task.completed,
      dueDate: task.dueDate,
    };
    await editTask(task.id, fullPayload);
  };

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

  if (!token) {
    return (
      /* Using theme variable for background */
      <div className="bg-app-bg flex min-h-screen items-center justify-center">
        <AuthForm
          mode={authMode}
          setMode={setAuthMode}
          onSuccess={handleAuthSuccess}
        />
      </div>
    );
  }

  return (
    /* Using theme variable for background and text */
    <div className="bg-app-bg text-app-text min-h-screen">
      {/* Nav styled for both modes - using dark: utility for the nav specific background */}
      <nav className="flex border-b border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <img src={logo} className="h-8" alt="Logo" />
            <span className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              HelloNoto
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle /> {/* Theme Toggle added here */}
            <button
              onClick={logout}
              className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl">
        <TaskControls
          tasksLength={tasks.length}
          hasMoreTasks={hasMoreTasks}
          isInitialLoading={isInitialLoading}
          isLoadingMore={isLoadingMore}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          openCreate={openCreate}
          fetchMoreTasks={fetchMoreTasks}
        />

        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredTasks.map((t: Task) => (
            <TaskCard
              key={t.id}
              task={t}
              deleteTask={deleteTask}
              onEditClick={openEdit}
              toggleComplete={toggleComplete}
            />
          ))}
        </div>
      </main>

      <TaskModal
        dialogRef={dialogRef}
        selectedTask={selectedTask}
        setIsDialogOpen={setIsDialogOpen}
        setSelectedTask={setSelectedTask}
        createTask={createTask}
        editTask={editTask}
        formId={formId}
      />
    </div>
  );
}

export default App;
