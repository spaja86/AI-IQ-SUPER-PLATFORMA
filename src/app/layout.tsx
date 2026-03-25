import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Kompanija SPAJA — AI IQ SUPER PLATFORMA | Digitalna Industrija",
    template: "%s | Kompanija SPAJA",
  },
  description:
    "Kompletna digitalna industrija: korporacija, banke, menjačnice, AI platforme, globalne organizacije i 17 IT proizvoda. Kompanija SPAJA upravlja celim ekosistemom.",
  keywords: [
    "Kompanija SPAJA",
    "AI IQ",
    "Super Platforma",
    "Digitalna Industrija",
    "IT proizvodi",
    "OMEGA AI",
    "Menjačnica",
    "World Bank",
    "SVETSKA ORGANIZACIJA",
    "Vercel",
    "Next.js",
  ],
  authors: [{ name: "Kompanija SPAJA" }],
  creator: "Kompanija SPAJA",
  publisher: "Kompanija SPAJA",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Kompanija SPAJA — AI IQ SUPER PLATFORMA | Digitalna Industrija",
    description:
      "Kompletna digitalna industrija sa bankama, menjačnicama, AI platformama i 17 IT proizvoda.",
    type: "website",
    siteName: "AI IQ SUPER PLATFORMA",
    locale: "sr_RS",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kompanija SPAJA — AI IQ SUPER PLATFORMA",
    description:
      "Kompletna digitalna industrija sa 11 platformi i 17 IT proizvoda.",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://ai-iq-super-platforma.vercel.app"
  ),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Navigation />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
