"use client";

import { useState } from "react";
import { fitIllustration } from "@/lib/art";
import { useI18n, type TKey } from "@/lib/i18n";
import type { Card } from "@/lib/types";

/** Asks Muse Image for one riso-style picture of a card. Returns a data URL. */
export async function illustrate(card: Card): Promise<string> {
  const res = await fetch("/api/illustrate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ku: card.ku, meaning: card.meaning, example: card.example_tr }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.image) throw new Error(data.code || "server");
  return fitIllustration(data.image);
}

export function useIllustrateError() {
  const { t } = useI18n();
  return (e: unknown) => {
    const code = e instanceof Error ? e.message : "server";
    return t((code === "rate" || code === "busy" ? `err.${code}` : "art.fail") as TKey);
  };
}

/** "Draw it" pill on a card without a picture. */
export default function IllustrateButton({ card, onDone, onError }: { card: Card; onDone: (img: string) => void; onError: (msg: string) => void }) {
  const { t } = useI18n();
  const errMsg = useIllustrateError();
  const [busy, setBusy] = useState(false);
  return (
    <button
      className="draw-btn"
      disabled={busy}
      onClick={async (e) => {
        e.stopPropagation();
        setBusy(true);
        try {
          onDone(await illustrate(card));
        } catch (err) {
          onError(errMsg(err));
        } finally {
          setBusy(false);
        }
      }}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.6 7.6M11 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
      </svg>
      {busy ? <span className="spinner">{t("art.drawing" as TKey)}</span> : t("art.draw" as TKey)}
    </button>
  );
}
