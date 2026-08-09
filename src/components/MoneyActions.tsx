"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { addMoneyAction, sendMoneyAction } from "@/lib/actions";

type ActionState = { ok: boolean; error: string | null };
const initialState: ActionState = { ok: false, error: null };

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-sm bg-[var(--surface)] border border-[var(--hairline)] rounded-t-2xl sm:rounded-2xl p-6 rise-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold text-lg">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="h-8 w-8 rounded-full flex items-center justify-center text-[var(--text-dim)] hover:bg-white/5 cursor-pointer"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function AddMoneyButton() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(addMoneyAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      setOpen(false);
    }
  }, [state.ok]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex-1 bg-[var(--credit)] hover:brightness-110 transition-all rounded-xl py-3 text-sm font-semibold text-[#062114] cursor-pointer flex items-center justify-center gap-2"
      >
        <span className="text-base leading-none">＋</span> Add money
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Add money">
        <form ref={formRef} action={formAction} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[var(--text-dim)] mb-1.5 block">
              Amount (₹)
            </label>
            <input
              name="amount"
              type="number"
              min="1"
              step="0.01"
              required
              autoFocus
              placeholder="1,000"
              className="w-full bg-[var(--ink-deep)] border border-[var(--hairline)] rounded-xl px-3 py-2.5 font-mono text-lg focus:border-[var(--credit)] outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-dim)] mb-1.5 block">
              Note (optional)
            </label>
            <input
              name="note"
              placeholder="Top-up"
              className="w-full bg-[var(--ink-deep)] border border-[var(--hairline)] rounded-xl px-3 py-2.5 text-sm focus:border-[var(--credit)] outline-none"
            />
          </div>
          {state.error && (
            <p className="text-sm text-[var(--debit)] bg-[var(--debit)]/10 rounded-xl px-3 py-2">
              {state.error}
            </p>
          )}
          <button
            disabled={pending}
            className="w-full bg-[var(--credit)] text-[#062114] rounded-xl py-2.5 text-sm font-semibold disabled:opacity-60 cursor-pointer"
          >
            {pending ? "Adding…" : "Add to wallet"}
          </button>
          <p className="text-[11px] text-center text-[var(--text-dim)]">
            Simulated top-up — no real payment is made.
          </p>
        </form>
      </Modal>
    </>
  );
}

export function SendMoneyButton() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(sendMoneyAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      setOpen(false);
    }
  }, [state.ok]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-soft)] transition-colors rounded-xl py-3 text-sm font-semibold cursor-pointer flex items-center justify-center gap-2"
      >
        <span className="text-base leading-none">↗</span> Send money
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Send money">
        <form ref={formRef} action={formAction} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[var(--text-dim)] mb-1.5 block">
              Payment ID
            </label>
            <input
              name="toWalletId"
              required
              autoFocus
              placeholder="WAL-000000"
              className="w-full bg-[var(--ink-deep)] border border-[var(--hairline)] rounded-xl px-3 py-2.5 font-mono text-sm tracking-wider focus:border-[var(--primary-soft)] outline-none uppercase"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-dim)] mb-1.5 block">
              Amount (₹)
            </label>
            <input
              name="amount"
              type="number"
              min="1"
              step="0.01"
              required
              placeholder="500"
              className="w-full bg-[var(--ink-deep)] border border-[var(--hairline)] rounded-xl px-3 py-2.5 font-mono text-lg focus:border-[var(--primary-soft)] outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-dim)] mb-1.5 block">
              Note (optional)
            </label>
            <input
              name="note"
              placeholder="For lunch"
              className="w-full bg-[var(--ink-deep)] border border-[var(--hairline)] rounded-xl px-3 py-2.5 text-sm focus:border-[var(--primary-soft)] outline-none"
            />
          </div>
          {state.error && (
            <p className="text-sm text-[var(--debit)] bg-[var(--debit)]/10 rounded-xl px-3 py-2">
              {state.error}
            </p>
          )}
          <button
            disabled={pending}
            className="w-full bg-[var(--primary)] rounded-xl py-2.5 text-sm font-semibold disabled:opacity-60 cursor-pointer"
          >
            {pending ? "Sending…" : "Send"}
          </button>
          <p className="text-[11px] text-center text-[var(--text-dim)]">
            Simulated transfer — moves balance between wallets in this app only.
          </p>
        </form>
      </Modal>
    </>
  );
}