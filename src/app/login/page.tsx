"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.85.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.96 10.71A5.4 5.4 0 0 1 3.68 9c0-.59.1-1.17.28-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l3-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3 2.33C4.67 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.69-1.28-1.69-1.04-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.18 1.82 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.13 0 1.54-.01 2.79-.01 3.17 0 .3.2.66.79.55A10.51 10.51 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "github" | null>(null);

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

  async function handleSocial(provider: "google" | "github") {
    setError(null);
    setSocialLoading(provider);
    await authClient.signIn.social({ provider, callbackURL: "/" });
  }

  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-[42%] flex-col justify-between p-12 relative overflow-hidden bg-[var(--ink-deep)] border-r border-[var(--hairline)]">
        <div
          className="absolute -left-24 -top-24 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--primary)" }}
        />
        <div
          className="absolute -right-16 bottom-0 h-80 w-80 rounded-full opacity-10 blur-3xl"
          style={{ background: "var(--credit)" }}
        />
        <div className="relative flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-[var(--primary)] flex items-center justify-center font-display font-extrabold text-lg text-[#1a0d05]">
            W
          </div>
          <span className="font-display font-bold text-xl tracking-tight">Wal</span>
        </div>

        <div className="relative">
          <p className="font-display text-4xl font-extrabold leading-tight mb-4">
            Every rupee,
            <br />
            simulated safely.
          </p>
          <p className="text-[var(--text-dim)] text-sm max-w-xs">
            A sandbox wallet for trying out payments, transfers, and QR-based
            money moves — with zero connection to real money or real banks.
          </p>
        </div>

        <p className="relative text-xs text-[var(--text-dim)]">
          © {new Date().getFullYear()} Wal — simulated, always.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm rise-in">
          <div className="flex items-center gap-2 mb-8 justify-center lg:hidden">
            <div className="h-9 w-9 rounded-xl bg-[var(--primary)] flex items-center justify-center font-display font-extrabold text-lg text-[#1a0d05]">
              W
            </div>
            <span className="font-display font-bold text-xl tracking-tight">Wal</span>
          </div>

          <h1 className="font-display text-2xl font-bold mb-1">
            {mode === "signin" ? "Welcome back" : "Create your wallet"}
          </h1>
          <p className="text-sm text-[var(--text-dim)] mb-6">
            {mode === "signin"
              ? "Sign in to access your simulated balance."
              : "Get a demo balance the moment you sign up."}
          </p>

          <div className="space-y-2.5 mb-5">
            <button
              type="button"
              onClick={() => handleSocial("google")}
              disabled={socialLoading !== null}
              className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-zinc-100 transition-colors rounded-xl py-2.5 text-sm font-semibold text-zinc-900 disabled:opacity-60 cursor-pointer"
            >
              <GoogleIcon />
              {socialLoading === "google" ? "Redirecting…" : "Continue with Google"}
            </button>
            <button
              type="button"
              onClick={() => handleSocial("github")}
              disabled={socialLoading !== null}
              className="w-full flex items-center justify-center gap-2.5 bg-[#181717] hover:bg-[#2b2a2a] transition-colors rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-60 cursor-pointer"
            >
              <GitHubIcon />
              {socialLoading === "github" ? "Redirecting…" : "Continue with GitHub"}
            </button>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-[var(--hairline)]" />
            <span className="text-[11px] uppercase tracking-widest text-[var(--text-dim)]">
              or
            </span>
            <div className="h-px flex-1 bg-[var(--hairline)]" />
          </div>

          <div className="flex gap-1 mb-6 p-1 rounded-full bg-[var(--ink-deep)] border border-[var(--hairline)]">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                mode === "signin" ? "bg-[var(--primary)] text-[#1a0d05]" : "text-[var(--text-dim)]"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                mode === "signup" ? "bg-[var(--primary)] text-[#1a0d05]" : "text-[var(--text-dim)]"
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
                  className="w-full bg-[var(--surface)] border border-[var(--hairline)] rounded-xl px-3 py-2.5 text-sm focus:border-[var(--primary-soft)] outline-none"
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
                className="w-full bg-[var(--surface)] border border-[var(--hairline)] rounded-xl px-3 py-2.5 text-sm focus:border-[var(--primary-soft)] outline-none"
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
                className="w-full bg-[var(--surface)] border border-[var(--hairline)] rounded-xl px-3 py-2.5 text-sm focus:border-[var(--primary-soft)] outline-none"
                placeholder="At least 8 characters"
              />
            </div>

            {error && (
              <p className="text-sm text-[var(--debit)] bg-[var(--debit)]/10 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <button
              disabled={loading}
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary-soft)] transition-colors rounded-xl py-2.5 text-sm font-semibold text-[#1a0d05] disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create wallet"}
            </button>
          </form>

          <p className="text-center text-xs text-[var(--text-dim)] mt-5">
            Fully simulated — no real money, cards, or banks involved.
          </p>
        </div>
      </div>
    </main>
  );
}