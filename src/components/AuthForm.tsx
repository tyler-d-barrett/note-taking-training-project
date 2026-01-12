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
    <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-xl">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 capitalize">{mode}</h2>
        <p className="mt-2 text-sm text-gray-500">
          {mode === "login"
            ? "Welcome back to HelloNoto"
            : "Create your account to get started"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-slate-600 transition outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-slate-600 transition outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="w-full rounded-lg bg-gray-900 py-3 font-semibold text-white shadow-md transition-colors hover:bg-black">
          {mode === "login" ? "Sign In" : "Create Account"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => {
            setError("");
            setMode(mode === "login" ? "register" : "login");
          }}
          className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline"
        >
          {mode === "login"
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}
