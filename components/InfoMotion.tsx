"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n, type TKey } from "@/lib/i18n";
import { INK } from "./Prints";

// Animated infographic: photo → Muse → cards loop, the Hawar alphabet ticker,
// and a few counted-up facts about Kurdish. Pure SVG/CSS, no video files.

const ALPHABET = "a b c ç d e ê f g h i î j k l m n o p q r s ş t u û v w x y z".split(" ");
const SPECIAL = new Set(["ç", "ê", "î", "ş", "û"]);

function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

function Counter({ to, from = 0, suffix = "", run }: { to: number; from?: number; suffix?: string; run: boolean }) {
  const [n, setN] = useState(from);
  useEffect(() => {
    if (!run) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return setN(to);
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1400);
      setN(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to, from]);
  return (
    <>
      {n}
      {suffix}
    </>
  );
}

/** The tea-glass "photo" used in all three stages of the loop. */
export function TeaScene() {
  return (
    <g>
      <rect width="200" height="150" fill={INK.pink} />
      <ellipse cx="100" cy="122" rx="62" ry="10" fill={INK.black} />
      <ellipse cx="100" cy="118" rx="48" ry="7" fill={INK.olive} />
      <path d="M78 46h44c0 14-10 24-10 38s12 22 12 34H76c0-12 12-20 12-34s-10-24-10-38z" fill={INK.paper} opacity="0.8" />
      <path d="M81 60h38c-2 10-8 16-8 25s10 18 11 32H78c1-14 11-23 11-32s-6-15-8-25z" fill={INK.orange} />
      <path d="M78 46h44" stroke={INK.black} strokeWidth="4" strokeLinecap="round" />
      <rect x="140" y="104" width="14" height="14" fill={INK.paper} transform="rotate(-8 147 111)" />
      <path d="M30 120l14-28 12 20" stroke={INK.black} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="44" cy="92" rx="5" ry="9" fill={INK.olive} />
    </g>
  );
}

function Flow() {
  const { t } = useI18n();
  return (
    <div className="flow" aria-hidden>
      <div className="flow-stage s1">
        <span className="mono flow-n">01</span>
        <div className="phone">
          <svg viewBox="0 0 200 150" className="phone-screen">
            <g filter="url(#kc-grain)">
              <TeaScene />
            </g>
          </svg>
          <span className="flash" />
          <span className="shutter" />
        </div>
        <strong>{t("anim.step1" as TKey)}</strong>
      </div>

      <span className="flow-arrow">→</span>

      <div className="flow-stage s2">
        <span className="mono flow-n">02</span>
        <div className="scan">
          <svg viewBox="0 0 200 150" className="phone-screen">
            <g filter="url(#kc-grain)">
              <TeaScene />
            </g>
          </svg>
          <span className="scanline" />
          <span className="box b1" />
          <span className="box b2" />
          <span className="box b3" />
          <span className="thinking">
            <i />
            <i />
            <i />
          </span>
        </div>
        <strong>{t("anim.step2" as TKey)}</strong>
      </div>

      <span className="flow-arrow">→</span>

      <div className="flow-stage s3">
        <span className="mono flow-n">03</span>
        <div className="mini-cards">
          {[
            ["çay", INK.blue],
            ["şekir", INK.pink],
            ["kevçî", INK.olive],
          ].map(([w, c], i) => (
            <span key={w} className={`mini-card m${i}`} style={{ ["--c" as string]: c }}>
              {w}
            </span>
          ))}
        </div>
        <strong>{t("anim.step3" as TKey)}</strong>
      </div>
    </div>
  );
}

export default function InfoMotion() {
  const { t } = useI18n();
  const [factsRef, seen] = useInView<HTMLDivElement>();

  return (
    <section className="info-motion" id="how">
      <div className="container">
        <div className="features-head">
          <div>
            <span className="mono accent-text">{t("anim.kicker" as TKey)}</span>
            <h2 className="h2">{t("anim.title" as TKey)}</h2>
          </div>
          <p className="muted">{t("anim.sub" as TKey)}</p>
        </div>

        <Flow />

        <div className="ticker" dir="ltr" aria-label={t("anim.alphabet" as TKey)}>
          <div className="ticker-track">
            {[...ALPHABET, ...ALPHABET].map((l, i) => (
              <span key={i} className={SPECIAL.has(l) ? "sp" : ""} aria-hidden={i >= ALPHABET.length}>
                <a href={`/alphabet#l-${i % ALPHABET.length}`} tabIndex={i >= ALPHABET.length ? -1 : undefined}>
                  {l.toUpperCase()}
                  {l}
                </a>
              </span>
            ))}
          </div>
        </div>

        <div className="facts" ref={factsRef}>
          <div className="fact f-blue">
            <strong className="fact-n">
              <Counter to={31} run={seen} />
            </strong>
            <span className="fact-t">{t("anim.f1t" as TKey)}</span>
            <p>{t("anim.f1d" as TKey)}</p>
          </div>
          <div className="fact f-pink">
            <strong className="fact-n">
              <Counter from={1900} to={1932} run={seen} />
            </strong>
            <span className="fact-t">{t("anim.f2t" as TKey)}</span>
            <p>{t("anim.f2d" as TKey)}</p>
          </div>
          <div className="fact f-olive">
            <strong className="fact-n">
              <Counter to={40} suffix="M+" run={seen} />
            </strong>
            <span className="fact-t">{t("anim.f3t" as TKey)}</span>
            <p>{t("anim.f3d" as TKey)}</p>
          </div>
          <div className="fact f-map">
            <svg viewBox="0 0 160 90" className="dotmap" aria-hidden>
              {Array.from({ length: 9 * 16 }).map((_, i) => {
                const x = (i % 16) * 10 + 5;
                const y = Math.floor(i / 16) * 10 + 5;
                const hot = (x - 70) ** 2 / 2.2 + (y - 42) ** 2 < 620;
                return <circle key={i} cx={x} cy={y} r={hot ? 3.2 : 1.6} className={hot ? "hot" : ""} style={{ animationDelay: `${(i % 7) * 0.25}s` }} />;
              })}
            </svg>
            <span className="fact-t">{t("anim.f4t" as TKey)}</span>
            <p>{t("anim.f4d" as TKey)}</p>
          </div>
        </div>

        <div className="purpose">
          <h3 className="h3">{t("anim.purposeT" as TKey)}</h3>
          <p>{t("anim.purposeD" as TKey)}</p>
        </div>
      </div>
    </section>
  );
}
