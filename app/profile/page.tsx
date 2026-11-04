"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DownloadMenu from "@/components/DownloadMenu";
import KurdolingoPromo from "@/components/KurdolingoPromo";
import { useAuth } from "@/lib/auth";
import { useI18n, type TKey } from "@/lib/i18n";
import { encodeDeck } from "@/lib/share";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/lib/toast";
import type { Deck } from "@/lib/types";

type SavedDeck = { id: string; created_at: string; mode: string; title: string; card_count: number; deck: Deck };
type Stats = { decks: number; cards: number; favorites: number };

export default function ProfilePage() {
  const { t, lang } = useI18n();
  const { user, ready, favorites } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [name, setName] = useState("");
  const [savedName, setSavedName] = useState("");
  const [tab, setTab] = useState<"favs" | "decks">("favs");
  const [stats, setStats] = useState<Stats | null>(null);
  const [decks, setDecks] = useState<SavedDeck[] | null>(null);

  useEffect(() => {
    if (ready && !user) router.replace("/login?next=/profile");
  }, [ready, user, router]);

  useEffect(() => {
    if (!supabase || !user) return;
    supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setName(data?.display_name || "");
        setSavedName(data?.display_name || "");
      });
    supabase
      .from("generations")
      .select("id, created_at, mode, title, card_count, deck")
      .eq("user_id", user.id)
      .eq("success", true)
      .not("deck", "is", null)
      .order("created_at", { ascending: false })
      .limit(60)
      .then(({ data }) => setDecks((data as SavedDeck[]) || []));
  }, [user]);

  useEffect(() => {
    if (!supabase || !user) return;
    supabase.rpc("my_stats").then(({ data }) => data && setStats(data as Stats));
  }, [user, favorites.length]);

  if (!user) return <main className="container page" />;

  async function saveName() {
    if (!supabase || !user) return;
    await supabase.from("profiles").update({ display_name: name.trim() }).eq("id", user.id);
    await supabase.auth.updateUser({ data: { display_name: name.trim() } });
    setSavedName(name.trim());
    toast(t("toast.nameSaved"));
  }

  async function openDeck(d: Deck) {
    router.push(`/deck#d=${await encodeDeck(d)}`);
  }

  const locale = lang === "ku" ? "tr" : lang;
  const since = new Date(user.created_at).toLocaleDateString(locale, { year: "numeric", month: "long" });
  const display = savedName || user.email?.split("@")[0] || "";

  return (
    <main className="container page">
      <section className="profile-hero panel">
        <div className="avatar xl" aria-hidden>
          {display.slice(0, 1).toUpperCase()}
        </div>
        <div className="profile-id">
          <h1 className="h2">{display}</h1>
          <p className="muted small">
            {user.email} · {t("profile.since", { d: since })}
          </p>
        </div>
        <dl className="profile-stats">
          <div>
            <dt>{stats?.decks ?? "–"}</dt>
            <dd>{t("profile.stats.decks")}</dd>
          </div>
          <div>
            <dt>{stats?.cards ?? "–"}</dt>
            <dd>{t("profile.stats.cards")}</dd>
          </div>
          <div>
            <dt>{favorites.length}</dt>
            <dd>{t("profile.favs")}</dd>
          </div>
        </dl>
      </section>

      <div className="profile-layout">
        <div>
          <div className="tabs small wide" role="tablist">
            <button role="tab" aria-selected={tab === "favs"} className={tab === "favs" ? "on" : ""} onClick={() => setTab("favs")}>
              {t("profile.tab.favs")} <span className="count">{favorites.length}</span>
            </button>
            <button role="tab" aria-selected={tab === "decks"} className={tab === "decks" ? "on" : ""} onClick={() => setTab("decks")}>
              {t("profile.tab.decks")} <span className="count">{decks?.length ?? 0}</span>
            </button>
          </div>
          {tab === "favs" ? (
            <Favorites display={display} />
          ) : !decks?.length ? (
            <div className="empty">
              {t("profile.decksEmpty")}
              <div>
                <Link href="/#create" className="btn primary">
                  {t("deck.new")}
                </Link>
              </div>
            </div>
          ) : (
            <ul className="deck-list">
              {decks.map((d) => (
                <li key={d.id}>
                  <button onClick={() => openDeck(d.deck)}>
                    <span className={`mode-dot ${d.mode}`}>{t(`tab.${d.mode}` as TKey)}</span>
                    <strong>{d.title}</strong>
                    <span className="muted small">
                      {t("deck.cards", { n: d.card_count })} ·{" "}
                      {new Date(d.created_at).toLocaleDateString(locale, { day: "numeric", month: "short" })}
                    </span>
                    <span className="open">{t("profile.open")} →</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="profile-side">
          <div className="panel">
            <label>
              <span className="label">{t("profile.name")}</span>
              <input className="field" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} />
            </label>
            <button className="btn ghost block-sm" onClick={saveName} disabled={name.trim() === savedName}>
              {t("profile.save")}
            </button>
            <button
              className="btn ghost danger block-sm"
              onClick={async () => {
                await supabase?.auth.signOut();
                router.push("/");
              }}
            >
              {t("profile.signout")}
            </button>
          </div>
          <KurdolingoPromo variant="deck" place="profile" />
        </aside>
      </div>
    </main>
  );
}

function Favorites({ display }: { display: string }) {
  const { t } = useI18n();
  const { favorites, removeFavs } = useAuth();
  const toast = useToast();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Drop selections for favorites that no longer exist.
  useEffect(() => {
    setSelected((s) => new Set([...s].filter((id) => favorites.some((f) => f.id === id))));
  }, [favorites]);

  if (!favorites.length)
    return (
      <div className="empty">
        {t("profile.empty")}
        <div>
          <Link href="/#create" className="btn primary">
            {t("deck.new")}
          </Link>
        </div>
      </div>
    );

  const allOn = selected.size === favorites.length;
  const chosen = favorites.filter((f) => selected.has(f.id));
  const toggle = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <>
      <div className="fav-bar">
        <label className="check">
          <input type="checkbox" checked={allOn} onChange={() => setSelected(allOn ? new Set() : new Set(favorites.map((f) => f.id)))} />
          {selected.size ? t("profile.selected", { n: selected.size }) : t("profile.all")}
        </label>
        <div className="actions">
          <DownloadMenu cards={chosen.length ? chosen : favorites} title={display ? `${display} — Cardo` : "Cardo"} label={t("profile.download")} />
          <button
            className="btn ghost danger"
            disabled={!selected.size}
            onClick={() => {
              if (!confirm(t("profile.confirm", { n: selected.size }))) return;
              removeFavs([...selected]);
              toast(t("toast.removed"));
            }}
          >
            {t("profile.delete")}
          </button>
        </div>
      </div>

      <ul className="fav-grid">
        {favorites.map((f) => (
          <li key={f.id} className={selected.has(f.id) ? "sel" : ""}>
            <label className="fav-check">
              <input type="checkbox" checked={selected.has(f.id)} onChange={() => toggle(f.id)} aria-label={f.ku} />
            </label>
            <div className="fav-body">
              <div className="fav-top">
                <b className="ku">{f.ku}</b>
                <span className="pos">{f.pos}</span>
              </div>
              <div className="mean">{f.meaning}</div>
              {f.example_ku && (
                <p className="ex">
                  <i>{f.example_ku}</i>
                  <br />
                  {f.example_tr}
                </p>
              )}
            </div>
            <div className="fav-tools">
              <DownloadMenu cards={[f]} title={f.ku} label={t("profile.download")} compact />
              <button
                className="icon-btn"
                onClick={() => {
                  removeFavs([f.id]);
                  toast(t("toast.removed"));
                }}
                aria-label={t("fav.remove")}
                title={t("fav.remove")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
