import type { AgeRange, GenderHint, ThemeId } from "./types";

export interface Theme {
  id: ThemeId;
  name: string;
  tagline: string;
  accent: string;
  gradient: string;
  suggestedFor: AgeRange[];
  genderBoost?: GenderHint[];
}

export const THEMES: Theme[] = [
  {
    id: "superhero",
    name: "Everyday Hero",
    tagline: "Kindness, courage, and colorful capes — all original!",
    accent: "#FF6B35",
    gradient: "linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)",
    suggestedFor: ["6-8", "9-12"],
  },
  {
    id: "space",
    name: "Space Explorer",
    tagline: "Blast off to friendly planets and sparkling stars.",
    accent: "#1B6CA8",
    gradient: "linear-gradient(135deg, #1B6CA8 0%, #5EC8F2 100%)",
    suggestedFor: ["6-8", "9-12"],
  },
  {
    id: "fairytale",
    name: "Fairytale Kingdom",
    tagline: "Castles, talking animals, and gentle magic.",
    accent: "#E85D75",
    gradient: "linear-gradient(135deg, #E85D75 0%, #FFC1CC 100%)",
    suggestedFor: ["3-5", "6-8"],
    genderBoost: ["girl"],
  },
  {
    id: "jungle",
    name: "Jungle Adventure",
    tagline: "Vines, friends, and a treasure of giggles.",
    accent: "#2D8A4E",
    gradient: "linear-gradient(135deg, #2D8A4E 0%, #A8E063 100%)",
    suggestedFor: ["3-5", "6-8"],
  },
  {
    id: "detective",
    name: "Detective Mystery",
    tagline: "Clues, teamwork, and silly mysteries — never scary.",
    accent: "#5B4B8A",
    gradient: "linear-gradient(135deg, #5B4B8A 0%, #9B8EC4 100%)",
    suggestedFor: ["9-12"],
  },
];

export function suggestedThemeIds(
  ageRange: AgeRange,
  gender: GenderHint
): ThemeId[] {
  const scored = THEMES.map((theme) => {
    let score = 0;
    if (theme.suggestedFor.includes(ageRange)) score += 2;
    if (gender && theme.genderBoost?.includes(gender)) score += 1;
    return { id: theme.id, score };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .filter((t) => t.score > 0)
    .slice(0, 2)
    .map((t) => t.id);
}

export function getTheme(id: ThemeId): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
