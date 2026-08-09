"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function WalletCard({
  walletId,
  balance,
  holderName,
}: {
  walletId: string;
  balance: number;
  holderName: string;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="card-flip-scene w-full max-w-md">
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-label={flipped ? "Show wallet balance" : "Show payment QR code"}
        className="w-full aspect-[1.6/1] block cursor-pointer relative card-flip-inner rounded-3xl"
        style={{ transform: flipped ? "rotateY(180deg)" : "none" }}
      >
        <div
          className="card-face absolute inset-0 rounded-3xl p-6 flex flex-col justify-between text-left overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, var(--primary) 0%, #3d2b9e 60%, var(--ink-deep) 100%)",
          }}
        >
          <div
            className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-20"
            style={{ background: "var(--gold)" }}
          />
          <div className="flex items-start justify-between relative">
            <div className="h-8 w-11 rounded-md bg-gradient-to-br from-[var(--gold)] to-[#c99a2e] opacity-90" />
            <span className="font-display text-sm font-semibold tracking-wide text-white/80">
              Wal
            </span>
          </div>

          <div className="relative">
            <p className="text-xs text-white/60 mb-1">Balance</p>
            <p className="font-mono text-3xl sm:text-4xl font-semibold text-white tabular-nums">
              ₹
              {balance.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="relative flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/50 mb-0.5">
                Wallet ID
              </p>
              <p className="font-mono text-sm text-white tracking-wider">{walletId}</p>
            </div>
            <p className="text-xs text-white/60 max-w-[40%] text-right truncate">{holderName}</p>
          </div>
        </div>

        <div
          className="card-face card-face-back absolute inset-0 rounded-3xl p-6 flex flex-col items-center justify-center gap-3"
          style={{ background: "var(--paper)" }}
        >
          <div className="bg-white p-3 rounded-xl shadow-inner">
            <QRCodeSVG value={walletId} size={128} fgColor="#14132b" bgColor="#ffffff" />
          </div>
          <p className="font-mono text-sm text-[var(--ink)] tracking-wider font-semibold">
            {walletId}
          </p>
          <p className="text-[11px] text-[var(--ink)]/60">Scan to pay this wallet</p>
        </div>
      </button>
      <p className="text-center text-xs text-[var(--text-dim)] mt-3">
        Tap the card to {flipped ? "see your balance" : "reveal your payment QR"}
      </p>
    </div>
  );
}