import type { ThemeId } from "./types";

/** Fixed server-side templates — user text never becomes freeform instructions. */
export const THEME_STORY_SPECS: Record<
  ThemeId,
  {
    archetype: string;
    tone: string;
    setting: string;
    artStyle: string;
    mustInclude: string[];
    mustAvoid: string[];
  }
> = {
  superhero: {
    archetype: "everyday kindness hero (original cape design, no franchise symbols)",
    tone: "warm, brave, gentle, playful",
    setting: "sunny neighborhood and home",
    artStyle:
      "bright children's comic book illustration, soft cel shading, rounded shapes, high contrast colors",
    mustInclude: ["kindness", "helping friends", "smiles", "colorful original cape"],
    mustAvoid: [
      "violence",
      "weapons",
      "blood",
      "scary villains",
      "licensed characters",
      "logos",
    ],
  },
  space: {
    archetype: "friendly space explorer kid astronaut",
    tone: "curious, wondrous, gentle adventure",
    setting: "colorful planets and a friendly rocket",
    artStyle:
      "whimsical children's space comic, pastel nebulae, soft glow, cute planet characters",
    mustInclude: ["rocket", "stars", "friendly aliens", "wonder"],
    mustAvoid: ["combat", "explosions as danger", "horror", "franchise ships or logos"],
  },
  fairytale: {
    archetype: "gentle fairytale adventurer",
    tone: "magical, soft, cozy storybook",
    setting: "castle garden and talking animal friends",
    artStyle:
      "watercolor storybook comic panels, pastel palette, sparkles, soft edges",
    mustInclude: ["castle", "kind magic", "animal friend", "garden"],
    mustAvoid: ["dark curses", "scary witches", "peril", "franchise princess IP"],
  },
  jungle: {
    archetype: "cheerful jungle trail explorer",
    tone: "giggly, sunny, friendship",
    setting: "lush jungle path with playful animals",
    artStyle:
      "vivid children's jungle comic, leafy textures, bright greens and golds",
    mustInclude: ["vines", "animal friends", "treasure of smiles", "sunlight"],
    mustAvoid: ["predators attacking", "danger", "weapons", "franchise jungle IP"],
  },
  detective: {
    archetype: "kid detective solving a silly mystery",
    tone: "clever, light-hearted, never scary",
    setting: "cozy kitchen / home mystery of missing cookies",
    artStyle:
      "soft noir-lite children's comic, purple and cream accents, playful magnifying glass",
    mustInclude: ["clues", "magnifying glass", "puppy helper", "happy reveal"],
    mustAvoid: [
      "crime violence",
      "weapons",
      "scary shadows",
      "real crime",
      "franchise detective IP",
    ],
  },
};

export const SAFETY_PREFIX = `
You create safe children's comic content for parents.
Rules (non-negotiable):
- Depict the child fully clothed, age-appropriate, non-sexualized, non-violent.
- Keep peril cartoonish and mild; no weapons, gore, horror, or frightening imagery.
- Wholly original characters and motifs — no logos, trademarks, or franchise lookalikes.
- Family-friendly language only.
`.trim();
