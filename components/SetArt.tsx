// Riso-style cover prints for the ready-made sets (same inks and grain as the hero prints).
import { Frame, INK } from "./Prints";

function Professions() {
  return (
    <Frame bg={INK.blue} label="professions">
      <ellipse cx="150" cy="306" rx="100" ry="12" fill={INK.black} opacity="0.85" />
      <path d="M118 128v-18a14 14 0 0 1 14-14h36a14 14 0 0 1 14 14v18" stroke={INK.black} strokeWidth="12" fill="none" />
      <rect x="54" y="126" width="192" height="172" rx="14" fill={INK.orange} />
      <rect x="54" y="126" width="192" height="64" rx="14" fill={INK.black} opacity="0.9" />
      <rect x="132" y="172" width="36" height="34" rx="6" fill={INK.paper} />
      <path d="M70 250h160" stroke={INK.paper} strokeWidth="6" opacity="0.6" />
      <circle cx="236" cy="96" r="26" fill={INK.olive} />
      <path d="M236 80v32M220 96h32" stroke={INK.paper} strokeWidth="7" strokeLinecap="round" />
    </Frame>
  );
}

function Family() {
  return (
    <Frame bg={INK.pink} label="family">
      <path d="M-10 380v-64h320v64z" fill={INK.olive} />
      <circle cx="92" cy="128" r="30" fill={INK.black} />
      <path d="M50 316c0-80 18-136 42-136s42 56 42 136z" fill={INK.orange} />
      <circle cx="206" cy="122" r="32" fill={INK.paper} />
      <path d="M190 106c8-16 26-20 40-8-6 12-24 16-40 8z" fill={INK.black} />
      <path d="M162 316c0-84 18-142 44-142s44 58 44 142z" fill={INK.blue} />
      <circle cx="150" cy="208" r="20" fill={INK.paper} />
      <path d="M124 316c0-52 12-86 26-86s26 34 26 86z" fill={INK.black} />
      <path d="M130 274c-20-6-30-20-34-34M170 274c20-6 30-20 34-34" stroke={INK.black} strokeWidth="8" strokeLinecap="round" fill="none" />
    </Frame>
  );
}

function Fruits() {
  return (
    <Frame bg={INK.olive} label="fruits">
      <ellipse cx="150" cy="312" rx="110" ry="12" fill={INK.black} opacity="0.85" />
      <path d="M120 300c-50 0-60-46-44-76 12-22 18-40 18-64 0-24 16-38 34-38s34 14 34 38c0 24 6 42 18 64 16 30 6 76-44 76z" fill={INK.paper} transform="translate(-8 0)" />
      <path d="M118 124c0-18 6-30 16-40" stroke={INK.black} strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M132 96c18-16 38-12 46 0-16 14-34 12-46 0z" fill={INK.pink} />
      <path d="M200 120c10 50 4 90-14 120M200 120c6 50 26 94 42 118" stroke={INK.black} strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx="186" cy="262" r="26" fill={INK.orange} />
      <circle cx="244" cy="258" r="26" fill={INK.orange} />
      <circle cx="178" cy="254" r="6" fill={INK.paper} opacity="0.8" />
      <circle cx="236" cy="250" r="6" fill={INK.paper} opacity="0.8" />
    </Frame>
  );
}

function Vegetables() {
  return (
    <Frame bg={INK.paper} label="vegetables">
      <ellipse cx="150" cy="312" rx="112" ry="12" fill={INK.black} opacity="0.85" />
      <path d="M70 140l64 150c6 12 22 10 22-4L150 120z" fill={INK.orange} transform="rotate(-18 110 200)" />
      <path d="M86 132l14 12M96 168l16 10M108 204l16 8" stroke={INK.black} strokeWidth="4" strokeLinecap="round" transform="rotate(-18 110 200)" />
      <path d="M118 120c-10-30-30-44-44-44 4 22 18 38 44 44zM124 116c4-34 22-50 38-52 0 22-14 42-38 52zM120 118c-24-16-50-14-60-4 18 12 40 14 60 4z" fill={INK.olive} transform="rotate(-18 110 200)" />
      <circle cx="210" cy="240" r="58" fill={INK.pink} />
      <circle cx="210" cy="240" r="58" fill={INK.orange} opacity="0.55" />
      <path d="M210 186l-14-14 14 6 14-6zM210 186c-16 4-28 0-34-8M210 186c16 4 28 0 34-8" stroke={INK.olive} strokeWidth="7" strokeLinecap="round" fill={INK.olive} />
      <path d="M180 226c4-14 14-22 26-24" stroke={INK.paper} strokeWidth="8" strokeLinecap="round" fill="none" />
    </Frame>
  );
}

function School() {
  return (
    <Frame bg={INK.orange} label="school">
      <rect x="60" y="96" width="150" height="200" rx="6" fill={INK.blue} />
      <rect x="60" y="96" width="24" height="200" fill={INK.black} />
      <path d="M104 140h84M104 166h84M104 192h60" stroke={INK.paper} strokeWidth="6" strokeLinecap="round" />
      <rect x="196" y="70" width="26" height="210" rx="4" fill={INK.paper} transform="rotate(16 209 175)" />
      <path d="M196 280l13 34 13-34z" fill={INK.black} transform="rotate(16 209 175)" />
      <rect x="196" y="62" width="26" height="22" fill={INK.pink} transform="rotate(16 209 175)" />
      <rect x="40" y="306" width="220" height="30" rx="3" fill={INK.paper} />
      {Array.from({ length: 10 }).map((_, i) => (
        <path key={i} d={`M${56 + i * 20} 306v${i % 2 ? 10 : 16}`} stroke={INK.black} strokeWidth="3" />
      ))}
    </Frame>
  );
}

