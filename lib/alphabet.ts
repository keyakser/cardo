// The 31 letters of the Kurdish (Hawar) Latin alphabet with how each sounds,
// compared with Turkish and English, and an example word from the ready-made sets.
// `ex` points at a set word: [setId, level, index]; its illustration is wordArt(...).

export type Letter = {
  l: string;
  special?: boolean; // carries a mark (ç ê î ş û)
  notInTr?: boolean; // sound does not exist in Turkish
  tr: string; // how it sounds, explained for Turkish speakers
  en: string; // how it sounds, explained for English speakers
  word: string; // example word (the letter is highlighted in it)
  ex: [string, "beginner" | "intermediate" | "advanced", number];
};

export const ALPHABET: Letter[] = [
  { l: "a", tr: "a, uzun: \"kar\"daki a", en: "a in \"father\"", word: "aşpêj", ex: ["professions", "beginner", 4] },
  { l: "b", tr: "b", en: "b in \"bed\"", word: "bav", ex: ["family", "beginner", 1] },
  { l: "c", tr: "c: \"cam\"", en: "j in \"jam\"", word: "cotkar", ex: ["professions", "beginner", 3] },
  { l: "ç", special: true, tr: "ç: \"çay\"", en: "ch in \"chair\"", word: "çente", ex: ["school", "intermediate", 1] },
  { l: "d", tr: "d", en: "d in \"day\"", word: "dukandar", ex: ["professions", "intermediate", 7] },
  { l: "e", tr: "e, kısa ve açık: \"ev\"", en: "e in \"bed\", slightly open", word: "endezyar", ex: ["professions", "intermediate", 0] },
  { l: "ê", special: true, notInTr: true, tr: "uzun, kapalı e: \"ey\"e yakın, kaymadan", en: "ay in \"day\", without the glide", word: "êlek", ex: ["clothes", "advanced", 3] },
  { l: "f", tr: "f", en: "f in \"fun\"", word: "fêkî", ex: ["fruits", "intermediate", 9] },
  { l: "g", tr: "g: \"gel\"", en: "g in \"go\"", word: "gizer", ex: ["vegetables", "beginner", 0] },
  { l: "h", tr: "h: \"hava\"", en: "h in \"hat\"", word: "hunermend", ex: ["professions", "intermediate", 9] },
  { l: "i", tr: "ı: \"ılık\"taki kısa ı", en: "short i in \"bit\", almost a schwa", word: "bira", ex: ["family", "beginner", 2] },
  { l: "î", special: true, tr: "i, uzun: \"iyi\"", en: "ee in \"see\"", word: "îsot", ex: ["vegetables", "beginner", 6] },
  { l: "j", tr: "j: \"jilet\"", en: "s in \"measure\"", word: "jin", ex: ["family", "intermediate", 1] },
  { l: "k", tr: "k", en: "k in \"kid\"", word: "keç", ex: ["family", "beginner", 5] },
  { l: "l", tr: "l", en: "l in \"lamp\"", word: "lîmon", ex: ["fruits", "intermediate", 1] },
  { l: "m", tr: "m", en: "m in \"man\"", word: "mamoste", ex: ["professions", "beginner", 0] },
  { l: "n", tr: "n", en: "n in \"no\"", word: "nanpêj", ex: ["professions", "intermediate", 5] },
  { l: "o", tr: "o: \"ok\"", en: "o in \"more\"", word: "kartol", ex: ["vegetables", "beginner", 4] },
  { l: "p", tr: "p", en: "p in \"pen\"", word: "polîs", ex: ["professions", "beginner", 7] },
  { l: "q", notInTr: true, tr: "gırtlaktan, derin bir k", en: "a k made far back in the throat", word: "qedeh", ex: ["furniture", "intermediate", 9] },
  { l: "r", tr: "r; \"rr\" titreşimli", en: "a tapped r; \"rr\" is rolled", word: "rûpel", ex: ["school", "intermediate", 5] },
  { l: "s", tr: "s", en: "s in \"sun\"", word: "sêv", ex: ["fruits", "beginner", 0] },
  { l: "ş", special: true, tr: "ş: \"şeker\"", en: "sh in \"she\"", word: "şeftalî", ex: ["fruits", "beginner", 6] },
  { l: "t", tr: "t", en: "t in \"top\"", word: "tirî", ex: ["fruits", "beginner", 2] },
  { l: "u", tr: "kısa u: \"uç\"", en: "u in \"put\"", word: "kur", ex: ["family", "beginner", 4] },
  { l: "û", special: true, tr: "uzun u: \"uu\"", en: "oo in \"food\"", word: "pirtûk", ex: ["school", "beginner", 0] },
  { l: "v", tr: "v", en: "v in \"van\"", word: "voleybol", ex: ["sports", "intermediate", 0] },
  { l: "w", notInTr: true, tr: "İngilizcedeki w: dudaklar yuvarlak", en: "w in \"water\"", word: "wênekêş", ex: ["professions", "intermediate", 4] },
  { l: "x", notInTr: true, tr: "gırtlaktan hırıltılı h", en: "ch in Scottish \"loch\"", word: "xwişk", ex: ["family", "beginner", 3] },
  { l: "y", tr: "y", en: "y in \"yes\"", word: "dayik", ex: ["family", "beginner", 0] },
  { l: "z", tr: "z", en: "z in \"zoo\"", word: "zarok", ex: ["family", "beginner", 7] },
];
