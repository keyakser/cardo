"use client";

import { useEffect, useRef, useState } from "react";
import Creator from "@/components/Creator";
import Features from "@/components/Features";
import HeroDemo from "@/components/HeroDemo";
import WordOfDay from "@/components/WordOfDay";
import InfoMotion from "@/components/InfoMotion";
import Faq from "@/components/Faq";
import KurdolingoPromo from "@/components/KurdolingoPromo";
import Link from "next/link";
import { SET_ART } from "@/components/SetArt";
import { SETS } from "@/lib/sets";
import { AppleArt, BreadArt, CatArt, GrainDefs, MountainArt, TeaArt } from "@/components/Prints";
import { useI18n, type TKey } from "@/lib/i18n";

type Print = { id: string; ku: string; art: () => React.ReactElement; tagColor: string; ex: string };

// The hero "print series"; tags, meanings and translations live in lib/locales/extra.ts.
const PRINTS: Print[] = [
  { id: "sev", ku: "sêv", art: AppleArt, tagColor: "blue", ex: "Ez sêvekê dixwim." },
  { id: "cay", ku: "çay", art: TeaArt, tagColor: "pink", ex: "Em her sibê çayê vedixwin." },
  { id: "pisik", ku: "pisîk", art: CatArt, tagColor: "olive", ex: "Pisîk li ber pencereyê radizê." },
  { id: "nan", ku: "nan", art: BreadArt, tagColor: "orange", ex: "Dayika min nan çêdike." },
  { id: "ciya", ku: "çiya", art: MountainArt, tagColor: "blue", ex: "Çiya bilind û spî ne." },
];

function go(mode: "photo" | "topic") {
  window.dispatchEvent(new CustomEvent("kc-mode", { detail: mode }));
  document.getElementById("create")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function PrintCard({ p, n }: { p: Print; n: number }) {
  const { t } = useI18n();
  const [flipped, setFlipped] = useState(false);
  const Art = p.art;
  const k = (f: "tag" | "mean" | "ex") => t(`print.${p.id}.${f}` as TKey);
  return (
    <article className="print" data-i={n}>
      <button className={`print-flip ${flipped ? "flipped" : ""}`} onClick={() => setFlipped((f) => !f)} aria-label={`${p.ku} — ${k("mean")}`}>
        <span className="print-inner">
          <span className="print-face print-front">
            <Art />
          </span>
          <span className={`print-face print-back ink-${p.tagColor}`}>
            <span className="mono">{p.ku}</span>
            <strong className="print-mean">{k("mean")}</strong>
            <span className="print-ex">
              <b>{p.ex}</b>
              <span>{k("ex")}</span>
            </span>
          </span>
        </span>
      </button>
      <div className="print-meta">
        <span className="mono print-n">{String(n + 1).padStart(2, "0")}</span>
        <div>
          <h3 className="print-word">{p.ku}</h3>
          <p className="print-desc">
            {k("mean")} — <i>{p.ex}</i>
          </p>
          <span className={`pill pill-${p.tagColor}`}>{k("tag")}</span>
        </div>
      </div>
    </article>
  );
}

function PrintRail() {
  const { t } = useI18n();
  const rail = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const onScroll = () => setProgress(el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth));
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  function jump(i: number) {
    const el = rail.current;
    const card = el?.querySelector<HTMLElement>(`[data-i="${i}"]`);
    if (el && card) el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2, behavior: "smooth" });
  }

  const active = Math.round(progress * (PRINTS.length - 1));

  return (
    <>
      <div className="rail" ref={rail} tabIndex={0} aria-label={t("hero.flip")}>
        {PRINTS.map((p, i) => (
          <PrintCard key={p.ku} p={p} n={i} />
        ))}
      </div>
      <div className="container">
        <div className="timeline" aria-hidden>
          <div className="timeline-line" />
          <div className="timeline-fill" style={{ width: `${progress * 100}%` }} />
          <div className="timeline-dot" style={{ left: `${progress * 100}%` }} />
          {PRINTS.map((p, i) => (
            <button key={p.ku} className={`tick ${i === active ? "on" : ""}`} style={{ left: `${(i / (PRINTS.length - 1)) * 100}%` }} onClick={() => jump(i)} tabIndex={-1}>
              <span className="mono">{String(i + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
        <div className="colophon mono">
          <span>{t("hero.series")}</span>
          <span>{t("hero.made")}</span>
        </div>
      </div>
    </>
  );
}

export default function Home() {
  const { t, lang } = useI18n();

  return (
    <main>
      <GrainDefs />
      <section className="hero">
        <div className="container hero-top">
          <h1 className="display hero-title">
            <span>{t("hero.l1")}</span>
            <em>{t("hero.l2")}</em>
            <span>{t("hero.l3")}</span>
          </h1>
          <HeroDemo />
          <div className="hero-side">
            <p className="lead">{t("hero.lead")}</p>
            <div className="hero-ctas">
              <button className="btn signal lg" onClick={() => go("photo")}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                {t("hero.cta")}
              </button>
              <button className="btn ghost lg" onClick={() => go("topic")}>
                {t("hero.cta2")}
              </button>
            </div>
            <p className="mono scroll-hint">
              {t("hero.scroll")} <span aria-hidden>⟶</span>
            </p>
          </div>
        </div>
        <PrintRail />
      </section>

      <WordOfDay />

      <section className="container section">
        <h2 className="h2 section-title">{t("how.title")}</h2>
        <ol className="steps">
          {([1, 2, 3] as const).map((n, i) => (
            <li key={n} className={`step-${["blue", "pink", "olive"][i]}`}>
              <span className="step-n">0{n} —</span>
              <h3 className="h3">{t(`how.${n}t`)}</h3>
              <p className="muted">{t(`how.${n}d`)}</p>
            </li>
          ))}
        </ol>
      </section>

      <InfoMotion />

      <Features />

      <section className="container section sets-strip">
        <div className="sets-strip-head">
          <div>
            <span className="mono accent-text">{t("nav.sets")}</span>
            <h2 className="h2">{t("sets.title")}</h2>
            <p className="muted">{t("sets.sub")}</p>
          </div>
          <Link href="/sets" className="btn ghost lg">
            {t("sets.cta")} →
          </Link>
        </div>
        <ul className="sets-mini">
          {SETS.slice(0, 5).map((s) => {
            const Art = SET_ART[s.id];
            return (
              <li key={s.id}>
                <Link href={`/sets/${s.id}`}>
                  <Art />
                  <span>{s.name[lang] || s.name.en}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="band">
        <div className="container band-grid">
          <div>
            <span className="mono accent-text">{t("hero.kicker")}</span>
            <h2 className="h2">{t("why.title")}</h2>
            <p className="muted lead-sm">{t("why.body")}</p>
          </div>
          <dl className="stats two">
            <div>
              <dt>14</dt>
              <dd>{t("why.s1")}</dd>
            </div>
            <div>
              <dt>3</dt>
              <dd>{t("why.s2")}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section id="create" className="container section narrow">
        <h2 className="h2 section-title center">{t("create.title")}</h2>
        <p className="muted center sub">{t("create.sub")}</p>
        <Creator />
      </section>

      <Faq />

      <section className="container section-tight">
        <KurdolingoPromo variant="section" place="home" />
      </section>
    </main>
  );
}
