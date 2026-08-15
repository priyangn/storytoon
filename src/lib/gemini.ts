import { GoogleGenAI } from "@google/genai";
import { getTheme } from "./themes";
import {
  PHOTO_COMIC_STYLE,
  SAFETY_PREFIX,
  THEME_STORY_SPECS,
} from "./theme-prompts";
import { sanitizeText } from "./sanitize";
import type { GeneratedComic, ThemeId } from "./types";

const TEXT_MODEL = process.env.GEMINI_TEXT_MODEL || "gemini-2.5-flash";
const IMAGE_MODEL =
  process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";

export function requireGeminiKey(): string {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) {
    throw new Error(
      "GEMINI_API_KEY is not set. Add it to .env.local to generate real comics."
    );
  }
  return key;
}

function client() {
  return new GoogleGenAI({ apiKey: requireGeminiKey() });
}

function parseDataUrl(dataUrl: string): { mimeType: string; data: string } {
  const match = /^data:([^;]+);base64,(.+)$/i.exec(dataUrl);
  if (!match) {
    throw new Error("Invalid photo data. Please re-upload the image.");
  }
  return { mimeType: match[1], data: match[2] };
}

interface ScriptPanel {
  sceneLabel: string;
  caption: string;
  speechBubble: string;
  imagePrompt: string;
  bg: string;
}

interface ComicScript {
  title: string;
  panels: ScriptPanel[];
}

function extractJson(text: string): ComicScript {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = (fenced?.[1] ?? text).trim();
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end < 0) throw new Error("Model returned no JSON script.");
  const parsed = JSON.parse(raw.slice(start, end + 1)) as ComicScript;
  if (!parsed.title || !Array.isArray(parsed.panels) || parsed.panels.length < 4) {
    throw new Error("Comic script was incomplete.");
  }
  return {
    title: sanitizeText(parsed.title, 80),
    panels: parsed.panels.slice(0, 4).map((p, i) => ({
      sceneLabel: sanitizeText(p.sceneLabel || `Panel ${i + 1}`, 40),
      caption: sanitizeText(p.caption || "", 180),
      speechBubble: sanitizeText(p.speechBubble || "", 60),
      imagePrompt: sanitizeText(p.imagePrompt || "", 420),
      bg: /^#[0-9A-Fa-f]{6}$/.test(p.bg || "") ? p.bg : "#FFF3E0",
    })),
  };
}

async function generateScript(
  ai: GoogleGenAI,
  childName: string,
  themeId: ThemeId,
  ageRange?: string
): Promise<ComicScript> {
  const theme = getTheme(themeId);
  const spec = THEME_STORY_SPECS[themeId];

  const prompt = `${SAFETY_PREFIX}

Create a 4-panel PHOTO COMIC STRIP script (like an online photo-comic maker, but AI-illustrated).
The child's photo will be turned into a stylized comic avatar who stars in every panel.

Child's first name: ${childName}
Age range: ${ageRange || "6-8"}
Theme: ${theme.name} — ${theme.tagline}
Archetype: ${spec.archetype}
Tone: ${spec.tone}
Setting: ${spec.setting}
Art direction: ${spec.artStyle}
Must include: ${spec.mustInclude.join(", ")}
Must avoid: ${spec.mustAvoid.join(", ")}

Return ONLY valid JSON:
{
  "title": "string",
  "panels": [
    {
      "sceneLabel": "short panel title",
      "caption": "1 sentence narrative under the panel",
      "speechBubble": "very short dialogue (max 8 words) spoken by the child hero",
      "imagePrompt": "visual description for one comic panel featuring the child avatar",
      "bg": "#RRGGBB"
    }
  ]
}
Exactly 4 panels that read left-to-right, top-to-bottom as one comic strip page.
No franchise names. No violence.`;

  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: prompt,
    config: {
      temperature: 0.75,
      maxOutputTokens: 2048,
    },
  });

  const text = response.text;
  if (!text) throw new Error("Empty story response from Gemini.");
  return extractJson(text);
}

