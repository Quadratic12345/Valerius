import { redirect } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getWalletByUserId, getTransactions, getContacts } from "@/lib/wallet-service";
import WalletCard from "@/components/WalletCard";
import { AddMoneyButton, SendMoneyButton } from "@/components/MoneyActions";
import Ledger from "@/components/Ledger";
import SignOutButton from "@/components/SignOutButton";
import DashboardTabs from "@/components/DashboardTabs";
import ContactsManager from "@/components/ContactsManager";

function GitHubMarkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.69-1.28-1.69-1.04-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.18 1.82 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.13 0 1.54-.01 2.79-.01 3.17 0 .3.2.66.79.55A10.51 10.51 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const wallet = await getWalletByUserId(session.user.id);
  if (!wallet) redirect("/login");

  const [transactions, contacts] = await Promise.all([
    getTransactions(wallet.id),
    getContacts(session.user.id),
  ]);

  return (
    <main className="min-h-screen px-4 py-8 sm:py-12 flex flex-col items-center gap-6">
      <header className="w-full max-w-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-[var(--primary)] flex items-center justify-center font-display font-extrabold text-sm text-[#1a0d05]">
            W
          </div>
          <div>
            <p className="font-display font-bold text-sm leading-none">Wal</p>
            <p className="text-[11px] text-[var(--text-dim)] leading-none mt-0.5">
              {session.user.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/Quadratic12345/Valerius"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[var(--surface)] hover:bg-[var(--surface-raised)] border border-[var(--hairline)] transition-colors rounded-full pl-3 pr-3.5 py-1.5 text-xs font-semibold text-[var(--text)]"
          >
            <GitHubMarkIcon />
            <span>Star on GitHub</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--gold)" aria-hidden="true">
              <path d="M12 2l2.9 6.26L21.5 9l-4.9 4.6L17.8 21 12 17.5 6.2 21l1.2-7.4L2.5 9l6.6-.74L12 2z" />
            </svg>
          </a>
          <Link
            href="/settings"
            aria-label="Settings"
            className="h-8 w-8 flex items-center justify-center rounded-full bg-[var(--surface)] hover:bg-[var(--surface-raised)] border border-[var(--hairline)] transition-colors text-[var(--text-dim)]"
          >
            <GearIcon />
          </Link>
          <SignOutButton />
        </div>
      </header>

      <DashboardTabs
        overview={
          <>
            <WalletCard
              walletId={wallet.id}
              balance={wallet.balance}
              holderName={session.user.name}
            />
            <div className="w-full max-w-md flex gap-3">
              <AddMoneyButton />
              <SendMoneyButton contacts={contacts} />
            </div>
          </>
        }
        activity={<Ledger initial={transactions} />}
        contacts={<ContactsManager initial={contacts} />}
      />

      <footer className="text-center text-[11px] text-[var(--text-dim)] pb-4">
        Simulated wallet · no real money, banking, or payment networks involved
      </footer>
    </main>
  );
}