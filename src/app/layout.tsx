import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Kompanija SPAJA — AI IQ SUPER PLATFORMA",
  description:
    "Platforma za spajanje ekstremno mnogo platformi. IT proizvodi koji ubrzavaju sve procese i nadograđuju sve platforme na 100%. Kompanija SPAJA korporacija.",
  keywords: [
    "Kompanija SPAJA",
    "AI IQ",
    "Super Platforma",
    "IT proizvodi",
    "OMEGA AI",
    "Menjačnica",
    "World Bank",
  ],
  openGraph: {
    title: "Kompanija SPAJA — AI IQ SUPER PLATFORMA",
    description:
      "IT proizvodi koji ubrzavaju sve procese i nadograđuju sve platforme na 100%.",
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
