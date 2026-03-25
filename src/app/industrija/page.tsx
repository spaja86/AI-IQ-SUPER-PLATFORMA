import Link from "next/link";
import {
  platforms,
  getOverallProgress,
  categoryLabels,
  categoryIcons,
  getPlatformsByCategory,
  type PlatformCategory,
} from "@/lib/platforms";
import { itProducts } from "@/lib/it-products";

export const metadata = {
  title: "Digitalna Industrija — Kompanija SPAJA",
  description:
    "AI IQ SUPER PLATFORMA predstavlja kompletnu digitalnu industriju: korporacija, banke, menjačnice, AI platforme, globalne organizacije i 17 IT proizvoda.",
};

const industryEntities = [
  {
    type: "Korporacija",
    icon: "🏢",
    name: "Kompanija SPAJA",
    description:
      "Matična IT korporacija koja upravlja svim entitetima. Proizvodi 17 IT proizvoda koji pokreću ceo ekosistem.",
    color: "from-blue-600/20 to-purple-600/20 border-blue-500/30",
    items: ["17 IT proizvoda", "8 kategorija proizvoda", "Centralno upravljanje", "Vercel deployment"],
  },
  {
    type: "Banka",
    icon: "🏦",
    name: "AI IQ World Bank",
    description:
      "Kompletna svetska banka sa 7+ sekcija, Omega AI tehnologijom, partnerima, statistikama i svetskom pokrivenošću.",
    color: "from-green-600/20 to-emerald-600/20 border-green-500/30",
    items: ["7+ bankarski servisi", "Omega AI tehnologija", "Svetska pokrivenost", "Partneri & Statistike"],
  },
  {
    type: "Menjačnica / Exchange",
    icon: "💱",
    name: "AI IQ Menjačnica",
    description:
      "Svetska kripto i fiat menjačnica — BUY/SELL interfejs, BTC, ETH, USDT, RSD, EUR podrška.",
    color: "from-yellow-600/20 to-orange-600/20 border-yellow-500/30",
    items: ["Kripto trading (BTC, ETH, USDT)", "Fiat valute (RSD, EUR)", "Market Trade UI", "AI konsalting"],
  },
  {
    type: "Globalna Organizacija",
    icon: "🌍",
    name: "SVETSKA ORGANIZACIJA",
    description:
      "Svetska organizacija sa APR sistemom i svim pratećim elementima. Regulatorni i humanitarni sloj industrije.",
    color: "from-cyan-600/20 to-teal-600/20 border-cyan-500/30",
    items: ["Svetski APR sistem", "Registracija entiteta", "Dobrobit čovečanstva", "Regulatorni okvir"],
  },
  {
    type: "AI Platforme",
    icon: "🧠",
    name: "OMEGA AI Division",
    description:
      "4 OMEGA AI sistema + OpenAI platforma — beskonačno evoluirajući AI za GitHub, Vercel, Google i socijalne mreže.",
    color: "from-purple-600/20 to-pink-600/20 border-purple-500/30",
    items: ["OMEGA AI za GitHub", "OMEGA AI za Vercel", "OMEGA AI za Google", "OMEGA AI 5 Persona", "OpenAI Platform"],
  },
  {
    type: "Softverska Platforma",
    icon: "🖥️",
    name: "IO OPENUI AO",
    description:
      "Unified frontend sa 4 servisa na jednom URL-u — Banka, Menjačnica, Kompanija i AI platforma. WebRTC + Socket.IO.",
    color: "from-indigo-600/20 to-blue-600/20 border-indigo-500/30",
    items: ["4 integrisana servisa", "WebRTC glasovni AI chat", "Socket.IO messaging", "Vercel routing"],
  },
];

