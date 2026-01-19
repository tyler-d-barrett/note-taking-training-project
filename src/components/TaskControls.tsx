import React from "react";

interface TaskControlsProps {
  tasksLength: number;
  hasMoreTasks: boolean;
  isInitialLoading: boolean;
  isLoadingMore: boolean;
  priorityFilter: number | "all";
  setPriorityFilter: (filter: number | "all") => void;
  openCreate: () => void;
  fetchMoreTasks: () => Promise<void>;
  allAvailableTags: string[];
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  clearTags: () => void;
}

export function TaskControls({
  tasksLength,
  hasMoreTasks,
  isInitialLoading,
  isLoadingMore,
  priorityFilter,
  setPriorityFilter,
  openCreate,
  fetchMoreTasks,
  allAvailableTags,
  selectedTags,
  toggleTag,
  clearTags,
}: TaskControlsProps) {
  // Full Page Loading State
  if (isInitialLoading && tasksLength === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center p-20">
        <svg
          className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400"
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
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <p className="text-app-text mt-4 text-xl font-medium">
          Initializing Taskmaster...
        </p>
      </div>
    );
  }

  // Empty State
  if (!isInitialLoading && tasksLength === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 p-20 text-center">
        <div className="space-y-2">
          <h3 className="text-app-text text-2xl font-bold">No tasks found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Get ahead of your schedule by creating your first task.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="cursor-pointer rounded-xl bg-blue-600 px-8 py-4 font-bold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-blue-500/20 active:scale-95"
        >
          + Create First Task
        </button>
      </div>
    );
  }

  // Main Controls State (Filter + Actions)
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 pt-8">
      <div className="flex flex-col items-center justify-between gap-4 border-b border-gray-200 pb-8 lg:flex-row dark:border-gray-800">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <span className="text-xs font-black tracking-widest text-gray-400 uppercase">
            Filter Priority:
          </span>
          <div className="flex gap-2">
            {[
              { label: "All", value: "all" },
              { label: "Low", value: 0 },
              { label: "Med", value: 1 },
              { label: "High", value: 2 },
            ].map((f) => (
              <button
                key={f.label}
                onClick={() => setPriorityFilter(f.value as any)}
                className={`cursor-pointer rounded-lg px-4 py-2 text-xs font-bold tracking-tight uppercase transition-all ${
                  priorityFilter === f.value
                    ? "bg-gray-900 text-white shadow-md dark:bg-gray-100 dark:text-gray-900"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 border-t border-gray-100 pt-6 dark:border-gray-800">
          <span className="mb-1 w-full text-center text-[10px] font-black tracking-widest text-gray-400 uppercase">
            Filter by Tags
          </span>

          {allAvailableTags.map((tag) => {
            const isActive = selectedTags.includes(tag);

            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`cursor-pointer rounded-full border px-3 py-1 text-[10px] font-bold transition-all duration-200 ${
                  isActive
                    ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                    : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                }`}
              >
                #{tag}
              </button>
            );
          })}

          {selectedTags.length > 0 && (
            <button
              onClick={clearTags}
              className="ml-2 text-[10px] font-black tracking-tight text-red-500 uppercase hover:text-red-600 hover:underline"
            >
              Clear All
            </button>
          )}
        </div>

        <button
          onClick={openCreate}
          className="flex w-full items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-lg font-bold text-white shadow-md transition-all hover:bg-emerald-700 active:scale-95 sm:w-auto md:w-56 dark:bg-emerald-500"
        >
          <svg
            className="mr-2 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
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

      {hasMoreTasks && (
        <div className="flex justify-center pt-4">
          <button
            onClick={fetchMoreTasks}
            disabled={isLoadingMore}
            className="flex w-full items-center justify-center rounded-xl bg-gray-200 px-6 py-3 font-bold text-gray-800 shadow-sm transition-all hover:bg-gray-300 disabled:opacity-40 sm:w-auto md:w-56 dark:bg-gray-800 dark:text-gray-200"
          >
            {isLoadingMore ? (
              <svg
                className="mr-2 h-5 w-5 animate-spin"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
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
      )}
    </div>
  );
}
