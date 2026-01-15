import { useState } from "react";

export function AuthForm({ mode, setMode, onSuccess }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const endpoint = mode === "login" ? "/api/login" : "/api/register";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        onSuccess(data.token);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Server connection failed");
    }
  }

  return (
    /* Card background and border updated for dark mode */
    <div className="bg-card-bg w-full max-w-md rounded-xl border border-gray-200 p-8 shadow-xl transition-colors dark:border-gray-800">
      <div className="mb-8 text-center">
        <h2 className="text-app-text text-3xl font-bold capitalize">{mode}</h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {mode === "login"
            ? "Welcome back to TaskMaster"
            : "Create your account to get started"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          /* Error box updated for dark mode readability */
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address
          </label>
          <input
            type="email"
            required
            /* Updated input colors: dark-gray bg and lighter borders in dark mode */
            className="text-app-text mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 transition outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            type="password"
            required
            className="text-app-text mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 transition outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="w-full rounded-lg bg-gray-900 py-3 font-semibold text-white shadow-md transition-colors hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-700">
          {mode === "login" ? "Sign In" : "Create Account"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => {
            setError("");
            setMode(mode === "login" ? "register" : "login");
          }}
          className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
        >
          {mode === "login"
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}
