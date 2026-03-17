"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid credentials");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-2 text-center">Admin Login</h1>
        <p className="text-zinc-400 text-center mb-8">Barbershop Dragan</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm text-zinc-400 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-zinc-400 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-700 text-white py-2 rounded-lg font-semibold transition-colors"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
