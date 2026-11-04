"use client";

import { useI18n, type TKey } from "@/lib/i18n";
import { TeaScene } from "./InfoMotion";
import { TeaArt } from "./Prints";

/**
 * Looping "GIF" of the app in a phone: snap a photo → Meta Muse scans it →
 * the card appears and flips. Pure CSS keyframes on an 8 s cycle.
 */
export default function HeroDemo() {
  const { t } = useI18n();
  return (
    <div className="hero-demo" aria-hidden>
      <div className="demo-phone">
        <div className="demo-notch" />
        <div className="demo-screen">
          <div className="demo-steps mono">
            <span className="ds ds1">01 · {t("anim.step1" as TKey)}</span>
            <span className="ds ds2">02 · {t("anim.step2" as TKey)}</span>
            <span className="ds ds3">03 · {t("anim.step3" as TKey)}</span>
          </div>

          {/* 1–2: camera view, then scanning */}
          <div className="demo-cam">
            <svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice">
              <g filter="url(#kc-grain)">
                <TeaScene />
              </g>
            </svg>
            <span className="demo-corners" />
            <span className="demo-scan" />
            <span className="demo-box db1" />
            <span className="demo-box db2" />
            <span className="demo-chip mono">
              Meta Muse <i />
              <i />
              <i />
            </span>
            <span className="demo-flash" />
          </div>
          <span className="demo-shutter" />

          {/* 3: the card, which flips */}
          <div className="demo-card">
            <div className="demo-card-inner">
              <div className="demo-face demo-front">
                <span className="demo-art">
                  <TeaArt />
                </span>
                <strong>çay</strong>
              </div>
              <div className="demo-face demo-back">
                <strong>{t("print.cay.mean" as TKey)}</strong>
                <span className="demo-ex">
                  <b>Em her sibê çayê vedixwin.</b>
                  {t("print.cay.ex" as TKey)}
                </span>
              </div>
            </div>
          </div>
          <div className="demo-chips">
            {["şekir", "kevçî", "îskan"].map((w, i) => (
              <span key={w} className={`dc dc${i}`}>
                {w}
              </span>
            ))}
          </div>
        </div>
      </div>
      <span className="demo-shadow" />
    </div>
  );
}
