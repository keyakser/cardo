"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminReports from "@/components/AdminReports";
import { useAuth } from "@/lib/auth";
import { useI18n, type TKey } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { LANGS } from "@/lib/types";

type AdminStats = {
  users: number;
  users_7d: number;
  generations: number;
  generations_24h: number;
  cards: number;
  success_rate: number;
  avg_ms: number;
  anon_share: number;
  favorites: number;
  daily: { day: string; n: number }[];
  by_mode: Record<string, number>;
  by_lang: Record<string, number>;
  by_ui: Record<string, number>;
  recent: {
    created_at: string;
    mode: string;
    lang: string;
    card_count: number;
    duration_ms: number;
    success: boolean;
    title: string;
    display_name: string | null;
    email: string | null;
  }[];
  user_list: {
    id: string;
    display_name: string;
    email: string;
    created_at: string;
    generations: number;
    cards: number;
    favorites: number;
    last_active: string | null;
    is_admin: boolean;
  }[];
};

const UI_NAMES: Record<string, string> = { en: "English", tr: "Türkçe", ku: "Kurdî" };
const langName = (c: string) => LANGS.find((l) => l.code === c)?.name || UI_NAMES[c] || c;

export default function AdminPage() {
  const { t, lang } = useI18n();
  const { user, ready, isAdmin } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<AdminStats | null>(null);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const locale = lang === "ku" ? "tr" : lang;

  useEffect(() => {
    if (ready && !user) router.replace("/login?next=/admin");
  }, [ready, user, router]);

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.rpc("admin_stats");
    setLoading(false);
    if (error) setError(error.message);
    else setData(data as AdminStats);
  }, []);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  const users = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (data?.user_list || []).filter(
      (u) => !term || u.email.toLowerCase().includes(term) || u.display_name.toLowerCase().includes(term),
    );
  }, [data, q]);

  if (!ready || !user) return <main className="container page" />;
  if (!isAdmin)
    return (
      <main className="container page center">
        <p className="muted">{t("admin.denied")}</p>
      </main>
    );

  const fmtDate = (s: string | null) =>
    s ? new Date(s).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" }) : "—";
  const fmtTime = (s: string) =>
    new Date(s).toLocaleString(locale, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <main className="container page admin">
      <div className="deckhead">
        <h1 className="h2">{t("admin.title")}</h1>
        <button className="btn ghost" onClick={load} disabled={loading}>
          {loading ? "…" : t("admin.refresh")}
        </button>
      </div>
      {error && <p className="error">{error}</p>}

      {data && (
        <>
          <div className="kpis">
            <Kpi label={t("admin.users")} value={data.users} sub={t("admin.users7d", { n: data.users_7d })} />
            <Kpi label={t("admin.gens")} value={data.generations} sub={t("admin.gens24", { n: data.generations_24h })} />
            <Kpi label={t("admin.cards")} value={data.cards} sub={t("admin.anon", { n: data.anon_share })} />
            <Kpi label={t("admin.success")} value={`${data.success_rate}%`} sub={`${t("admin.avg")}: ${(data.avg_ms / 1000).toFixed(1)} s`} />
            <Kpi label={t("admin.favs")} value={data.favorites} />
          </div>

          <section className="panel chart-panel">
            <h2 className="h3">{t("admin.daily")}</h2>
            <Daily days={data.daily} locale={locale} />
          </section>

          <div className="dist-grid">
            <Dist title={t("admin.byMode")} data={data.by_mode} label={(k) => t(`tab.${k}` as TKey)} />
            <Dist title={t("admin.byLang")} data={data.by_lang} label={langName} />
            <Dist title={t("admin.byUi")} data={data.by_ui} label={langName} />
          </div>

          <AdminReports />

          <section className="panel table-panel">
            <div className="fav-bar">
              <h2 className="h3">
                {t("admin.userList")} <span className="count">{data.user_list.length}</span>
              </h2>
              <input className="field search" placeholder={t("admin.search")} value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>{t("admin.col.user")}</th>
                    <th>{t("admin.col.joined")}</th>
                    <th className="num">{t("admin.col.decks")}</th>
                    <th className="num">{t("admin.col.cards")}</th>
                    <th className="num">{t("admin.col.favs")}</th>
                    <th>{t("admin.col.last")}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div className="user-cell">
                          <span className="avatar sm">{(u.display_name || u.email).slice(0, 1).toUpperCase()}</span>
                          <span>
                            <strong>{u.display_name || u.email.split("@")[0]}</strong>
                            {u.is_admin && <span className="tag">{t("admin.badge")}</span>}
                            <br />
                            <span className="muted small">{u.email}</span>
                          </span>
                        </div>
                      </td>
                      <td>{fmtDate(u.created_at)}</td>
                      <td className="num">{u.generations}</td>
                      <td className="num">{u.cards}</td>
                      <td className="num">{u.favorites}</td>
                      <td>{fmtDate(u.last_active)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel table-panel">
            <h2 className="h3">{t("admin.recent")}</h2>
            <div className="table-wrap">
              <table>
                <tbody>
                  {data.recent.map((r, i) => (
                    <tr key={i}>
                      <td className="nowrap muted small">{fmtTime(r.created_at)}</td>
                      <td>{r.display_name || r.email?.split("@")[0] || <span className="muted">{t("admin.guest")}</span>}</td>
                      <td>
                        <span className={`mode-dot ${r.mode}`}>{t(`tab.${r.mode}` as TKey)}</span>
                      </td>
                      <td className="ellipsis">{r.success ? r.title : <span className="error">{t("admin.failed")}</span>}</td>
                      <td className="num muted small">{r.success ? `${r.card_count} · ${(r.duration_ms / 1000).toFixed(1)} s` : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

function Kpi({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="kpi">
      <span className="kpi-label">{label}</span>
      <strong className="kpi-value">{typeof value === "number" ? value.toLocaleString() : value}</strong>
      {sub && <span className="muted small">{sub}</span>}
    </div>
  );
}

function Daily({ days, locale }: { days: { day: string; n: number }[]; locale: string }) {
  const max = Math.max(1, ...days.map((d) => d.n));
  return (
    <div className="bars" role="img" aria-label={days.map((d) => `${d.day}: ${d.n}`).join(", ")}>
      {days.map((d) => (
        <div key={d.day} className="bar-col" title={`${d.day}: ${d.n}`}>
          <span className="bar-n">{d.n || ""}</span>
          <div className="bar" style={{ height: `${(d.n / max) * 100}%` }} />
          <span className="bar-day">{new Date(d.day + "T00:00:00").toLocaleDateString(locale, { day: "numeric", month: "numeric" })}</span>
        </div>
      ))}
    </div>
  );
}

function Dist({ title, data, label }: { title: string; data: Record<string, number>; label: (k: string) => string }) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((s, [, n]) => s + n, 0) || 1;
  return (
    <section className="panel">
      <h2 className="h3">{title}</h2>
      <ul className="dist">
        {entries.length === 0 && <li className="muted small">—</li>}
        {entries.map(([k, n]) => (
          <li key={k}>
            <div className="dist-row">
              <span>{label(k)}</span>
              <span className="muted small">
                {n} · {Math.round((n / total) * 100)}%
              </span>
            </div>
            <div className="dist-track">
              <div style={{ width: `${(n / total) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
