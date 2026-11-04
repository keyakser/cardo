import { ImageResponse } from "next/og";

export const alt = "Cardo: Kurdish Cards";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const WORDMARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -70 512 186"><g fill="none" stroke="#141210" stroke-width="22"><path d="M87.9 24.9A39 39 0 1 0 87.9 75.1"/><circle cx="164" cy="50" r="39"/><path d="M203 0V100"/><path d="M241 0V100M241 50A39 39 0 0 1 280 11"/><circle cx="347" cy="50" r="39"/><path d="M386 -62V100"/></g><path transform="rotate(-8 455 50)" fill="#e4421b" fill-rule="evenodd" d="M429 -4H481A16 16 0 0 1 497 12V88A16 16 0 0 1 481 104H429A16 16 0 0 1 413 88V12A16 16 0 0 1 429 -4ZM437 50a18 18 0 1 0 36 0a18 18 0 1 0 -36 0Z"/></svg>`;

const card = (bg: string, rotate: number, left: number, top: number, w: number, hole: boolean) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      width: w,
      height: Math.round((w * 380) / 300),
      borderRadius: 24,
      background: bg,
      transform: `rotate(${rotate}deg)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {hole && <div style={{ width: w * 0.28, height: w * 0.28, borderRadius: 999, background: "#f3efe6" }} />}
  </div>
);

// Link preview shown when someone shares a Cardo URL.
export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#f3efe6", padding: 72 }}>
        {card("#8c8519", 9, 760, 210, 150, true)}
        {card("#e58bcb", -14, 860, 110, 190, true)}
        {card("#6a9cc8", 9, 980, 190, 200, true)}
        {card("#e4421b", -8, 880, 200, 220, true)}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", width: 660 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`data:image/svg+xml;utf8,${encodeURIComponent(WORDMARK)}`} width={300} height={109} alt="" />
          <div style={{ display: "flex", flexDirection: "column", fontSize: 78, fontWeight: 800, color: "#141210", lineHeight: 1, letterSpacing: -3 }}>
            <span>Everything has a</span>
            <span style={{ display: "flex" }}>
              <span style={{ color: "#e4421b" }}>Kurdish</span>&nbsp;name.
            </span>
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#5e574c", letterSpacing: 4 }}>KURDISH CARDS · BY KURDOLINGO</div>
        </div>
      </div>
    ),
    size,
  );
}
