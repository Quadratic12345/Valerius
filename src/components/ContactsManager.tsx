"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { addContactAction, deleteContactAction } from "@/lib/actions";

type Contact = {
  id: string;
  nickname: string;
  walletId: string;
};

type ActionState = { ok: boolean; error: string | null };
const initialState: ActionState = { ok: false, error: null };

export default function ContactsManager({ initial }: { initial: Contact[] }) {
  const [contacts, setContacts] = useState(initial);
  const [state, formAction, pending] = useActionState(addContactAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [isDeleting, startDelete] = useTransition();

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state.ok]);

  useEffect(() => {
    setContacts(initial);
  }, [initial]);

  function handleDelete(id: string) {
    setContacts((c) => c.filter((x) => x.id !== id));
    startDelete(async () => {
      await deleteContactAction(id);
    });
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="bg-[var(--surface)] border border-[var(--hairline)] rounded-2xl p-5">
        <h3 className="font-display font-bold text-sm mb-4">Add a contact</h3>
        <form ref={formRef} action={formAction} className="space-y-3">
          <div className="flex gap-2">
            <input
              name="nickname"
              required
              placeholder="Nickname (e.g. Amit)"
              className="flex-1 bg-[var(--ink-deep)] border border-[var(--hairline)] rounded-xl px-3 py-2.5 text-sm focus:border-[var(--primary-soft)] outline-none"
            />
            <input
              name="walletId"
              required
              placeholder="WAL-000000"
              className="flex-1 bg-[var(--ink-deep)] border border-[var(--hairline)] rounded-xl px-3 py-2.5 text-sm font-mono tracking-wider uppercase focus:border-[var(--primary-soft)] outline-none"
            />
          </div>
          {state.error && (
            <p className="text-sm text-[var(--debit)] bg-[var(--debit)]/10 rounded-xl px-3 py-2">
              {state.error}
            </p>
          )}
          <button
            disabled={pending}
            className="w-full bg-[var(--primary)] text-[#1a0d05] rounded-xl py-2.5 text-sm font-semibold disabled:opacity-60 cursor-pointer"
          >
            {pending ? "Saving…" : "Save contact"}
          </button>
        </form>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--hairline)] rounded-2xl px-4">
        {contacts.length === 0 ? (
          <p className="text-sm text-[var(--text-dim)] text-center py-8">
            No saved contacts yet — add a payment ID above to save it for next time.
          </p>
        ) : (
          <ul>
            {contacts.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-3 py-3.5 border-b border-[var(--hairline)] last:border-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{c.nickname}</p>
                  <p className="text-xs text-[var(--text-dim)] font-mono truncate">{c.walletId}</p>
                </div>
                <button
                  onClick={() => handleDelete(c.id)}
                  disabled={isDeleting}
                  className="text-xs text-[var(--debit)] hover:underline shrink-0 cursor-pointer disabled:opacity-50"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}