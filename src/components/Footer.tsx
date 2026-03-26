import Link from 'next/link';

const sectionLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/banka', label: 'Banka' },
  { href: '/menjacnica', label: 'Menjačnica' },
  { href: '/kompanija', label: 'Kompanija' },
  { href: '/ai-platforma', label: 'AI Platforma' },
  { href: '/organizacija', label: 'Organizacija' },
  { href: '/omega-ai', label: 'Omega AI' },
  { href: '/ekosistem', label: 'Ekosistem' },
  { href: '/auto-popravka', label: '🔧 Auto-Popravka' },
] as const;

const socialLinks = [
  { href: 'https://facebook.com', label: 'Facebook' },
  { href: 'https://instagram.com', label: 'Instagram' },
  { href: 'https://tiktok.com', label: 'TikTok' },
  { href: 'https://youtube.com', label: 'YouTube' },
  { href: 'https://github.com/spaja86', label: 'GitHub' },
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0f]">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <span className="bg-gradient-to-r from-[#7c3aed] to-[#2563eb] bg-clip-text text-lg font-bold text-transparent">
              SPAJA
            </span>
            <p className="mt-2 text-sm text-zinc-400">
              Jedinstveni digitalni ekosistem koji spaja banku, menjačnicu, AI
              platformu, IT kompaniju i Omega AI.
            </p>
          </div>

          {/* Sections */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-zinc-200">
              Platforme
            </h3>
            <ul className="space-y-2">
              {sectionLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-zinc-200">
              Društvene mreže
            </h3>
            <ul className="space-y-2">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-zinc-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-zinc-200">
              Kontakt
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:spajicn@gmail.com"
                  className="text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  spajicn@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="mailto:spajicn@yahoo.com"
                  className="text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  spajicn@yahoo.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-white/5 pt-6 text-center text-sm text-zinc-500">
          © 2026 SPAJA Ekosistem | Owner: Nikola Spajić
        </div>
      </div>
    </footer>
  );
}
