import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TopBar } from "@/components/TopBar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bragme.app"),
  title: {
    default: "BragMe — Spill your mess. We'll find your magic.",
    template: "%s · BragMe",
  },
  description:
    "Dump your mess. Get a glow-up brag card. Share the main character energy.",
  openGraph: {
    title: "BragMe",
    description: "Spill your mess. We'll find your magic.",
    type: "website",
    siteName: "BragMe",
  },
  twitter: {
    card: "summary_large_image",
    title: "BragMe",
    description: "Spill your mess. We'll find your magic.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <TopBar />
        {children}
      </body>
    </html>
  );
}