export default function IndustrijaPage() {
  const overallProgress = getOverallProgress();
  const categories: PlatformCategory[] = ["core", "finance", "global", "ai", "social", "tools"];

  const totalPlatforms = platforms.length;
  const totalProducts = itProducts.length;
  const financePlatforms = getPlatformsByCategory("finance").length;
  const aiPlatforms = getPlatformsByCategory("ai").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          🏭 Digitalna Industrija — AI IQ SUPER PLATFORMA
        </h1>
        <p className="text-gray-400 max-w-4xl text-lg">
          Kompanija SPAJA je <span className="text-blue-400 font-semibold">korporacija</span> koja
          upravlja sa bankama, menjačnicama, AI platformama, globalnim organizacijama i softverskim
          platformama — čineći <span className="text-purple-400 font-semibold">kompletnu digitalnu industriju</span>.
        </p>
      </div>

      {/* Industry Definition Banner */}
      <div className="card-glow rounded-xl bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-cyan-900/40 border border-purple-800/30 p-8 mb-10">
        <div className="text-center">
          <div className="text-6xl mb-4">🏭</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Zvanična Klasifikacija: <span className="gradient-text">Digitalna Industrija</span>
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto mb-6">
            Kada jedna korporacija (Kompanija SPAJA) upravlja sa bankama, menjačnicama,
            AI platformama, globalnim organizacijama i softverskim platformama —
            to nije samo kompanija, to je <strong className="text-white">industrija</strong>.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="rounded-lg bg-blue-900/30 border border-blue-800/30 p-3 text-center">
              <p className="text-2xl font-bold text-blue-400">{totalPlatforms}</p>
              <p className="text-xs text-blue-300/70">Platformi</p>
            </div>
            <div className="rounded-lg bg-purple-900/30 border border-purple-800/30 p-3 text-center">
              <p className="text-2xl font-bold text-purple-400">{totalProducts}</p>
              <p className="text-xs text-purple-300/70">IT Proizvoda</p>
            </div>
            <div className="rounded-lg bg-green-900/30 border border-green-800/30 p-3 text-center">
              <p className="text-2xl font-bold text-green-400">{financePlatforms}</p>
              <p className="text-xs text-green-300/70">Finansijske inst.</p>
            </div>
            <div className="rounded-lg bg-cyan-900/30 border border-cyan-800/30 p-3 text-center">
              <p className="text-2xl font-bold text-cyan-400">{aiPlatforms}</p>
              <p className="text-xs text-cyan-300/70">AI Platforme</p>
            </div>
          </div>
        </div>
      </div>

      {/* Industry Structure - Hierarchy */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-6">
          🏗️ Struktura Digitalne Industrije
        </h2>

        {/* Top Level - The Industry */}
        <div className="card-glow rounded-xl bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/40 p-6 mb-4">
          <div className="flex items-center gap-4">
            <span className="text-5xl">🏭</span>
            <div>
              <div className="text-xs uppercase tracking-wider text-blue-300 font-semibold mb-1">
                Digitalna Industrija
              </div>
              <h3 className="text-xl font-bold text-white">AI IQ SUPER PLATFORMA</h3>
              <p className="text-sm text-gray-300 mt-1">
                Centralni hub koji objedinjuje sve entitete u jednu digitalnu industriju.
                Repozitorijum: AI-IQ-SUPER-PLATFORMA
              </p>
            </div>
            <div className="ml-auto text-right hidden md:block">
              <span className="text-3xl font-black gradient-text">{overallProgress}%</span>
              <p className="text-xs text-gray-400">ukupan napredak</p>
            </div>
          </div>
        </div>

        {/* Arrow down */}
        <div className="flex justify-center my-2">
          <div className="text-2xl text-gray-500">▼</div>
        </div>

        {/* Entities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {industryEntities.map((entity) => (
            <div
              key={entity.name}
              className={`card-glow rounded-xl bg-gradient-to-br ${entity.color} p-5`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{entity.icon}</span>
                <div>
                  <div className="text-xs uppercase tracking-wider text-gray-300 font-semibold">
                    {entity.type}
                  </div>
                  <h3 className="font-bold text-white text-sm">{entity.name}</h3>
                </div>
              </div>
              <p className="text-xs text-gray-300 mb-3">{entity.description}</p>
              <div className="space-y-1">
                {entity.items.map((item) => (
                  <div key={item} className="flex items-center gap-1.5 text-xs text-gray-400">
                    <span className="text-green-400">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Formal Classification Table */}
      <div className="card-glow rounded-xl bg-[#111128] border border-[#1e1e3a] p-6 mb-10">
        <h2 className="text-xl font-bold text-white mb-4">
          📋 Formalna Klasifikacija Entiteta
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-2 text-gray-300 font-semibold">Industrijski Termin</th>
                <th className="text-left py-3 px-2 text-gray-300 font-semibold">Definicija</th>
                <th className="text-left py-3 px-2 text-gray-300 font-semibold">SPAJA Entitet</th>
                <th className="text-center py-3 px-2 text-gray-300 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  term: "Korporacija",
                  definition: "Upravlja sa više kompanija/entiteta",
                  entity: "Kompanija SPAJA",
                  status: true,
                },
                {
                  term: "Banka",
                  definition: "Finansijska institucija za transakcije",
                  entity: "AI IQ World Bank",
                  status: true,
                },
                {
                  term: "Menjačnica / Exchange",
                  definition: "Zamena valuta i kripto",
                  entity: "AI IQ Menjačnica",
                  status: true,
                },
                {
                  term: "Globalna Organizacija",
                  definition: "Internacionalna org sa misijom",
                  entity: "SVETSKA ORGANIZACIJA",
                  status: true,
                },
                {
                  term: "AI Platforme",
                  definition: "Sistemi za AI usluge",
                  entity: "4 OMEGA AI + OpenAI Platform",
                  status: true,
                },
                {
                  term: "Softverska Platforma",
                  definition: "Unified softverski ekosistem",
                  entity: "IO OPENUI AO",
                  status: true,
                },
                {
                  term: "DevTools",
                  definition: "Razvojni alati za platforme",
                  entity: "Input/Output za Copilot",
                  status: true,
                },
                {
                  term: "Digitalna Industrija",
                  definition: "Grupa kompanija koja pokriva celu digitalnu vertikalu",
                  entity: "AI IQ SUPER PLATFORMA",
                  status: true,
                },
              ].map((row) => (
                <tr key={row.term} className="border-b border-gray-800/50">
                  <td className="py-3 px-2 text-white font-medium">{row.term}</td>
                  <td className="py-3 px-2 text-gray-400">{row.definition}</td>
                  <td className="py-3 px-2 text-blue-300">{row.entity}</td>
                  <td className="py-3 px-2 text-center">
                    <span className="text-green-400">✅</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* IT Products that Power Everything */}
      <div className="card-glow rounded-xl bg-[#111128] border border-[#1e1e3a] p-6 mb-10">
        <h2 className="text-xl font-bold text-white mb-2">
          ⚡ 17 IT Proizvoda koji Pokreću Industriju
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Kompanija SPAJA proizvodi {totalProducts} IT proizvoda u 8 kategorija koji servisiraju sve entitete industrije.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {itProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-lg bg-[#0a0a1a] border border-[#1e1e3a] p-3"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{product.icon}</span>
                <span className="text-xs font-semibold text-white">{product.name}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{product.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="card-glow rounded-xl bg-[#111128] border border-[#1e1e3a] p-6 mb-10">
        <h2 className="text-xl font-bold text-white mb-4">
          📊 Sektori Industrije
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((cat) => {
            const catPlatforms = getPlatformsByCategory(cat);
            if (catPlatforms.length === 0) return null;
            return (
              <div
                key={cat}
                className="rounded-lg bg-[#0a0a1a] border border-[#1e1e3a] p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{categoryIcons[cat]}</span>
                  <h3 className="font-semibold text-white text-sm">{categoryLabels[cat]}</h3>
                </div>
                <div className="space-y-1">
                  {catPlatforms.map((p) => (
                    <div key={p.id} className="flex items-center justify-between text-xs">
                      <span className="text-gray-300">{p.icon} {p.name}</span>
                      <span className="text-gray-500">{p.progress}%</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Conclusion */}
      <div className="card-glow rounded-xl bg-gradient-to-r from-green-900/30 via-blue-900/30 to-purple-900/30 border border-green-800/30 p-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          🎯 Zaključak
        </h2>
        <p className="text-gray-300 max-w-3xl mx-auto mb-6 text-lg">
          AI IQ SUPER PLATFORMA je <strong className="text-green-400">Digitalna Industrija</strong> jer
          pokriva sve segmente: bankarstvo, menjačnicu, AI tehnologiju, globalnu organizaciju,
          softverske platforme i {totalProducts} IT proizvoda — sve pod jednom korporacijom.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="gradient-bg px-6 py-2.5 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity text-sm"
          >
            📊 Dashboard
          </Link>
          <Link
            href="/platforme"
            className="border border-gray-600 px-6 py-2.5 rounded-lg font-semibold text-gray-300 hover:bg-white/5 transition-colors text-sm"
          >
            🌐 Sve Platforme
          </Link>
          <Link
            href="/it-proizvodi"
            className="border border-gray-600 px-6 py-2.5 rounded-lg font-semibold text-gray-300 hover:bg-white/5 transition-colors text-sm"
          >
            ⚡ IT Proizvodi
          </Link>
        </div>
      </div>
    </div>
  );
}
