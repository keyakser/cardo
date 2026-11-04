"use client";

import { useEffect, useRef, useState } from "react";
import { downloadCsv, downloadJpg, downloadPdf } from "@/lib/export";
import type { Card } from "@/lib/types";

export default function DownloadMenu({
  cards,
  title,
  label,
  compact,
  disabled,
}: {
  cards: Card[];
  title: string;
  label: string;
  compact?: boolean;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  async function run(kind: "jpg" | "pdf" | "csv") {
    setOpen(false);
    setBusy(true);
    try {
      await document.fonts?.ready;
      if (kind === "jpg") await downloadJpg(cards, title);
      else if (kind === "pdf") await downloadPdf(cards, title);
      else downloadCsv(cards, title);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="menu" ref={ref}>
      <button
        className={compact ? "icon-btn" : "btn ghost"}
        onClick={() => setOpen((o) => !o)}
        disabled={disabled || busy || !cards.length}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        title={label}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
        </svg>
        {!compact && <span>{busy ? "…" : label}</span>}
      </button>
      {open && (
        <div className="menu-pop" role="menu">
          <button role="menuitem" onClick={() => run("jpg")}>JPG</button>
          <button role="menuitem" onClick={() => run("pdf")}>PDF</button>
          <button role="menuitem" onClick={() => run("csv")}>CSV</button>
        </div>
      )}
    </div>
  );
}
