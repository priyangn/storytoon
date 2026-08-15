import type { ThemeId } from "./types";

/** Shared “photo comic strip” look (Fotojet-like UX; AI avatar per PRD). */
export const PHOTO_COMIC_STYLE = `
Classic photo-comic strip illustration:
- Bold black panel borders and gutters like a printed comic page
- Thick ink outlines, flat cel colors, light halftone / Ben-Day dots
- Strong likeness to the uploaded child's face (keep age, hair, skin tone, expression)
- Stylize into cartoon comic art — NOT a raw photo collage and NOT photorealistic
- Friendly speech bubble with short readable dialogue when requested
- No watermarks, no logos, no franchise characters or trademarked costumes
`.trim();

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
      "bright kids photo-comic strip, bold ink outlines, warm oranges, original cape",
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
      "kids space photo-comic strip, bold outlines, pastel nebulae, cute rocket",
    mustInclude: ["rocket", "stars", "friendly aliens", "wonder"],
    mustAvoid: ["combat", "explosions as danger", "horror", "franchise ships or logos"],
  },
  fairytale: {
    archetype: "gentle fairytale adventurer",
    tone: "magical, soft, cozy storybook",
    setting: "castle garden and talking animal friends",
    artStyle:
      "storybook photo-comic strip, soft pastels, sparkles, bold panel borders",
    mustInclude: ["castle", "kind magic", "animal friend", "garden"],
    mustAvoid: ["dark curses", "scary witches", "peril", "franchise princess IP"],
  },
  jungle: {
    archetype: "cheerful jungle trail explorer",
    tone: "giggly, sunny, friendship",
    setting: "lush jungle path with playful animals",
    artStyle:
      "jungle photo-comic strip, vivid greens, leafy textures, bold ink lines",
    mustInclude: ["vines", "animal friends", "treasure of smiles", "sunlight"],
    mustAvoid: ["predators attacking", "danger", "weapons", "franchise jungle IP"],
  },
  detective: {
    archetype: "kid detective solving a silly mystery",
    tone: "clever, light-hearted, never scary",
    setting: "cozy kitchen / home mystery of missing cookies",
    artStyle:
      "playful detective photo-comic strip, soft purple accents, magnifying glass",
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
You create safe children's photo-comic content for parents (StoryToon).
Rules (non-negotiable):
- Depict the child fully clothed, age-appropriate, non-sexualized, non-violent.
- Keep peril cartoonish and mild; no weapons, gore, horror, or frightening imagery.
- Wholly original characters and motifs — no logos, trademarks, or franchise lookalikes.
- Preserve recognizable likeness from the reference photo (face shape, hair, skin tone, age).
- Family-friendly language only.
`.trim();
