import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { createWalletForUser } from "@/lib/wallet-service";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Every new user gets a simulated wallet, pre-loaded with demo balance.
          await createWalletForUser(user.id);
        },
      },
    },
  },
});