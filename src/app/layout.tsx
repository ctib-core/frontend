// "use server"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL as string;
  
  return {
    title: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "Pulley",
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Pulley is an AI powered trading platform built on the Bitcoin Core Network.",
    other: {
      'fc:frame': JSON.stringify({
        version: 'next',
        imageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE || `${URL}/og.png`,
        button: {
          title: `Launch ${process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || 'Pulley'}`,
          action: {
            type: 'launch_frame',
            name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || 'Pulley',
            url: `${URL}/mini-app`,
            splashImageUrl: process.env.NEXT_PUBLIC_APP_SPLASH_IMAGE || `${URL}/splash.png`,
            splashBackgroundColor: process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR || '#0a0f1a',
          },
        },
      }),
    },
  };
}

const COLORS = {
  bg: "#0a0f1a",
  card: "rgba(16,20,26,0.85)",
  accent: "#b6ff3b",
  accent2: "#00ffb0",
  text: "#f1f5f9",
  muted: "#94a3b8",
  border: "#23272f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-hero`}
        style={{ background: COLORS.bg }}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html >
  );
}
