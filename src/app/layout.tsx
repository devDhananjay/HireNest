import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { BRAND } from "@/lib/constants";
import "./globals.css";

/** BCG-adjacent body face (henderson-bcg-sans ≈ Helvetica Neue) */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

/**
 * BCG-adjacent headline face.
 * BCG uses proprietary `henderson-bcg-serif` (Palatino / Garamond family, weight ~300).
 * Cormorant Garamond is the closest public match.
 */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND.name} — ${BRAND.tagline}`,
    template: `%s | ${BRAND.name}`,
  },
  description:
    "HIREORA is a premium recruitment and placement platform connecting candidates, employers and specialist recruiters across India.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${cormorant.variable} h-full`}>
      <body className="min-h-full bg-offwhite font-sans text-charcoal antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
