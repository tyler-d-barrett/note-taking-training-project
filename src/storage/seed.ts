import { db } from "./db";

export function seedDatabase() {
  db.run(`INSERT OR IGNORE INTO account (id, email, password_hash) 
          VALUES (1, 'test@example.com', 'placeholder_hash')`);

  const insertTask = db.prepare(`
    INSERT INTO task (account_id, title, description, completed, priority, tags)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const sampleTasks = [
    [1, "Setup Project B", "Initialize the new schema", 1, 3, "work,init"],
    [1, "Implement Auth", "Create login/register logic", 0, 3, "auth"],
    [1, "Style Dark Mode", "Add tailwind dark: classes", 0, 1, "ui"],
    [1, "Buy Groceries", "Milk, eggs, and bread", 0, 2, "personal"],
    [1, "Refactor Notes", "Move old notes to tasks", 0, 2, "refactor"],
    [1, "Write Unit Tests", "Test the password hashing", 0, 3, "testing"],
    [1, "Update README", "Add instructions for Part B", 0, 1, "docs"],
    [1, "Check API Specs", "Ensure OpenAPI matches new endpoints", 0, 2, "api"],
    [1, "Deploy to Bun", "Test the production build", 0, 2, "deployment"],
    [1, "Final Review", "Go through the checklist", 0, 3, "final"],
  ];

  const transaction = db.transaction((tasks) => {
    for (const task of tasks) {
      insertTask.run(...task);
    }
  });

  transaction(sampleTasks);
  console.log("Database seeded with 1 account and 10 tasks.");
}
