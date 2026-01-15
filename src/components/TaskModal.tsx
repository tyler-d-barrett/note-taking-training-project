import React from "react";
import type { Task, EditTask, NewTask } from "../shared/task";
import { TaskForm } from "./TaskForm";

interface TaskModalProps {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  selectedTask: Task | null;
  setIsDialogOpen: (isOpen: boolean) => void;
  setSelectedTask: (task: Task | null) => void;
  createTask: (input: NewTask) => Promise<void>;
  editTask: (payload: EditTask) => Promise<void>;
  formId: number;
}

export function TaskModal({
  dialogRef,
  selectedTask,
  setIsDialogOpen,
  setSelectedTask,
  createTask,
  editTask,
  formId,
}: TaskModalProps) {
  const formKey = selectedTask ? `edit-${selectedTask.id}` : `new-${formId}`;

  const handleSubmit = async (data: NewTask) => {
    if (selectedTask) {
      const fullPayload: EditTask = {
        id: selectedTask.id,
        title: data.title,
        description: data.description,
        priority: data.priority ?? selectedTask.priority,
        tags:
          typeof data.tags === "string"
            ? data.tags
            : selectedTask.tags.join(","),
        completed: selectedTask.completed,
        dueDate: data.dueDate ?? selectedTask.dueDate,
      };

      await editTask(fullPayload);
    } else {
      await createTask(data);
    }

    setSelectedTask(null);
    setIsDialogOpen(false);
  };

  return (
    <dialog
      ref={dialogRef}
      /* 1. Replaced hardcoded bg-white with var color
         2. Added dark:border for definition
         3. Updated backdrop to be dark-aware 
      */
      className="bg-card-bg text-app-text fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-gray-200 shadow-2xl transition-colors duration-300 backdrop:bg-black/40 backdrop:backdrop-blur-sm dark:border-gray-800 dark:backdrop:bg-black/60"
    >
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">
            {selectedTask ? "Edit Task" : "Create Task"}
          </h2>
          <button
            onClick={() => setIsDialogOpen(false)}
            className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <TaskForm
          key={formKey}
          initialData={
            selectedTask
              ? {
                  title: selectedTask.title,
                  description: selectedTask.description,
                  priority: selectedTask.priority,
                  tags: selectedTask.tags.join(","),
                  dueDate: selectedTask.dueDate,
                }
              : undefined
          }
          submitLabel={selectedTask ? "Update Task" : "Create Task"}
          onSubmit={handleSubmit}
        />
      </div>
    </dialog>
  );
}
