export type Card = {
  ku: string; // Kurmanji word or phrase
  pos: string; // part of speech
  meaning: string; // meaning in the learner's language
  example_ku: string; // example sentence in Kurmanji
  example_tr: string; // translation of the example
  note?: string; // short grammar / usage tip
  img?: string; // illustration URL (ready-made sets only)
};

export type Deck = {
  title: string;
  lang: string; // learner language code
  level: string;
  cards: Card[];
};

export const LANGS: { code: string; name: string }[] = [
  { code: "en", name: "English" },
  { code: "tr", name: "Türkçe" },
  { code: "de", name: "Deutsch" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Português" },
  { code: "ru", name: "Русский" },
  { code: "ar", name: "العربية" },
  { code: "fa", name: "فارسی" },
  { code: "zh", name: "中文" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "sv", name: "Svenska" },
];

export const LEVELS = ["beginner", "intermediate", "advanced"] as const;
