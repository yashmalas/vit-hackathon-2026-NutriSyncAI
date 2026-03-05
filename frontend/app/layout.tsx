import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AIChatbot } from "@/components/ui/AIChatbot";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "NutriSync AI",
  description: "Real-time Bio-Adaptive Nutrition Ecosystem",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <main className="min-h-screen bg-base text-primary selection:bg-accent-primary/30">
          {children}
          <AIChatbot />
        </main>
      </body>
    </html>
  );
}
