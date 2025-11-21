# 🚀 HelloNoto: Simple Note Manager

HelloNoto is a modern, lightweight note-taking application built with **React** and powered by a backend API (simulated or real, depending on your setup). The application features dynamic loading of notes and basic **CRUD** (Create, Read, Update, Delete) functionality.

| Feature  | Technologies                    |
| :------- | :------------------------------ |
| Frontend | React, TypeScript, Tailwind CSS |
| Backend  | Bun, TypeScript                 |

---

## ⚙️ Local Installation and Setup

Since this project uses **Bun**, the build tool, you must install it first.

### Step 1: Install Bun

Bun is required to install dependencies and run the project.

**Windows:**

```
npm install -g bun
```

After installation, restart your terminal and confirm Bun is installed:

```
bun --version
```

### Step 2: Close the Repository

Clone the project repository and navigate into the directory:

```
git clone https://github.com/tyler-d-barrett/note-taking-training-project.git
cd note-taking-training-project
```

### Step 3: Install Dependencies

Use the Bun package manager to install all required dependencies:

```
bun install
```

### Step 4: Run the Project

Start the local development server. The application will be available at http://localhost:3000

```
bun run dev
```

---

## 💻 Frontend Structure and Components

The frontend logic is intentionally split for Separation of Concerns to improve maintainability.

| File/Component              | Responsibility                                                                                                       |
| :-------------------------- | :------------------------------------------------------------------------------------------------------------------- |
| App.tsx                     | Handles main layout, state orchestration (open/close modal), and rendering top-level components.                     |
| hooks/useNotes.ts           | Central Data Logic. Contains all API fetching logic, state management (notes, loading statuses), and CRUD functions. |
| components/NoteModal.tsx    | Encapsulates the \<dialog> UI and passes handlers/data to NoteForm.                                                  |
| components/NoteForm.tsx     | Handles local form state and the submission lifecycle (loading spinner).                                             |
| components/NoteControls.tsx | Renders the main loading screens, "New Note" button, and "Load More" pagination control.                             |

---

## 🌐 API Documentation

The application relies on a RESTful API structure for note management. All endpoints are relative to your local server.

| Method | Endpoint                     | Description                        | Request Body                      | Response Body                       |
| :----- | :--------------------------- | :--------------------------------- | :-------------------------------- | :---------------------------------- |
| GET    | /api/notes?limit=10&offset=0 | Fetches a paginated list of notes. | None                              | { notes: Note[], hasMore: boolean } |
| POST   | /api/notes                   | Creates a new note.                | { title: string, body: string }   | Note                                |
| PUT    | /api/notes/{id}              | Updates an existing note.          | { title?: string, body?: string } | Note                                |
| DELETE | /api/notes/{id}              | Deletes a note by ID.              | None                              | 204 No Content                      |
