"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      window.location.href = "/admin";
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data?.error || "Invalid credentials");
    }
  };

  return (
    <main className="min-h-screen bg-primary flex flex-col items-center px-4">

      {/* Login Form */}
      <form
        onSubmit={onLogin}
        className="mt-10 bg-panel border-4 border-secondary rounded-xl p-6 w-full max-w-md"
      >
        <h1 className="text-secondary font-heading text-3xl uppercase text-center">
          Admin Login
        </h1>

        <input
          type="text"
          placeholder="Admin Username"
          className="mt-6 w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Admin Password"
          className="mt-4 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="text-red-200 mt-3 text-sm text-center">
            {error}
          </p>
        )}

        <button className="mt-6 w-full bg-secondary text-primary font-heading uppercase py-3 rounded shadow">
          Login
        </button>
      </form>
    </main>
  );
}
