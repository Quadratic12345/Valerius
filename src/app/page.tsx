import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getWalletByUserId, getTransactions } from "@/lib/wallet-service";
import WalletCard from "@/components/WalletCard";
import { AddMoneyButton, SendMoneyButton } from "@/components/MoneyActions";
import Ledger from "@/components/Ledger";
import SignOutButton from "@/components/SignOutButton";
import DashboardTabs from "@/components/DashboardTabs";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const wallet = await getWalletByUserId(session.user.id);
  if (!wallet) redirect("/login");

  const transactions = await getTransactions(wallet.id);

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
        <SignOutButton />
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
              <SendMoneyButton />
            </div>
          </>
        }
        activity={<Ledger initial={transactions} />}
      />

      <footer className="text-center text-[11px] text-[var(--text-dim)] pb-4">
        Simulated wallet · no real money, banking, or payment networks involved
      </footer>
    </main>
  );
}