import { getTheme } from "./themes";
import { sanitizeText } from "./sanitize";
import type { GeneratedComic, ThemeId } from "./types";

const PANEL_SCRIPTS: Record<
  ThemeId,
  { title: string; scenes: { label: string; caption: string; bg: string }[] }
> = {
  superhero: {
    title: "The Kindness Cape",
    scenes: [
      {
        label: "Morning Mission",
        caption: "{name} puts on a bright cape and smiles at the day ahead.",
        bg: "#FFE8DC",
      },
      {
        label: "Helping Hands",
        caption: "A friend needs a boost — {name} lends a cheerful hand.",
        bg: "#FFF3C4",
      },
      {
        label: "Teamwork Power",
        caption: "Together they finish the job and cheer!",
        bg: "#FFD6C8",
      },
      {
        label: "Hero at Home",
        caption: "{name} is the everyday hero of kindness.",
        bg: "#FFE0B2",
      },
    ],
  },
  space: {
    title: "Starship Smile",
    scenes: [
      {
        label: "Launch Pad",
        caption: "{name} boards a friendly rocket under twinkling stars.",
        bg: "#D6EEFF",
      },
      {
        label: "New Planet",
        caption: "Soft aliens wave hello — {name} waves back.",
        bg: "#E8F7FF",
      },
      {
        label: "Star Map",
        caption: "Together they draw a map of sparkling skies.",
        bg: "#CDE8FF",
      },
      {
        label: "Home Orbit",
        caption: "{name} returns with a pocket full of starlight.",
        bg: "#B8DFFF",
      },
    ],
  },
  fairytale: {
    title: "The Gentle Castle",
    scenes: [
      {
        label: "Garden Gate",
        caption: "{name} finds a sparkling path to a friendly castle.",
        bg: "#FFE4EC",
      },
      {
        label: "Talking Fox",
        caption: "A polite fox asks for help finding berries.",
        bg: "#FFD6E7",
      },
      {
        label: "Castle Feast",
        caption: "{name} shares snacks with new friends.",
        bg: "#FFCCE0",
      },
      {
        label: "Twilight Wish",
        caption: "The kingdom glows with {name}'s kind heart.",
        bg: "#FFC1D6",
      },
    ],
  },
  jungle: {
    title: "Vine Trail Friends",
    scenes: [
      {
        label: "Leafy Path",
        caption: "{name} steps into a sunny jungle full of giggles.",
        bg: "#E4F7D9",
      },
      {
        label: "Monkey Chorus",
        caption: "Playful monkeys show {name} a swinging shortcut.",
        bg: "#D4F0C4",
      },
      {
        label: "Treasure of Smiles",
        caption: "They find a chest filled with colorful stickers!",
        bg: "#C5E9B0",
      },
      {
        label: "Campfire Song",
        caption: "{name} sings with jungle friends under soft lights.",
        bg: "#B8E09E",
      },
    ],
  },
  detective: {
    title: "The Missing Cookie Case",
    scenes: [
      {
        label: "Clue One",
        caption: "{name} finds crumbs leading across the kitchen.",
        bg: "#EDE7F6",
      },
      {
        label: "Interview",
        caption: "A giggling puppy offers a helpful tip.",
        bg: "#E0D6F5",
      },
      {
        label: "Aha!",
        caption: "{name} solves it — the cookies were for a surprise party!",
        bg: "#D4C8F0",
      },
      {
        label: "Case Closed",
        caption: "Everyone cheers for Detective {name}.",
        bg: "#C9BAEB",
      },
    ],
  },
};

/**
 * MVP comic builder. When GEMINI_API_KEY is set, /api/generate can swap this
 * for Google Gemini image/story generation. Photos stay in-memory only.
 */
export function buildMockComic(
  childName: string,
  themeId: ThemeId
): GeneratedComic {
  const theme = getTheme(themeId);
  const script = PANEL_SCRIPTS[themeId];
  const name = sanitizeText(childName, 40) || "Hero";

  return {
    title: script.title,
    themeId,
    childName: name,
    dedication: "",
    coverAccent: theme.accent,
    panels: script.scenes.map((scene, i) => ({
      id: `panel-${i + 1}`,
      sceneLabel: scene.label,
      caption: scene.caption.replaceAll("{name}", name),
      bg: scene.bg,
    })),
    moderated: true,
    madeWithAi: true,
    modelAttribution:
      process.env.GEMINI_API_KEY
        ? "Avatar & comic generated using Google Gemini API"
        : "Demo comic (connect Google Gemini for live AI art)",
    createdAt: new Date().toISOString(),
  };
}
