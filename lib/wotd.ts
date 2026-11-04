import { SETS } from "./sets";
import { LEVELS } from "./types";

// The same word for everyone on a given day, stepping through all 300 set words.
// 37 is coprime with 300, so consecutive days jump between topics but every word comes up once per cycle.
export function wordOfDay(date = new Date()) {
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  const i = (((day * 37) % 300) + 300) % 300;
  const set = SETS[Math.floor(i / 30)];
  const level = LEVELS[Math.floor((i % 30) / 10)];
  return { setId: set.id, level, index: i % 10 };
}
