"use client";

import { useMemo, useRef, useState } from "react";
import KurdolingoPromo from "./KurdolingoPromo";
import { useI18n, type TKey } from "@/lib/i18n";
import type { Card } from "@/lib/types";

type Q = { kind: "mc" | "pic" | "spell"; card: Card; options: string[]; answer: string };

const KU_KEYS = ["ç", "ê", "î", "ş", "û"];
const norm = (s: string) => s.toLocaleLowerCase("ku").normalize("NFC").replace(/[.!?,]/g, "").replace(/\s+/g, " ").trim();

function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

// Up to 10 questions: meaning (multiple choice), picture → word (when the card has art), and spelling.
function buildQuiz(cards: Card[]): Q[] {
  const pool = shuffle(cards).slice(0, 10);
  const kinds: Q["kind"][] = ["mc", "pic", "spell"];
  return pool.map((card, i) => {
    let kind = kinds[i % 3];
    if (kind === "pic" && !card.img) kind = "mc";
    const others = shuffle(cards.filter((c) => c !== card));
    if (kind === "mc") {
      const opts = shuffle([card.meaning, ...others.map((c) => c.meaning).filter((m) => m !== card.meaning).slice(0, 3)]);
      return { kind, card, options: opts, answer: card.meaning };
    }
    if (kind === "pic") {
      const opts = shuffle([card.ku, ...others.map((c) => c.ku).filter((k) => k !== card.ku).slice(0, 3)]);
      return { kind, card, options: opts, answer: card.ku };
    }
    return { kind, card, options: [], answer: card.ku };
  });
}

export default function Quiz({ cards }: { cards: Card[] }) {
  const { t } = useI18n();
  const [quiz, setQuiz] = useState<Q[] | null>(null);
  const [n, setN] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [score, setScore] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const canQuiz = cards.length >= 4;
  const total = useMemo(() => Math.min(10, cards.length), [cards.length]);

  function start() {
    setQuiz(buildQuiz(cards));
    setN(0);
    setPicked(null);
    setTyped("");
    setScore(0);
  }

  if (!canQuiz) return <div className="empty">{t("quiz.need" as TKey)}</div>;

  if (!quiz)
    return (
      <div className="quiz quiz-intro">
        <h3 className="h3">{t("quiz.tab" as TKey)}</h3>
        <p className="muted">{t("quiz.intro" as TKey, { n: total })}</p>
        <button className="btn primary lg" onClick={start}>
          {t("quiz.begin" as TKey)}
        </button>
      </div>
    );

  if (n >= quiz.length)
    return (
      <div className="done">
        <div className="done-mark">{score}</div>
        <h2 className="h3">{t("study.done")}</h2>
        <p className="muted">{t("quiz.score" as TKey, { n: score, total: quiz.length })}</p>
        <button className="btn primary" onClick={start}>
          {t("quiz.again" as TKey)}
        </button>
        <KurdolingoPromo variant="done" place="quiz-finished" />
      </div>
    );

  const q = quiz[n];
  const answered = picked !== null;
  const right = answered && norm(picked!) === norm(q.answer);

  function choose(v: string) {
    if (answered) return;
    setPicked(v);
    if (norm(v) === norm(q.answer)) setScore((s) => s + 1);
  }

  function next() {
    setN((x) => x + 1);
    setPicked(null);
    setTyped("");
  }

  function addKey(k: string) {
    setTyped((v) => v + k);
    inputRef.current?.focus();
  }

  const prompt = q.kind === "mc" ? t("quiz.qMc" as TKey) : q.kind === "pic" ? t("quiz.qPic" as TKey) : t("quiz.qSpell" as TKey);

  return (
    <div className="quiz">
      <div className="quiz-top">
        <span className="mono muted">{t("quiz.progress" as TKey, { n: n + 1, total: quiz.length })}</span>
        <div className="progress" aria-hidden>
          <div style={{ width: `${(n / quiz.length) * 100}%` }} />
        </div>
      </div>

      <div className="quiz-q">
        <p className="mono quiz-kind">{prompt}</p>
        {q.kind === "mc" && <p className="quiz-word">{q.card.ku}</p>}
        {q.kind === "pic" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="quiz-art" src={q.card.img} alt="" />
        )}
        {q.kind === "spell" && (
          <div className="quiz-spell-cue">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {q.card.img && <img className="quiz-art sm" src={q.card.img} alt="" />}
            <p className="quiz-word sm">{q.card.meaning}</p>
          </div>
        )}
      </div>

      {q.kind !== "spell" ? (
        <div className="quiz-options" role="group" aria-label={prompt}>
          {q.options.map((o) => {
            const state = !answered ? "" : norm(o) === norm(q.answer) ? "is-right" : o === picked ? "is-wrong" : "is-dim";
            return (
              <button key={o} className={`quiz-opt ${state}`} onClick={() => choose(o)} disabled={answered} lang={q.kind === "pic" ? "ku" : undefined}>
                {o}
              </button>
            );
          })}
        </div>
      ) : (
        <form
          className="quiz-spell"
          onSubmit={(e) => {
            e.preventDefault();
            if (!answered && typed.trim()) choose(typed);
          }}
        >
          <input
            ref={inputRef}
            className={`field quiz-input ${answered ? (right ? "is-right" : "is-wrong") : ""}`}
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder={t("quiz.typeHere" as TKey)}
            aria-label={t("quiz.typeHere" as TKey)}
            lang="ku"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            disabled={answered}
          />
          <div className="ku-keys">
            {KU_KEYS.map((k) => (
              <button type="button" key={k} className="ku-key" onClick={() => addKey(k)} disabled={answered}>
                {k}
              </button>
            ))}
          </div>
          {!answered && (
            <button className="btn primary" disabled={!typed.trim()}>
              {t("quiz.check" as TKey)}
            </button>
          )}
        </form>
      )}

      {answered && (
        <div className={`quiz-feedback ${right ? "ok" : "no"}`} role="status">
          <strong>{right ? t("quiz.correct" as TKey) : t("quiz.wrong" as TKey, { a: q.answer })}</strong>
          {q.card.example_ku && (
            <span className="muted">
              <b>{q.card.example_ku}</b> {q.card.example_tr}
            </span>
          )}
          <button className="btn primary" onClick={next} autoFocus>
            {n + 1 >= quiz.length ? t("quiz.finish" as TKey) : t("quiz.next" as TKey)}
          </button>
        </div>
      )}
    </div>
  );
}