async function generateImageDataUrl(
  ai: GoogleGenAI,
  prompt: string,
  photo?: { mimeType: string; data: string },
  referenceImage?: { mimeType: string; data: string }
): Promise<string | null> {
  const parts: Array<
    | { text: string }
    | { inlineData: { mimeType: string; data: string } }
  > = [{ text: `${SAFETY_PREFIX}\n\n${PHOTO_COMIC_STYLE}\n\n${prompt}` }];

  if (photo) {
    parts.push({
      inlineData: { mimeType: photo.mimeType, data: photo.data },
    });
  }
  if (referenceImage) {
    parts.push({
      inlineData: {
        mimeType: referenceImage.mimeType,
        data: referenceImage.data,
      },
    });
  }

  const response = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: [{ role: "user", parts }],
    config: {
      responseModalities: ["TEXT", "IMAGE"],
    },
  });

  const partsOut = response.candidates?.[0]?.content?.parts ?? [];
  for (const part of partsOut) {
    const inline = part.inlineData;
    if (inline?.data) {
      const mime = inline.mimeType || "image/png";
      return `data:${mime};base64,${inline.data}`;
    }
  }
  return null;
}

function moderationFail(text: string): boolean {
  return /\b(kill|blood|nude|weapon|gore|suicide|sexual)\b/i.test(text);
}

/**
 * Live Gemini photo→comic strip generation. Photo stays in-memory only.
 */
export async function generateComicWithGemini(input: {
  childName: string;
  themeId: ThemeId;
  photoDataUrl: string;
  ageRange?: string;
}): Promise<GeneratedComic> {
  const ai = client();
  const name = sanitizeText(input.childName, 40) || "Hero";
  const theme = getTheme(input.themeId);
  const photo = parseDataUrl(input.photoDataUrl);
  const spec = THEME_STORY_SPECS[input.themeId];

  const script = await generateScript(ai, name, input.themeId, input.ageRange);

  for (const panel of script.panels) {
    if (
      moderationFail(
        `${panel.caption} ${panel.speechBubble} ${panel.imagePrompt} ${script.title}`
      )
    ) {
      throw new Error(
        "Safety filter blocked this story. Please try another theme or regenerate."
      );
    }
  }

  const coverPrompt = `
PHOTO COMIC COVER (front of the strip).
Title vibe: "${script.title}" starring ${name}.
Theme: ${theme.name}. Art: ${spec.artStyle}.
Use the uploaded photo as the likeness reference — convert the child into a stylized comic avatar
(same face features, hair, skin tone, approximate age) in theme costume.
Portrait-friendly cover composition with bold comic border.
Do NOT paint any title text, logos, or watermarks on the image.
`.trim();

  const coverImage = await generateImageDataUrl(ai, coverPrompt, photo);

  let avatarRef: { mimeType: string; data: string } | undefined;
  if (coverImage) {
    avatarRef = parseDataUrl(coverImage);
  }

  const panels = [];
  for (let i = 0; i < script.panels.length; i++) {
    const p = script.panels[i];
    const bubble = p.speechBubble || p.caption.slice(0, 48);
    const panelPrompt = `
PHOTO COMIC STRIP PANEL ${i + 1} of 4 (single framed panel, not a full page).
Scene label: ${p.sceneLabel}
Action: ${p.imagePrompt}
Theme art: ${spec.artStyle}
Draw the SAME stylized child hero as in the reference images (strong facial likeness to the photo).
Include one friendly comic SPEECH BUBBLE with exactly this dialogue: "${bubble}"
Thick black panel border, comic ink style, kids-safe adventure.
No logos, no franchise costumes, no extra watermarks.
`.trim();

    const imageDataUrl = await generateImageDataUrl(
      ai,
      panelPrompt,
      photo,
      avatarRef
    );

    panels.push({
      id: `panel-${i + 1}`,
      sceneLabel: p.sceneLabel,
      caption: p.caption,
      speechBubble: bubble,
      bg: p.bg,
      imageDataUrl: imageDataUrl ?? undefined,
    });
  }

  const anyImage =
    Boolean(coverImage) || panels.some((p) => Boolean(p.imageDataUrl));
  if (!anyImage) {
    throw new Error(
      "Gemini did not return images. Check GEMINI_IMAGE_MODEL / API quota and try again."
    );
  }

  return {
    title: script.title,
    themeId: input.themeId,
    childName: name,
    dedication: "",
    coverAccent: theme.accent,
    coverImageDataUrl: coverImage ?? undefined,
    panels,
    moderated: true,
    madeWithAi: true,
    modelAttribution: `Photo comic generated using Google Gemini (${TEXT_MODEL} + ${IMAGE_MODEL})`,
    createdAt: new Date().toISOString(),
  };
}
