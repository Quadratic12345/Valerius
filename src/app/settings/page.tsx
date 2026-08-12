import { redirect } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getWalletByUserId } from "@/lib/wallet-service";
import ProfileForm from "@/components/ProfileForm";
import SignOutButton from "@/components/SignOutButton";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const wallet = await getWalletByUserId(session.user.id);

  return (
    <main className="min-h-screen px-4 py-8 sm:py-12 flex flex-col items-center gap-8">
      <div className="w-full max-w-md flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
        >
          <span aria-hidden="true">←</span> Back to wallet
        </Link>
        <SignOutButton />
      </div>

      <div className="w-full max-w-md space-y-6">
        <h1 className="font-display text-2xl font-bold">Settings</h1>

        <div className="bg-[var(--surface)] border border-[var(--hairline)] rounded-2xl p-5 space-y-4">
          <h2 className="font-display font-bold text-sm">Profile</h2>
          <ProfileForm currentName={session.user.name} />
        </div>

        <div className="bg-[var(--surface)] border border-[var(--hairline)] rounded-2xl p-5 space-y-3">
          <h2 className="font-display font-bold text-sm">Account</h2>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--text-dim)]">Email</span>
            <span className="font-mono text-xs">{session.user.email}</span>
          </div>
          {wallet && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-dim)]">Wallet ID</span>
              <span className="font-mono text-xs tracking-wider">{wallet.id}</span>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-[var(--text-dim)]">
          Simulated wallet · no real money, banking, or payment networks involved
        </p>
      </div>
    </main>
  );
}