"use client";

import { useMemo, useState, useTransition } from "react";
import { searchTransactionsAction } from "@/lib/actions";

type Txn = {
  id: string;
  type: "credit" | "debit";
  amount: number;
  counterpartyName: string;
  counterpartyWalletId: string | null;
  category: "add_money" | "transfer" | "payment";
  note: string | null;
  createdAt: Date;
};

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(d));
}

function Row({ txn }: { txn: Txn }) {
  const isCredit = txn.type === "credit";
  const arrow = isCredit ? "←" : "→";
  const sign = isCredit ? "+" : "−";
  return (
    <li className="flex items-center justify-between gap-3 py-3 border-b border-[var(--hairline)] last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="h-9 w-9 shrink-0 rounded-full flex items-center justify-center text-sm font-semibold"
          style={{
            background: isCredit ? "rgba(47,191,113,0.15)" : "rgba(242,84,91,0.15)",
            color: isCredit ? "var(--credit)" : "var(--debit)",
          }}
        >
          {arrow}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{txn.counterpartyName}</p>
          <p className="text-xs text-[var(--text-dim)] font-mono truncate">
            {formatDate(txn.createdAt)}
            {txn.note ? ` · ${txn.note}` : ""}
          </p>
        </div>
      </div>
      <span
        className="font-mono text-sm font-semibold shrink-0"
        style={{ color: isCredit ? "var(--credit)" : "var(--debit)" }}
      >
        {sign} ₹{txn.amount.toLocaleString("en-IN")}
      </span>
    </li>
  );
}

export default function Ledger({ initial }: { initial: Txn[] }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Txn[] | null>(null);
  const [isPending, startTransition] = useTransition();

  function onChange(value: string) {
    setQuery(value);
    if (!value.trim()) {
      setResults(null);
      return;
    }
    startTransition(async () => {
      const data = await searchTransactionsAction(value);
      setResults(data as unknown as Txn[]);
    });
  }

  const list = results ?? initial;
  const grouped = useMemo(() => {
    const map = new Map<string, Txn[]>();
    for (const t of list) {
      const key = new Date(t.createdAt).toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    }
    return Array.from(map.entries());
  }, [list]);

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-semibold text-lg">Transactions</h2>
        {isPending && <span className="text-xs text-[var(--text-dim)]">Searching…</span>}
      </div>

      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)] text-sm">
          ⌕
        </span>
        <input
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by name, note, or transaction ID"
          className="w-full bg-[var(--surface)] border border-[var(--hairline)] rounded-xl pl-9 pr-3 py-2.5 text-sm focus:border-[var(--primary-soft)] outline-none"
        />
      </div>

      <div className="bg-[var(--surface)] border border-[var(--hairline)] rounded-2xl px-4">
        {list.length === 0 ? (
          <p className="text-sm text-[var(--text-dim)] text-center py-8">
            {query ? "No transactions match your search." : "No transactions yet."}
          </p>
        ) : (
          grouped.map(([day, txns]) => (
            <div key={day}>
              <p className="text-[11px] uppercase tracking-widest text-[var(--text-dim)] pt-4 pb-1 sticky top-0 bg-[var(--surface)]">
                {new Date(day).toDateString() === new Date().toDateString()
                  ? "Today"
                  : new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "long" }).format(
                      new Date(day)
                    )}
              </p>
              <ul>
                {txns.map((t) => (
                  <Row key={t.id} txn={t} />
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}