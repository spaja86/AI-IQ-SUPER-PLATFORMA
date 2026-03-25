export default function Footer() {
  return (
    <footer className="border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🏢</span>
              <div>
                <h3 className="text-xl font-bold gradient-text">
                  Kompanija SPAJA
                </h3>
                <p className="text-sm text-gray-400">
                  AI IQ SUPER PLATFORMA
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-sm max-w-md">
              Digitalna Industrija koja objedinjuje banke, menjačnice, AI
              platforme, globalne organizacije i softverske platforme.
              IT proizvodi koji ubrzavaju sve procese i nadograđuju sve
              platforme.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Platforme
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="https://github.com/spaja86/IO-OPENUI-AO" className="hover:text-blue-400 transition-colors">
                  IO OPENUI AO
                </a>
              </li>
              <li>
                <a href="https://github.com/spaja86/Ai-Iq-Menja-nica" className="hover:text-blue-400 transition-colors">
                  AI IQ Menjačnica
                </a>
              </li>
              <li>
                <a href="https://github.com/spaja86/Ai-Iq-World-Bank" className="hover:text-blue-400 transition-colors">
                  AI IQ World Bank
                </a>
              </li>
              <li>
                <a href="https://github.com/spaja86/SVETSKA-ORGANIZACIJA" className="hover:text-blue-400 transition-colors">
                  SVETSKA ORGANIZACIJA
                </a>
              </li>
              <li>
                <a href="https://github.com/spaja86/openai-platform" className="hover:text-blue-400 transition-colors">
                  OpenAI Platform
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Linkovi
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="https://github.com/spaja86" className="hover:text-blue-400 transition-colors">
                  GitHub profil
                </a>
              </li>
              <li>
                <a href="https://vercel.com" className="hover:text-blue-400 transition-colors">
                  Vercel
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} Kompanija SPAJA — AI IQ SUPER
            PLATFORMA. Sva prava zadržana.
          </p>
          <p className="mt-1">
            Powered by Next.js & Vercel ▲
          </p>
        </div>
      </div>
    </footer>
  );
}
