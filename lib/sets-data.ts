// Server-side copy of the ready-made sets, bundled into the API so it can
// answer matching topics without calling the model.
import professions from "@/public/sets/professions.json";
import family from "@/public/sets/family.json";
import fruits from "@/public/sets/fruits.json";
import vegetables from "@/public/sets/vegetables.json";
import school from "@/public/sets/school.json";
import hobbies from "@/public/sets/hobbies.json";
import sports from "@/public/sets/sports.json";
import arts from "@/public/sets/arts.json";
import furniture from "@/public/sets/furniture.json";
import clothes from "@/public/sets/clothes.json";
import type { SetData } from "./sets";

export const SET_DATA: Record<string, SetData> = Object.fromEntries(
  [professions, family, fruits, vegetables, school, hobbies, sports, arts, furniture, clothes].map((d) => [d.id, d as SetData]),
);
