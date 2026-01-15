# 🚀 Taskmaster: Advanced Productivity Hub

Taskmaster is a high-performance task management application built with React and Tailwind CSS 4. It features a robust Bun-powered backend with secure user authentication, priority-based organization, and advanced tag filtering.

| Feature  | Technologies                    |
| :------- | :------------------------------ |
| Frontend | React, TypeScript, Tailwind CSS |
| Backend  | Bun, TypeScript                 |
| Security | Argon2/Bcrypt password hashing  |

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

### Seeded Data

To start with a seeded account, sign in with the following credentials:

```
test@example.com
password
```

---

## 💻 Frontend Structure and Components

The frontend logic is intentionally split for Separation of Concerns to improve maintainability.

| File/Component              | Responsibility                                                                                                       |
| :-------------------------- | :------------------------------------------------------------------------------------------------------------------- |
| App.tsx                     | Handles main layout, state orchestration (open/close modal), and rendering top-level components.                     |
| hooks/useTasks.ts           | Central Data Logic. Contains all API fetching logic, state management (tasks, loading statuses), and CRUD functions. |
| components/TaskModal.tsx    | Encapsulates the \<dialog> UI and passes handlers/data to TaskForm.                                                  |
| components/TaskForm.tsx     | Handles local form state and the submission lifecycle (loading spinner).                                             |
| components/TaskControls.tsx | Renders the main loading screens, "New Task" button, and "Load More" pagination control.                             |
| components/TaskCard.tsx     | Handles display logic for each task as well as handling edit/delete/complete actions                                 |
| components/ThemeToggle.tsx  | Manages logic for using localStorage or system settings to display light/dark theme                                  |

---

## 🌐 API Documentation

The application relies on a RESTful API structure for task management. All endpoints are relative to your local server.

### Auth Endpoints

| Method | Endpoint      | Description                                     | Request Body        | Response Body                     |
| :----- | :------------ | :---------------------------------------------- | :------------------ | :-------------------------------- |
| POST   | /api/register | Creates a new account with hashed password.     | { email, password } | { "token": string, "id": number } |
| POST   | /api/login    | Verifies credentials and returns session token. | { email, password } | { "token": string }               |

### Task Endpoints

| Method | Endpoint                     | Description                        | Request Body                      | Response Body                       |
| :----- | :--------------------------- | :--------------------------------- | :-------------------------------- | :---------------------------------- |
| GET    | /api/tasks?limit=10&offset=0 | Fetches a paginated list of tasks. | None                              | { tasks: Task[], hasMore: boolean } |
| POST   | /api/tasks                   | Creates a new task.                | { title: string, body: string }   | Task                                |
| PUT    | /api/tasks/{id}              | Updates an existing task.          | { title?: string, body?: string } | Task                                |
| DELETE | /api/tasks/{id}              | Deletes a task by ID.              | None                              | 204 No Content                      |

## 🧪 Tests

To run tests, simply run the following command:

```
bun test
```

Test coverage includes the following:

- Auth Logic: Verifies that passwords are never stored in plain text and utilize secure hashing.
- User Isolation: Ensures that User A cannot view, modify, or delete tasks belonging to User B.
- Task CRUD: Validates that all task operations respect the database schema and mandatory fields.
- Security: Integration tests ensuring protected endpoints reject requests without valid account IDs.
