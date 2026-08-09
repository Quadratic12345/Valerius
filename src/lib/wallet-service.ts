import { db } from "@/db";
import { wallets, transactions, user } from "@/db/schema";
import { eq, desc, and, or, ilike } from "drizzle-orm";

function randomWalletId() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `WAL-${n}`;
}

function randomTxnId() {
  return `TXN-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1e6)
    .toString(36)
    .toUpperCase()}`;
}

const DEMO_STARTING_BALANCE = 12450;

export async function createWalletForUser(userId: string) {
  let id = randomWalletId();
  while ((await db.select().from(wallets).where(eq(wallets.id, id)))[0]) {
    id = randomWalletId();
  }

  await db.insert(wallets).values({ id, userId, balance: DEMO_STARTING_BALANCE, createdAt: new Date() });

  await db.insert(transactions).values({
    id: randomTxnId(),
    walletId: id,
    type: "credit",
    amount: DEMO_STARTING_BALANCE,
    counterpartyName: "Welcome bonus",
    category: "add_money",
    note: "Starting simulated balance",
    status: "success",
    createdAt: new Date(),
  });

  return id;
}

export async function getWalletByUserId(userId: string) {
  const rows = await db.select().from(wallets).where(eq(wallets.userId, userId));
  return rows[0];
}

export async function getWalletById(walletId: string) {
  const rows = await db.select().from(wallets).where(eq(wallets.id, walletId));
  return rows[0];
}

export async function getTransactions(walletId: string, opts?: { search?: string; limit?: number }) {
  const conditions = [eq(transactions.walletId, walletId)];
  if (opts?.search) {
    const term = `%${opts.search}%`;
    conditions.push(
      or(
        ilike(transactions.counterpartyName, term),
        ilike(transactions.note, term),
        ilike(transactions.id, term)
      )!
    );
  }
  return db
    .select()
    .from(transactions)
    .where(and(...conditions))
    .orderBy(desc(transactions.createdAt))
    .limit(opts?.limit ?? 200);
}

export class WalletError extends Error {}

export async function addMoney(userId: string, amount: number, note?: string) {
  if (!Number.isFinite(amount) || amount <= 0) throw new WalletError("Enter a valid amount.");
  if (amount > 100000) throw new WalletError("Simulated top-ups are capped at ₹1,00,000.");

  const wallet = await getWalletByUserId(userId);
  if (!wallet) throw new WalletError("Wallet not found.");

  await db.transaction(async (tx) => {
    await tx
      .update(wallets)
      .set({ balance: wallet.balance + amount })
      .where(eq(wallets.id, wallet.id));

    await tx.insert(transactions).values({
      id: randomTxnId(),
      walletId: wallet.id,
      type: "credit",
      amount,
      counterpartyName: "Added money",
      category: "add_money",
      note: note || null,
      status: "success",
      createdAt: new Date(),
    });
  });
}

export async function sendMoney(userId: string, toWalletId: string, amount: number, note?: string) {
  if (!Number.isFinite(amount) || amount <= 0) throw new WalletError("Enter a valid amount.");

  const sender = await getWalletByUserId(userId);
  if (!sender) throw new WalletError("Wallet not found.");

  const cleanId = toWalletId.trim().toUpperCase();
  if (cleanId === sender.id) throw new WalletError("You can't send money to yourself.");

  const recipient = await getWalletById(cleanId);
  if (!recipient) throw new WalletError("No wallet found with that payment ID.");

  if (sender.balance < amount) throw new WalletError("Insufficient balance.");

  await db.transaction(async (tx) => {
    const freshSender = (await tx.select().from(wallets).where(eq(wallets.id, sender.id)))[0];
    if (!freshSender || freshSender.balance < amount) {
      throw new WalletError("Insufficient balance.");
    }

    const [senderUser] = await tx.select().from(user).where(eq(user.id, sender.userId));
    const [recipientUser] = await tx.select().from(user).where(eq(user.id, recipient.userId));

    await tx
      .update(wallets)
      .set({ balance: freshSender.balance - amount })
      .where(eq(wallets.id, sender.id));

    await tx
      .update(wallets)
      .set({ balance: recipient.balance + amount })
      .where(eq(wallets.id, recipient.id));

    await tx.insert(transactions).values({
      id: randomTxnId(),
      walletId: sender.id,
      type: "debit",
      amount,
      counterpartyName: recipientUser?.name ?? recipient.id,
      counterpartyWalletId: recipient.id,
      category: "transfer",
      note: note || null,
      status: "success",
      createdAt: new Date(),
    });

    await tx.insert(transactions).values({
      id: randomTxnId(),
      walletId: recipient.id,
      type: "credit",
      amount,
      counterpartyName: senderUser?.name ?? sender.id,
      counterpartyWalletId: sender.id,
      category: "transfer",
      note: note || null,
      status: "success",
      createdAt: new Date(),
    });
  });
}