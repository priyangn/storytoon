export type AgeRange = "3-5" | "6-8" | "9-12";
export type GenderHint = "girl" | "boy" | "neutral" | "";

export type ThemeId =
  | "superhero"
  | "space"
  | "fairytale"
  | "jungle"
  | "detective";

export type FlowStep =
  | "signin"
  | "details"
  | "theme"
  | "generating"
  | "preview"
  | "export";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  driveConsent: boolean;
  createdAt: string;
  expiresAt: string;
}

export interface ChildDetails {
  firstName: string;
  ageRange: AgeRange;
  gender: GenderHint;
  photoDataUrl: string | null;
  photoConsent: boolean;
}

export interface ComicPanel {
  id: string;
  caption: string;
  sceneLabel: string;
  bg: string;
}

export interface GeneratedComic {
  title: string;
  themeId: ThemeId;
  childName: string;
  dedication: string;
  coverAccent: string;
  panels: ComicPanel[];
  moderated: true;
  madeWithAi: true;
  modelAttribution: string;
  createdAt: string;
}
