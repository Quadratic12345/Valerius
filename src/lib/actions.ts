"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import * as walletService from "@/lib/wallet-service";

async function requireUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Not signed in.");
  return session.user.id;
}

export async function addMoneyAction(_prev: unknown, formData: FormData) {
  try {
    const userId = await requireUserId();
    const amount = Number(formData.get("amount"));
    const note = String(formData.get("note") || "");
    await walletService.addMoney(userId, amount, note);
    revalidatePath("/");
    return { ok: true, error: null };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function sendMoneyAction(_prev: unknown, formData: FormData) {
  try {
    const userId = await requireUserId();
    const toWalletId = String(formData.get("toWalletId") || "");
    const amount = Number(formData.get("amount"));
    const note = String(formData.get("note") || "");
    await walletService.sendMoney(userId, toWalletId, amount, note);
    revalidatePath("/");
    return { ok: true, error: null };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function searchTransactionsAction(query: string) {
  const userId = await requireUserId();
  const wallet = await walletService.getWalletByUserId(userId);
  if (!wallet) return [];
  return walletService.getTransactions(wallet.id, { search: query });
}
export async function addContactAction(_prev: unknown, formData: FormData) {
  try {
    const userId = await requireUserId();
    const nickname = String(formData.get("nickname") || "");
    const walletId = String(formData.get("walletId") || "");
    await walletService.addContact(userId, nickname, walletId);
    revalidatePath("/");
    return { ok: true, error: null };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function deleteContactAction(contactId: string) {
  const userId = await requireUserId();
  await walletService.deleteContact(userId, contactId);
  revalidatePath("/");
}

export async function updateProfileAction(_prev: unknown, formData: FormData) {
  try {
    const userId = await requireUserId();
    const name = String(formData.get("name") || "");
    await walletService.updateProfileName(userId, name);
    revalidatePath("/");
    revalidatePath("/settings");
    return { ok: true, error: null };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Something went wrong." };
  }
}