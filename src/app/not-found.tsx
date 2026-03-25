import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-8xl font-bold gradient-text mb-4">404</div>
        <div className="text-5xl mb-6" role="img" aria-label="Stranica nije pronađena">
          🔍
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">
          Stranica nije pronađena
        </h1>
        <p className="text-gray-400 mb-8">
          Stranica koju tražite ne postoji ili je premeštena. Proverite URL ili
          se vratite na početnu stranicu.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/"
            className="px-6 py-3 gradient-bg hover:opacity-90 text-white rounded-lg font-medium transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0a0a1a]"
          >
            🏠 Početna stranica
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 border border-gray-600 hover:border-gray-400 text-gray-300 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0a0a1a]"
          >
            📊 Dashboard
          </Link>
          <Link
            href="/platforme"
            className="px-6 py-3 border border-gray-600 hover:border-gray-400 text-gray-300 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0a0a1a]"
          >
            🌐 Platforme
          </Link>
        </div>
      </div>
    </div>
  );
}
