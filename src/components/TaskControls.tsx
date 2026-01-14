import React from "react";

interface TaskControlsProps {
  tasksLength: number;
  hasMoreTasks: boolean;
  isInitialLoading: boolean;
  isLoadingMore: boolean;
  openCreate: () => void;
  fetchMoreTasks: () => Promise<void>;
}

export function TaskControls({
  tasksLength,
  hasMoreTasks,
  isInitialLoading,
  isLoadingMore,
  openCreate,
  fetchMoreTasks,
}: TaskControlsProps) {
  // Loading State
  if (isInitialLoading && tasksLength === 0) {
    return (
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-5 p-8">
        <div className="mt-6 flex items-center justify-center space-x-3">
          <svg
            className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-xl font-medium text-[var(--color-app-text)]">
            Loading Tasks...
          </p>
        </div>
      </div>
    );
  }

  // Empty State
  if (!isInitialLoading && tasksLength === 0) {
    return (
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-5 p-12">
        <div className="text-center">
          <p className="text-lg text-[var(--color-app-text)] opacity-80">
            No tasks yet. Let's get started!
          </p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-lg bg-blue-600 px-6 py-3 font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95"
        >
          Create First Task
        </button>
      </div>
    );
  }

  // Normal Controls State
  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-3 px-6 sm:flex-row sm:gap-4">
      <div>
        <button
          onClick={openCreate}
          className="flex w-full items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-lg font-bold text-white shadow-md transition-all duration-150 hover:bg-emerald-700 hover:shadow-lg active:scale-95 sm:w-auto md:w-56 dark:bg-emerald-500 dark:hover:bg-emerald-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="mr-2 h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          New Task
        </button>
      </div>

      <div>
        <button
          onClick={fetchMoreTasks}
          disabled={!hasMoreTasks || isLoadingMore}
          className="flex w-full items-center justify-center rounded-xl bg-gray-200 px-6 py-3 text-lg font-bold text-gray-800 shadow-sm transition-all duration-150 hover:bg-gray-300 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto md:w-56 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          {isLoadingMore ? (
            <svg
              className="mr-2 h-5 w-5 animate-spin text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="mr-2 h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          )}
          {isLoadingMore ? "Loading..." : "Load More"}
        </button>
      </div>
    </div>
  );
}
