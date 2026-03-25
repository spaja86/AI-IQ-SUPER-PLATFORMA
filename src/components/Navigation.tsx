"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Početna", icon: "🏠" },
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/platforme", label: "Platforme", icon: "🌐" },
  { href: "/it-proizvodi", label: "IT Proizvodi", icon: "⚡" },
  { href: "/ekosistem", label: "Ekosistem", icon: "🔗" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-2xl">🏢</span>
            <div>
              <span className="text-lg font-bold gradient-text">
                Kompanija SPAJA
              </span>
              <span className="hidden sm:inline text-xs text-gray-400 ml-2">
                AI IQ SUPER PLATFORMA
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-blue-600/20 text-blue-400"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="mr-1.5">{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
