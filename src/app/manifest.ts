import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StoryToon",
    short_name: "StoryToon",
    description: "Personalized AI comics for parents — mobile & web",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF8F0",
    theme_color: "#FF6B35",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
