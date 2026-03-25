import Link from "next/link";
import { platforms, getOverallProgress } from "@/lib/platforms";
import { itProducts } from "@/lib/it-products";
import ProgressBar from "@/components/ProgressBar";

export default function Home() {
  const overallProgress = getOverallProgress();
  const activePlatforms = platforms.filter(
    (p) => p.status === "active" || p.status === "development"
  ).length;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-cyan-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <div className="animate-float inline-block mb-6">
              <span className="text-7xl">🏢</span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
              <span className="gradient-text">Kompanija SPAJA</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-2">
              AI IQ SUPER PLATFORMA — Digitalna Industrija
            </p>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-10">
              Korporacija koja upravlja bankama, menjačnicama, AI platformama,
              globalnim organizacijama i softverskim platformama — {" "}
              <span className="text-green-400 font-bold">kompletna digitalna industrija</span> sa{" "}
              <span className="text-white font-bold">{itProducts.length} IT proizvoda</span> i{" "}
              <span className="text-white font-bold">{platforms.length} platformi</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/industrija"
                className="gradient-bg px-8 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity"
              >
                🏭 Digitalna Industrija
              </Link>
              <Link
                href="/dashboard"
                className="border border-gray-600 px-8 py-3 rounded-lg font-semibold text-gray-300 hover:bg-white/5 transition-colors"
              >
                📊 Dashboard
              </Link>
              <Link
                href="/platforme"
                className="border border-gray-600 px-8 py-3 rounded-lg font-semibold text-gray-300 hover:bg-white/5 transition-colors"
              >
                🌐 Sve Platforme
              </Link>
              <Link
                href="/it-proizvodi"
                className="border border-gray-600 px-8 py-3 rounded-lg font-semibold text-gray-300 hover:bg-white/5 transition-colors"
              >
                ⚡ IT Proizvodi
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Ukupno Platformi",
              value: platforms.length.toString(),
              icon: "🌐",
            },
            {
              label: "Aktivnih",
              value: activePlatforms.toString(),
              icon: "🟢",
            },
            {
              label: "IT Proizvoda",
              value: itProducts.length.toString(),
              icon: "⚡",
            },
            {
              label: "Ukupan Napredak",
              value: `${overallProgress}%`,
              icon: "📈",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="card-glow rounded-xl bg-[#111128] border border-[#1e1e3a] p-5 text-center"
            >
              <span className="text-2xl">{stat.icon}</span>
              <p className="text-2xl font-bold text-white mt-2">
                {stat.value}
              </p>
              <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Overall Progress */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="card-glow rounded-xl bg-[#111128] border border-[#1e1e3a] p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              🎯 Ukupan napredak ka 100%
            </h2>
            <span className="text-3xl font-bold gradient-text">
              {overallProgress}%
            </span>
          </div>
          <ProgressBar progress={overallProgress} size="lg" showLabel={false} />
          <p className="text-sm text-gray-400 mt-3">
            Kada svi projekti dostignu 100%, sve se plasira na Vercel ▲
          </p>
        </div>
      </section>

      {/* Platforms Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">
            🌐 Platforme u ekosistemu
          </h2>
          <Link
            href="/platforme"
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Vidi sve →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.slice(0, 6).map((platform) => (
            <div
              key={platform.id}
              className="card-glow rounded-xl bg-[#111128] border border-[#1e1e3a] p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{platform.icon}</span>
                <div>
                  <h3 className="font-semibold text-white text-sm">
                    {platform.name}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {platform.progress}% spremno
                  </span>
                </div>
              </div>
              <ProgressBar
                progress={platform.progress}
                size="sm"
                showLabel={false}
              />
            </div>
          ))}
        </div>
      </section>

      {/* IT Products Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">
            ⚡ IT Proizvodi Kompanije SPAJA
          </h2>
          <Link
            href="/it-proizvodi"
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Vidi sve →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {itProducts.slice(0, 4).map((product) => (
            <div
              key={product.id}
              className="card-glow rounded-xl bg-[#111128] border border-[#1e1e3a] p-5"
            >
              <span className="text-3xl">{product.icon}</span>
              <h3 className="font-semibold text-white mt-3 text-sm">
                {product.name}
              </h3>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                {product.description}
              </p>
              <div className="mt-3">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    product.impact === "high"
                      ? "bg-green-900/30 text-green-400 border border-green-800/30"
                      : "bg-yellow-900/30 text-yellow-400 border border-yellow-800/30"
                  }`}
                >
                  {product.impact === "high" ? "Visok uticaj" : "Srednji uticaj"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ekosistem Promotion */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="card-glow rounded-xl bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-cyan-900/30 border border-purple-800/30 p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="text-5xl">🌐</div>
            <div className="flex-1">
              <div className="inline-block bg-purple-600/30 text-purple-300 text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wider">
                ⭐ Novi IT Proizvod
              </div>
              <h3 className="text-xl font-bold text-white mb-1">
                SPAJA Ekosistem Hub — iz IO OPENUI AO
              </h3>
              <p className="text-sm text-gray-300">
                Unified frontend koji spaja Banku, Menjačnicu, Kompaniju i AI
                na jednom URL-u. 12 od 22 stavki spremno — pogledaj detalje
                koji fale.
              </p>
            </div>
            <Link
              href="/ekosistem"
              className="gradient-bg px-6 py-2.5 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity text-sm whitespace-nowrap"
            >
              Pogledaj analizu →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-8">
        <div className="card-glow rounded-xl bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-800/30 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            🚀 Spremni za Vercel deployment?
          </h2>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">
            Kada sve platforme dostignu 100%, Kompanija SPAJA plasira
            kompletan ekosistem na Vercel za produkciju.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/deploy"
              className="gradient-bg px-6 py-2.5 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity text-sm"
            >
              🚀 Deploy Status & Vodič →
            </Link>
            <Link
              href="/dashboard"
              className="border border-gray-600 px-6 py-2.5 rounded-lg font-semibold text-gray-300 hover:bg-white/5 transition-colors text-sm"
            >
              Pogledaj napredak →
            </Link>
            <a
              href="https://github.com/spaja86"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-600 px-6 py-2.5 rounded-lg font-semibold text-gray-300 hover:bg-white/5 transition-colors text-sm"
            >
              🐙 GitHub Profil
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
