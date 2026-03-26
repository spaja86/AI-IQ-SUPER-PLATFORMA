import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AI-IQ SUPER PLATFORMA | Kompanija SPAJA — Digitalna Industrija",
    template: "%s | SPAJA Digitalna Industrija",
  },
  description:
    "Digitalna Industrija koja pravi platforme, organizacije, kompanije i IT proizvode. Kompanija SPAJA — AI-IQ SUPER PLATFORMA.",
  keywords: [
    "SPAJA",
    "Digitalna Industrija",
    "AI",
    "platforme",
    "organizacije",
    "kompanije",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sr"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
