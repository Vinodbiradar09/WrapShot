import type { Metadata, Viewport } from "next";
import { Syne, JetBrains_Mono } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "WrapShot — Your GitHub Year in Review",
    template: "%s | WrapShot",
  },
  description:
    "Discover your GitHub year in review. Commits, streaks, top languages, AI-powered insights — beautifully wrapped.",
  keywords: [
    "GitHub wrapped",
    "developer stats",
    "GitHub year in review",
    "WrapShot",
  ],
  authors: [{ name: "WrapShot" }],
  openGraph: {
    type: "website",
    siteName: "WrapShot",
    title: "WrapShot — Your GitHub Year in Review",
    description: "Your code. Your year. Beautifully wrapped.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WrapShot — Your GitHub Year in Review",
    description: "Your code. Your year. Beautifully wrapped.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#08080e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${jetbrainsMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="antialiased min-h-screen bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
