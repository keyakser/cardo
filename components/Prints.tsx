// Risograph-style illustrations drawn in SVG. Each print is a flat colour
// field with two or three "inks"; the shared grain filter eats small holes
// into the ink and roughens its edges like a real riso print.

export const INK = {
  blue: "#6a9cc8",
  pink: "#e58bcb",
  olive: "#8c8519",
  orange: "#f04e1f",
  black: "#1a1714",
  paper: "#f1e3c8",
};

export function GrainDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
      <defs>
        <filter id="kc-grain" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  7 0 0 0 -1.55" result="speckle" />
          <feComposite in="SourceGraphic" in2="speckle" operator="in" result="grainy" />
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="2" result="warp" />
          <feDisplacementMap in="grainy" in2="warp" scale="4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="kc-paper" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="1" seed="11" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -9 0 0 0 3.2" result="dots" />
          <feComposite in="SourceGraphic" in2="dots" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}

export function Frame({ bg, children, label }: { bg: string; children: React.ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 300 380" className="print-svg" role="img" aria-label={label}>
      <rect width="300" height="380" fill={bg} />
      <rect width="300" height="380" fill="#fff6e6" opacity="0.5" filter="url(#kc-paper)" />
      <g filter="url(#kc-grain)">{children}</g>
    </svg>
  );
}

export function AppleArt() {
  return (
    <Frame bg={INK.blue} label="sêv — apple">
      <ellipse cx="150" cy="300" rx="78" ry="12" fill={INK.black} opacity="0.85" />
      <path d="M150 128C110 98 58 124 64 196c5 66 48 104 86 92 38 12 81-26 86-92 6-72-46-98-86-68z" fill={INK.orange} />
      <path d="M150 128c-14-10-30-14-46-12 12 30 30 40 46 40z" fill={INK.black} opacity="0.9" />
      <path d="M96 170c-6 26 0 54 16 70" stroke={INK.paper} strokeWidth="12" strokeLinecap="round" fill="none" />
      <rect x="145" y="78" width="10" height="56" rx="4" fill={INK.black} transform="rotate(12 150 106)" />
      <path d="M160 102c18-34 58-38 74-24-14 30-48 40-74 24z" fill={INK.olive} />
      <path d="M168 98c18-10 36-14 52-14" stroke={INK.black} strokeWidth="3" fill="none" />
    </Frame>
  );
}

export function TeaArt() {
  return (
    <Frame bg={INK.pink} label="çay — tea">
      <ellipse cx="150" cy="300" rx="104" ry="22" fill={INK.olive} />
      <ellipse cx="150" cy="294" rx="104" ry="22" fill={INK.black} />
      <ellipse cx="150" cy="290" rx="80" ry="14" fill={INK.olive} />
      {/* tulip glass */}
      <path d="M104 120h92c0 30-22 52-22 82s26 48 26 78H100c0-30 26-48 26-78s-22-52-22-82z" fill={INK.paper} opacity="0.75" />
      <path d="M110 150h80c-4 22-16 34-16 52s22 40 24 74H102c2-34 24-56 24-74s-12-30-16-52z" fill={INK.orange} />
      <path d="M110 150h80" stroke={INK.paper} strokeWidth="6" />
      <path d="M104 120h92" stroke={INK.black} strokeWidth="6" strokeLinecap="round" />
      <path d="M128 176c-4 20 0 50-8 84" stroke={INK.paper} strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.8" />
      {/* steam */}
      <path d="M130 100c-10-14 10-22 0-36M152 104c-10-16 12-26 0-44M174 100c-10-14 10-22 0-36" stroke={INK.black} strokeWidth="5" strokeLinecap="round" strokeDasharray="10 9" fill="none" />
      {/* sugar cubes */}
      <rect x="208" y="262" width="24" height="24" fill={INK.paper} transform="rotate(-8 220 274)" />
      <rect x="226" y="246" width="20" height="20" fill={INK.paper} transform="rotate(14 236 256)" />
    </Frame>
  );
}

export function CatArt() {
  return (
    <Frame bg={INK.olive} label="pisîk — cat">
      <rect x="0" y="0" width="120" height="380" fill={INK.orange} opacity="0.9" />
      <path d="M232 300c40-10 46-70 6-82" stroke={INK.black} strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M96 318c-6-70 6-128 54-138 52-10 92 34 88 138z" fill={INK.paper} />
      <path d="M190 190c26 14 44 50 48 128h-40c6-40 4-90-8-128z" fill={INK.black} />
      <circle cx="140" cy="150" r="48" fill={INK.paper} />
      <path d="M100 128l-4-56 40 32zM180 128l4-56-40 32z" fill={INK.black} />
      <path d="M150 104c22 0 38 14 36 34-14-6-24-18-36-34z" fill={INK.black} />
      <circle cx="124" cy="150" r="7" fill={INK.orange} />
      <circle cx="158" cy="150" r="7" fill={INK.orange} />
      <path d="M134 170l7 6 7-6" stroke={INK.black} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M100 172h-30M102 182l-26 8M180 172h30M178 182l26 8" stroke={INK.black} strokeWidth="3" strokeLinecap="round" />
      <path d="M120 318v-34M160 318v-34" stroke={INK.black} strokeWidth="4" strokeLinecap="round" />
    </Frame>
  );
}

export function BreadArt() {
  return (
    <Frame bg={INK.orange} label="nan — bread">
      <ellipse cx="150" cy="292" rx="110" ry="16" fill={INK.black} opacity="0.9" />
      <path d="M44 250c0-78 48-122 106-122s106 44 106 122c0 26-22 34-106 34S44 276 44 250z" fill={INK.paper} />
      <path d="M44 250c0 26 22 34 106 34s106-8 106-34c-30 14-182 14-212 0z" fill={INK.pink} />
      <path d="M92 196l36-36M132 206l40-44M176 210l34-36" stroke={INK.orange} strokeWidth="12" strokeLinecap="round" />
      <path d="M232 112c-10-40 4-68 10-80" stroke={INK.olive} strokeWidth="6" strokeLinecap="round" fill="none" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <ellipse cx={238 - i * 2} cy={44 + i * 16} rx="6" ry="11" fill={INK.olive} transform={`rotate(-30 ${238 - i * 2} ${44 + i * 16})`} />
          <ellipse cx={248 - i * 2} cy={50 + i * 16} rx="6" ry="11" fill={INK.olive} transform={`rotate(30 ${248 - i * 2} ${50 + i * 16})`} />
        </g>
      ))}
    </Frame>
  );
}

export function MountainArt() {
  return (
    <Frame bg={INK.paper} label="çiya — mountain">
      <circle cx="196" cy="128" r="58" fill={INK.orange} />
      <path d="M-10 330L96 150l70 110 40-56 114 126z" fill={INK.blue} />
      <path d="M96 150l-26 44 16 -6 12 14 14-12 12 8z" fill={INK.paper} />
      <path d="M206 204l-16 22 12-4 8 10 10-8 10 4z" fill={INK.paper} />
      <path d="M-10 380V300c50-30 90-8 140-26s110-36 180 6v100z" fill={INK.black} />
      <path d="M-10 380v-40c60-14 110 6 170-8s100-22 150-4v52z" fill={INK.olive} />
      <path d="M40 92h40M54 104h26M226 64h36" stroke={INK.black} strokeWidth="4" strokeLinecap="round" />
    </Frame>
  );
}
