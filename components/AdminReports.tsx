"use client";

import { useCallback, useEffect, useState } from "react";
import { useI18n, type TKey } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";

type Report = {
  id: string;
  ku: string;
  meaning: string;
  example_ku: string;
  example_tr: string;
  lang: string;
  reason: string;
  note: string;
  page: string;
  created_at: string;
};

/** Open "report a mistake" submissions, newest first, for admins to fix and close. */
export default function AdminReports() {
  const { t, lang } = useI18n();
  const [rows, setRows] = useState<Report[] | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from("reports").select("*").eq("status", "open").order("created_at", { ascending: false }).limit(100);
    if (error) setError(error.message);
    else setRows(data as Report[]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function resolve(id: string) {
    if (!supabase) return;
    setRows((r) => r?.filter((x) => x.id !== id) ?? null);
    await supabase.from("reports").update({ status: "fixed" }).eq("id", id);
  }

  const when = (s: string) => new Date(s).toLocaleString(lang === "ku" ? "tr" : lang, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <section className="panel table-panel">
      <h2 className="h3">
        {t("admin.reports" as TKey)} <span className="count">{rows?.length ?? 0}</span>
      </h2>
      {error && <p className="error">{error}</p>}
      {rows && rows.length === 0 && <p className="muted">{t("admin.noReports" as TKey)}</p>}
      {rows && rows.length > 0 && (
        <ul className="report-list">
          {rows.map((r) => (
            <li key={r.id}>
              <div className="report-main">
                <span className="mono muted">
                  {when(r.created_at)} · {t(`report.${r.reason}` as TKey)} · {r.lang.toUpperCase()} · {r.page}
                </span>
                <strong lang="ku">{r.ku}</strong>
                <span>{r.meaning}</span>
                {r.example_ku && (
                  <span className="muted small">
                    <b lang="ku">{r.example_ku}</b> {r.example_tr}
                  </span>
                )}
                {r.note && <q className="report-note">{r.note}</q>}
              </div>
              <button className="btn ghost btn-sm" onClick={() => resolve(r.id)}>
                {t("admin.resolve" as TKey)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
