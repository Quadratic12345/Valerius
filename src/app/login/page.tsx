"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } =
      mode === "signin"
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({ email, password, name });
    setLoading(false);
    if (error) {
      setError(error.message ?? "Something went wrong.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm rise-in">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="h-9 w-9 rounded-lg bg-[var(--primary)] flex items-center justify-center font-display font-bold text-lg">
            W
          </div>
          <span className="font-display font-semibold text-xl tracking-tight">Wal</span>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--hairline)] rounded-2xl p-6 shadow-2xl shadow-black/40">
          <div className="flex gap-1 mb-6 p-1 rounded-lg bg-[var(--ink-deep)]">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                mode === "signin" ? "bg-[var(--primary)] text-white" : "text-[var(--text-dim)]"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                mode === "signup" ? "bg-[var(--primary)] text-white" : "text-[var(--text-dim)]"
              }`}
            >
              Create wallet
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-xs font-medium text-[var(--text-dim)] mb-1.5 block">
                  Name
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[var(--ink-deep)] border border-[var(--hairline)] rounded-lg px-3 py-2.5 text-sm focus:border-[var(--primary-soft)] outline-none"
                  placeholder="Rahul Sharma"
                />
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-[var(--text-dim)] mb-1.5 block">
                Email
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--ink-deep)] border border-[var(--hairline)] rounded-lg px-3 py-2.5 text-sm focus:border-[var(--primary-soft)] outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-dim)] mb-1.5 block">
                Password
              </label>
              <input
                required
                minLength={8}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--ink-deep)] border border-[var(--hairline)] rounded-lg px-3 py-2.5 text-sm focus:border-[var(--primary-soft)] outline-none"
                placeholder="At least 8 characters"
              />
            </div>

            {error && (
              <p className="text-sm text-[var(--debit)] bg-[var(--debit)]/10 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              disabled={loading}
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary-soft)] transition-colors rounded-lg py-2.5 text-sm font-semibold disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create wallet"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[var(--text-dim)] mt-5">
          Fully simulated no real money, cards, or banks involved.
        </p>
      </div>
    </main>
  );
}