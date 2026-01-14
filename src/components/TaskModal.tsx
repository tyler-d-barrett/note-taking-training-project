import React from "react";
import type { Task, EditTask, NewTask } from "../shared/task";
import { TaskForm } from "./TaskForm";

interface TaskModalProps {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  selectedTask: Task | null;
  setIsDialogOpen: (isOpen: boolean) => void;
  setSelectedTask: (task: Task | null) => void;
  createTask: (input: NewTask) => Promise<void>;
  editTask: (id: number, payload: EditTask) => Promise<void>;
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

      await editTask(selectedTask.id, fullPayload);
    } else {
      await createTask(data);
    }

    setSelectedTask(null);
    setIsDialogOpen(false);
  };

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-auto w-full max-w-md rounded-lg shadow-xl backdrop:opacity-50 backdrop:backdrop-blur-md"
    >
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {selectedTask ? "Edit Task" : "New Task"}
          </h2>
          <button
            onClick={() => setIsDialogOpen(false)}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
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
          submitLabel={selectedTask ? "Save" : "Create"}
          onSubmit={handleSubmit}
        />
      </div>
    </dialog>
  );
}
