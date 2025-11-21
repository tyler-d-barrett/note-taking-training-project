import React from "react";

interface NoteControlsProps {
  notesLength: number;
  hasMoreNotes: boolean;
  isInitialLoading: boolean;
  isLoadingMore: boolean;
  openCreate: () => void;
  fetchMoreNotes: () => Promise<void>;
}

export function NoteControls({
  notesLength,
  hasMoreNotes,
  isInitialLoading,
  isLoadingMore,
  openCreate,
  fetchMoreNotes,
}: NoteControlsProps) {
  if (isInitialLoading && notesLength === 0) {
    return (
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-5 p-8">
        <div className="mt-6 flex items-center justify-center space-x-2">
          <svg
            className="h-10 w-10 animate-spin text-white"
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
          <p className="text-xl text-white">Loading Notes...</p>
        </div>
      </div>
    );
  }

  if (!isInitialLoading && notesLength === 0) {
    return (
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-5 p-8">
        <p className="mt-6 text-center text-white">
          No notes yet. Let's get started!
        </p>
        <div>
          <button
            onClick={openCreate}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            New Note
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
      <div>
        <button
          onClick={openCreate}
          className="m-auto flex w-full items-center justify-center rounded bg-green-600 px-4 py-3 text-lg font-bold text-white shadow-md transition-all duration-150 ease-in-out hover:bg-green-700 hover:shadow-lg active:scale-95 sm:w-auto md:w-56"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="mr-2 h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          New Note
        </button>
      </div>
      <div>
        <button
          onClick={fetchMoreNotes}
          disabled={!hasMoreNotes || isLoadingMore}
          className="m-auto flex w-full items-center justify-center rounded bg-blue-600 px-4 py-3 text-lg font-bold text-white shadow-md transition-all duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto md:w-56"
        >
          {isLoadingMore ? (
            <svg
              className="mr-2 h-6 w-6 animate-spin text-white"
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
              className="mr-2 h-6 w-6"
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
