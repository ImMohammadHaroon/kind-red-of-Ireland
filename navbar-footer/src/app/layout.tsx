import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "@/styles/theme/fonts.css";
import "@/styles/theme/variables.css";
import "@/styles/theme/theme.scss.css";
import "@/sections/header/theme.css";
import "@/sections/search/theme.css";
import "@/sections/footer/theme.css";

import "@/styles/pages.css";
import "@/sections/search/styles.css";
import "@/sections/footer/styles.css";

import content from "@/data/content";
import ThemeScripts from "@/components/ThemeScripts";

const { meta } = content;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  applicationName: meta.siteName,
  icons: { icon: meta.favicon },
  openGraph: {
    type: "website",
    siteName: meta.siteName,
    title: meta.title,
    description: meta.description,
  },
  twitter: {
    card: "summary_large_image",
    title: meta.title,
    description: meta.description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ThemeScripts />
      </body>
    </html>
  );
}
