import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Kompanija SPAJA — AI IQ SUPER PLATFORMA | Digitalna Industrija",
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
  ],
  openGraph: {
    title: "Kompanija SPAJA — AI IQ SUPER PLATFORMA | Digitalna Industrija",
    description:
      "Kompletna digitalna industrija sa bankama, menjačnicama, AI platformama i 17 IT proizvoda.",
    type: "website",
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
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
