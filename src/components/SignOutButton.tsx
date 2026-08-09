"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await authClient.signOut();
        router.push("/login");
        router.refresh();
      }}
      className="text-xs text-[var(--text-dim)] hover:text-[var(--text)] transition-colors cursor-pointer"
    >
      Sign out
    </button>
  );
}