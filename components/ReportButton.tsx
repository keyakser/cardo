"use client";

import { useRef, useState } from "react";
import { useI18n, type TKey } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/lib/toast";
import type { Card } from "@/lib/types";

const REASONS = ["word", "meaning", "example", "other"] as const;

/** Small flag button that lets anyone report a wrong word, translation or example. */
export default function ReportButton({ card, lang }: { card: Card; lang: string }) {
  const { t } = useI18n();
  const toast = useToast();
  const dlg = useRef<HTMLDialogElement>(null);
  const [reason, setReason] = useState<(typeof REASONS)[number]>("meaning");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  if (!supabase) return null;

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    const { error } = await supabase.from("reports").insert({
      ku: card.ku.slice(0, 200),
      meaning: card.meaning,
      example_ku: card.example_ku,
      example_tr: card.example_tr,
      lang,
      reason,
      note: note.trim().slice(0, 1000),
      page: location.pathname,
    });
    setBusy(false);
    if (error) return toast(t("report.fail" as TKey));
    dlg.current?.close();
    setNote("");
    toast(t("report.thanks" as TKey));
  }

  return (
    <>
      <button
        className="fav report-btn"
        aria-label={t("report.btn" as TKey)}
        title={t("report.btn" as TKey)}
        onClick={(e) => {
          e.stopPropagation();
          dlg.current?.showModal();
        }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 21V4M5 4h11l-2 4 2 4H5" />
        </svg>
      </button>
      <dialog ref={dlg} className="report-dlg" onClick={(e) => e.target === dlg.current && dlg.current?.close()}>
        <form onSubmit={send} className="report-form">
          <h3 className="h3">{t("report.title" as TKey)}</h3>
          <p className="report-card">
            <strong lang="ku">{card.ku}</strong> · {card.meaning}
          </p>
          <fieldset>
            {REASONS.map((r) => (
              <label key={r} className="report-opt">
                <input type="radio" name="reason" value={r} checked={reason === r} onChange={() => setReason(r)} />
                {t(`report.${r}` as TKey)}
              </label>
            ))}
          </fieldset>
          <textarea
            className="field"
            rows={3}
            maxLength={1000}
            placeholder={t("report.note" as TKey)}
            aria-label={t("report.note" as TKey)}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="report-actions">
            <button type="button" className="btn ghost" onClick={() => dlg.current?.close()}>
              {t("report.cancel" as TKey)}
            </button>
            <button className="btn primary" disabled={busy}>
              {busy ? "…" : t("report.send" as TKey)}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
