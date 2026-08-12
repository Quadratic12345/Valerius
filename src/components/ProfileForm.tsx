"use client";

import { useActionState, useEffect, useState } from "react";
import { updateProfileAction } from "@/lib/actions";

type ActionState = { ok: boolean; error: string | null };
const initialState: ActionState = { ok: false, error: null };

export default function ProfileForm({ currentName }: { currentName: string }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, initialState);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (state.ok) {
      setSaved(true);
      const t = setTimeout(() => setSaved(false), 2500);
      return () => clearTimeout(t);
    }
  }, [state.ok]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="text-xs font-medium text-[var(--text-dim)] mb-1.5 block">
          Display name
        </label>
        <input
          name="name"
          required
          defaultValue={currentName}
          className="w-full bg-[var(--ink-deep)] border border-[var(--hairline)] rounded-xl px-3 py-2.5 text-sm focus:border-[var(--primary-soft)] outline-none"
        />
      </div>

      {state.error && (
        <p className="text-sm text-[var(--debit)] bg-[var(--debit)]/10 rounded-xl px-3 py-2">
          {state.error}
        </p>
      )}
      {saved && (
        <p className="text-sm text-[var(--credit)] bg-[var(--credit)]/10 rounded-xl px-3 py-2">
          Saved.
        </p>
      )}

      <button
        disabled={pending}
        className="bg-[var(--primary)] text-[#1a0d05] rounded-xl px-5 py-2.5 text-sm font-semibold disabled:opacity-60 cursor-pointer"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}