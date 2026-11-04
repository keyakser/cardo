"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DownloadMenu from "@/components/DownloadMenu";
import KurdolingoPromo from "@/components/KurdolingoPromo";
import { List, Study } from "@/components/DeckStudy";
import Quiz from "@/components/Quiz";
import { useToast } from "@/lib/toast";
import { useI18n, type TKey } from "@/lib/i18n";
import { decodeDeck } from "@/lib/share";
import type { Deck } from "@/lib/types";

export default function DeckPage() {
  const { t } = useI18n();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "missing">("loading");

  useEffect(() => {
    const load = () => {
      const m = location.hash.match(/d=([\w-]+)/);
      if (!m) return setState("missing");
      decodeDeck(m[1]).then((d) => {
        setDeck(d);
        setState(d ? "ok" : "missing");
      });
    };
    load();
    window.addEventListener("hashchange", load);
    return () => window.removeEventListener("hashchange", load);
  }, []);

  if (state === "loading") return <main className="container page" />;
  if (state === "missing" || !deck)
    return (
      <main className="container page center">
        <p className="muted">{t("deck.missing")}</p>
        <Link href="/#create" className="btn primary">
          {t("deck.new")}
        </Link>
      </main>
    );

  return <DeckView deck={deck} />;
}

function DeckView({ deck }: { deck: Deck }) {
  const { t } = useI18n();
  const toast = useToast();
  const [tab, setTab] = useState<"study" | "list" | "quiz">("study");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(location.search).has("new")) {
      toast(t("toast.ready"));
      history.replaceState(null, "", location.pathname + location.hash);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function share() {
    const url = location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: `Cardo: ${deck.title}`, url });
        return;
      } catch {
        /* fall back to copying */
      }
    }
    await navigator.clipboard.writeText(url);
    toast(t("toast.copied"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="container page narrow">
      <div className="deckhead">
        <div>
          <h1 className="h2">{deck.title}</h1>
          <p className="muted">
            {t("deck.cards", { n: deck.cards.length })} · {t(`level.${deck.level}` as "level.beginner")}
          </p>
        </div>
        <div className="actions">
          <button className="btn ghost" onClick={share}>
            {copied ? t("deck.copied") : t("deck.share")}
          </button>
          <DownloadMenu cards={deck.cards} title={deck.title} label={t("profile.download")} />
          <Link href="/#create" className="btn ghost">
            {t("deck.new")}
          </Link>
        </div>
      </div>

      <div className="tabs small" role="tablist">
        <button role="tab" aria-selected={tab === "study"} className={tab === "study" ? "on" : ""} onClick={() => setTab("study")}>
          {t("deck.study")}
        </button>
        <button role="tab" aria-selected={tab === "list"} className={tab === "list" ? "on" : ""} onClick={() => setTab("list")}>
          {t("deck.all")}
        </button>
        <button role="tab" aria-selected={tab === "quiz"} className={tab === "quiz" ? "on" : ""} onClick={() => setTab("quiz")}>
          {t("quiz.tab" as TKey)}
        </button>
      </div>

      {tab === "study" ? <Study cards={deck.cards} lang={deck.lang} /> : tab === "quiz" ? <Quiz cards={deck.cards} /> : <List cards={deck.cards} lang={deck.lang} />}

      <div className="deck-promo">
        <KurdolingoPromo variant="deck" place="deck" />
      </div>
    </main>
  );
}
