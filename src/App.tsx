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
    setTasks,
  } = useTasks();

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [formId, setFormId] = useState(0);

  const [priorityFilter, setPriorityFilter] = useState<number | "all">("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allAvailableTags = Array.from(new Set(tasks.flatMap((t) => t.tags)));

  // 3. Update the filter logic to be "Additive"
  const filteredTasks = tasks.filter((task) => {
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    // If no tags are selected, show everything.
    // If tags are selected, the task must contain AT LEAST ONE of the selected tags.
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => task.tags.includes(tag));

    return matchesPriority && matchesTags;
  });

  // 4. Helper to toggle tags
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleAuthSuccess = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    window.location.reload();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setTasks([]);
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
              TaskMaster
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
          allAvailableTags={allAvailableTags}
          selectedTags={selectedTags}
          toggleTag={toggleTag}
          clearTags={() => setSelectedTags([])}
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
