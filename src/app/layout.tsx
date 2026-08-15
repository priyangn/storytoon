import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";

const display = Fredoka({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "StoryToon — Personalized comics for kids",
    template: "%s · StoryToon",
  },
  description:
    "Turn your child’s photo into a safe, original-style comic strip. Mobile-friendly web app for parents. Made with AI.",
  applicationName: "StoryToon",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "StoryToon",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "StoryToon",
    description: "Personalized AI comic keepsakes for parents — original themes, privacy-first.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FF6B35",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} app-sky antialiased`}>
        {children}
      </body>
    </html>
  );
}
