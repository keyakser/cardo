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
import { deckKey, loadArt, saveArt } from "@/lib/art";
import { illustrate, useIllustrateError } from "@/components/IllustrateButton";

export default function DeckPage() {
  const { t } = useI18n();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [key, setKey] = useState("");
  const [state, setState] = useState<"loading" | "ok" | "missing">("loading");

  useEffect(() => {
    const load = () => {
      const m = location.hash.match(/d=([\w-]+)/);
      if (!m) return setState("missing");
      decodeDeck(m[1]).then((d) => {
        const k = deckKey(m[1]);
        // Pictures made in this browser (SAM cut-outs, Muse Image drawings).
        const art = loadArt(k);
        if (d) d = { ...d, cards: d.cards.map((c, i) => (c.img || !art[i] ? c : { ...c, img: art[i] })) };
        setKey(k);
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

  return <DeckView key={key} deck={deck} artKey={key} />;
}

function DeckView({ deck: initial, artKey }: { deck: Deck; artKey: string }) {
  const { t } = useI18n();
  const toast = useToast();
  const errMsg = useIllustrateError();
  const [deck, setDeck] = useState(initial);
  const [drawing, setDrawing] = useState(0);
  // AI decks (not ready-made sets) can get Muse Image pictures on demand.
  const canDraw = !initial.cards.some((c) => c.img?.startsWith("/sets/"));
  const missing = deck.cards.filter((c) => !c.img).length;

  function setArt(i: number, img: string) {
    setDeck((d) => {
      const cards = d.cards.map((c, j) => (j === i ? { ...c, img } : c));
      const art: Record<number, string> = {};
      cards.forEach((c, j) => c.img?.startsWith("data:") && (art[j] = c.img));
      saveArt(artKey, art);
      return { ...d, cards };
    });
  }

  async function drawAll() {
    const todo = deck.cards.map((c, i) => (c.img ? -1 : i)).filter((i) => i >= 0);
    setDrawing(todo.length);
    let failed = "";
    // Two at a time keeps us well inside the image rate limit.
    const run = async () => {
      for (let i = todo.shift(); i !== undefined; i = todo.shift()) {
        try {
          setArt(i, await illustrate(deck.cards[i]));
        } catch (e) {
          failed = errMsg(e);
        }
        setDrawing((n) => n - 1);
      }
    };
    await Promise.all([run(), run()]);
    setDrawing(0);
    if (failed) toast(failed);
  }
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
          {canDraw && missing > 0 && (
            <button className="btn ghost" onClick={drawAll} disabled={drawing > 0}>
              {drawing > 0 ? <span className="spinner">{t("art.drawingN" as TKey, { n: drawing })}</span> : t("art.drawAll" as TKey)}
            </button>
          )}
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

      {tab === "study" ? <Study cards={deck.cards} lang={deck.lang} onArt={canDraw ? setArt : undefined} /> : tab === "quiz" ? <Quiz cards={deck.cards} /> : <List cards={deck.cards} lang={deck.lang} onArt={canDraw ? setArt : undefined} />}

      <div className="deck-promo">
        <KurdolingoPromo variant="deck" place="deck" />
      </div>
    </main>
  );
}
