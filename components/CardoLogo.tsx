// Cardo wordmark: geometric "card" letters in the current text colour and the
// tilted orange card standing in for the "o". Same geometry as the design
// system's assets/Logos/cardo-wordmark-*.svg.
export function CardoWordmark({ height = 26, title = "Cardo" }: { height?: number; title?: string }) {
  return (
    <svg className="cardo-wordmark" viewBox="0 -70 512 186" height={height} width={(height * 512) / 186} role="img" aria-label={title}>
      <g fill="none" stroke="currentColor" strokeWidth="22">
        <path d="M87.9 24.9A39 39 0 1 0 87.9 75.1" />
        <circle cx="164" cy="50" r="39" />
        <path d="M203 0V100" />
        <path d="M241 0V100M241 50A39 39 0 0 1 280 11" />
        <circle cx="347" cy="50" r="39" />
        <path d="M386 -62V100" />
      </g>
      <path
        className="cardo-card"
        transform="rotate(-8 455 50)"
        fillRule="evenodd"
        d="M429 -4H481A16 16 0 0 1 497 12V88A16 16 0 0 1 481 104H429A16 16 0 0 1 413 88V12A16 16 0 0 1 429 -4ZM437 50a18 18 0 1 0 36 0a18 18 0 1 0 -36 0Z"
      />
    </svg>
  );
}

/** The two-card mark (favicon / avatar size). */
export function CardoMark({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} aria-hidden>
      <rect x="78" y="34" width="96" height="124" rx="18" transform="rotate(9 126 96)" fill="#6a9cc8" />
      <path
        className="cardo-card"
        transform="rotate(-8 92 108)"
        fillRule="evenodd"
        d="M62 46H122A18 18 0 0 1 140 64V152A18 18 0 0 1 122 170H62A18 18 0 0 1 44 152V64A18 18 0 0 1 62 46ZM71 108a21 21 0 1 0 42 0a21 21 0 1 0 -42 0Z"
      />
    </svg>
  );
}
