import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Kid-friendly, modern
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap", // Ensure fallback text is visible
});

export const metadata: Metadata = {
  title: "BeddyBot | Personalized AI Bedtime Stories",
  description: "Create magical, personalized bedtime stories for your child in seconds. Narrated by friendly voices.",
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable}`}>
        {children}
      </body>
    </html>
  );
}