function Hobbies() {
  return (
    <Frame bg={INK.pink} label="hobbies">
      <ellipse cx="150" cy="312" rx="100" ry="12" fill={INK.black} opacity="0.85" />
      <circle cx="140" cy="214" r="86" fill={INK.blue} />
      <path d="M70 170c40 10 100 6 150-24M60 214c50 14 120 10 164-20M70 262c46 8 104 0 146-36M108 132c-10 40-6 120 30 168M168 132c20 46 18 120-12 166" stroke={INK.black} strokeWidth="5" fill="none" opacity="0.85" />
      <path d="M196 76l64 150M232 66l20 160" stroke={INK.paper} strokeWidth="9" strokeLinecap="round" />
      <circle cx="196" cy="76" r="9" fill={INK.orange} />
      <circle cx="232" cy="66" r="9" fill={INK.orange} />
      <path d="M220 256c30 6 50 26 40 54" stroke={INK.blue} strokeWidth="6" fill="none" strokeLinecap="round" />
    </Frame>
  );
}

function Sports() {
  return (
    <Frame bg={INK.olive} label="sports">
      <ellipse cx="150" cy="318" rx="92" ry="12" fill={INK.black} opacity="0.85" />
      <circle cx="150" cy="200" r="104" fill={INK.paper} />
      <path d="M150 158l40 29-15 47h-50l-15-47z" fill={INK.black} />
      <path d="M150 158V96M190 187l56-20M175 234l34 52M125 234l-34 52M110 187l-56-20" stroke={INK.black} strokeWidth="6" />
      <path d="M150 96l-34-12M150 96l34-12M246 167l4-36M246 167l26 26M209 286l38-4M91 286l-38-4M54 167l-4-36M54 167l-26 26" stroke={INK.black} strokeWidth="6" strokeLinecap="round" />
      <path d="M60 60l30 20M240 60l-30 20M150 40v-24" stroke={INK.orange} strokeWidth="8" strokeLinecap="round" />
    </Frame>
  );
}

function Arts() {
  return (
    <Frame bg={INK.blue} label="arts">
      <path d="M150 82c-80 0-118 60-112 120 6 58 52 96 104 96 30 0 36-20 24-36-10-14-4-30 16-30h36c38 0 52-26 46-62-10-56-56-88-114-88z" fill={INK.paper} />
      <circle cx="104" cy="152" r="18" fill={INK.orange} />
      <circle cx="152" cy="126" r="18" fill={INK.pink} />
      <circle cx="204" cy="150" r="18" fill={INK.olive} />
      <circle cx="94" cy="210" r="18" fill={INK.black} />
      <circle cx="124" cy="258" r="14" fill={INK.blue} />
      <path d="M262 52L170 220" stroke={INK.black} strokeWidth="10" strokeLinecap="round" />
      <path d="M172 214c-14 4-26 18-24 40 18-2 34-12 36-30z" fill={INK.orange} />
    </Frame>
  );
}

function Furniture() {
  return (
    <Frame bg={INK.paper} label="furniture">
      <path d="M-10 380v-60h320v60z" fill={INK.pink} />
      <path d="M200 84h64l-14 50h-36z" fill={INK.orange} />
      <path d="M232 134v170M206 304h52" stroke={INK.black} strokeWidth="8" strokeLinecap="round" />
      <rect x="64" y="110" width="20" height="200" rx="4" fill={INK.olive} />
      <rect x="64" y="110" width="96" height="104" rx="8" fill={INK.olive} />
      <rect x="78" y="124" width="68" height="76" rx="4" fill={INK.paper} opacity="0.35" />
      <rect x="56" y="210" width="128" height="22" rx="6" fill={INK.black} />
      <path d="M68 232v80M172 232v80" stroke={INK.black} strokeWidth="12" strokeLinecap="round" />
      <path d="M140 232v70" stroke={INK.black} strokeWidth="10" strokeLinecap="round" opacity="0.7" />
    </Frame>
  );
}

function Clothes() {
  return (
    <Frame bg={INK.orange} label="clothes">
      <path d="M150 54c-14 0-22 10-18 22 3 9 18 10 18 24" stroke={INK.black} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M150 100L64 140h172z" stroke={INK.black} strokeWidth="6" fill="none" strokeLinejoin="round" />
      <path d="M112 132l-62 34 22 50 30-14v130h96V202l30 14 22-50-62-34c-6 18-20 28-38 28s-32-10-38-28z" fill={INK.paper} />
      <path d="M112 132c6 18 20 28 38 28s32-10 38-28" stroke={INK.blue} strokeWidth="8" fill="none" />
      <path d="M150 160v152" stroke={INK.blue} strokeWidth="4" strokeDasharray="2 14" strokeLinecap="round" />
      <rect x="164" y="190" width="20" height="18" rx="3" fill={INK.pink} />
      <path d="M102 250h96" stroke={INK.olive} strokeWidth="10" opacity="0.8" />
    </Frame>
  );
}

export const SET_ART: Record<string, () => React.ReactElement> = {
  professions: Professions,
  family: Family,
  fruits: Fruits,
  vegetables: Vegetables,
  school: School,
  hobbies: Hobbies,
  sports: Sports,
  arts: Arts,
  furniture: Furniture,
  clothes: Clothes,
};
