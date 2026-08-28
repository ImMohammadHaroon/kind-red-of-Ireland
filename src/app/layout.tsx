import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import "@/styles/theme/fonts.css";
import "@/styles/theme/variables.css";
import "@/styles/theme/theme.scss.css";
import "./header/theme.css";
import "./search/theme.css";
import "./footer/theme.css";
import "@/styles/pages.css";
import "./search/styles.css";
import "./footer/styles.css";

import content from "@/data/content";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import ThemeScripts from "@/components/ThemeScripts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div id="main">
          <Header />
          <main className="inner-page flex-1">{children}</main>
          <Footer />
        </div>
        <ThemeScripts />
      </body>
    </html>
  );
}
