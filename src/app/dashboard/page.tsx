import {
  platforms,
  getOverallProgress,
  categoryLabels,
  categoryIcons,
  getPlatformsByCategory,
  getStatusLabel,
  getStatusColor,
  type PlatformCategory,
} from "@/lib/platforms";
import { itProducts } from "@/lib/it-products";
import ProgressBar from "@/components/ProgressBar";

export const metadata = {
  title: "Dashboard — Kompanija SPAJA",
  description: "Centralni dashboard za praćenje napretka svih platformi.",
};

export default function DashboardPage() {
  const overallProgress = getOverallProgress();
  const categories: PlatformCategory[] = [
    "core",
    "finance",
    "ai",
    "social",
    "tools",
  ];
  const readyCount = platforms.filter((p) => p.status === "ready").length;
  const activeCount = platforms.filter((p) => p.status === "active").length;
  const devCount = platforms.filter((p) => p.status === "development").length;
  const planCount = platforms.filter((p) => p.status === "planning").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">
          📊 Dashboard — Kompanija SPAJA
        </h1>
        <p className="text-gray-400">
          Centralni pregled napretka svih platformi i IT proizvoda
        </p>
      </div>

      {/* Overall Progress Card */}
      <div className="card-glow rounded-xl bg-[#111128] border border-[#1e1e3a] p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">
              🎯 Ukupan napredak ka Vercel deploy-u
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Sve mora biti na 100% pre plasiranja na Vercel ▲
            </p>
          </div>
          <div className="text-right">
            <span className="text-5xl font-black gradient-text">
              {overallProgress}%
            </span>
          </div>
        </div>
        <ProgressBar progress={overallProgress} size="lg" showLabel={false} />
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl bg-green-900/20 border border-green-800/30 p-4 text-center">
          <p className="text-3xl font-bold text-green-400">{readyCount}</p>
          <p className="text-xs text-green-400/70 mt-1">Spremno ✅</p>
        </div>
        <div className="rounded-xl bg-blue-900/20 border border-blue-800/30 p-4 text-center">
          <p className="text-3xl font-bold text-blue-400">{activeCount}</p>
          <p className="text-xs text-blue-400/70 mt-1">Aktivno 🟢</p>
        </div>
        <div className="rounded-xl bg-yellow-900/20 border border-yellow-800/30 p-4 text-center">
          <p className="text-3xl font-bold text-yellow-400">{devCount}</p>
          <p className="text-xs text-yellow-400/70 mt-1">U razvoju 🟡</p>
        </div>
        <div className="rounded-xl bg-gray-900/40 border border-gray-800/30 p-4 text-center">
          <p className="text-3xl font-bold text-gray-400">{planCount}</p>
          <p className="text-xs text-gray-400/70 mt-1">Planirano 📋</p>
        </div>
      </div>

      {/* Platforms by Category */}
      {categories.map((cat) => {
        const categoryPlatforms = getPlatformsByCategory(cat);
        if (categoryPlatforms.length === 0) return null;

        const categoryProgress = Math.round(
          categoryPlatforms.reduce((sum, p) => sum + p.progress, 0) /
            categoryPlatforms.length
        );

        return (
          <div key={cat} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">
                {categoryIcons[cat]} {categoryLabels[cat]}
              </h3>
              <span className="text-sm text-gray-400">
                Prosek: {categoryProgress}%
              </span>
            </div>
            <div className="space-y-3">
              {categoryPlatforms.map((platform) => (
                <div
                  key={platform.id}
                  className="card-glow rounded-lg bg-[#111128] border border-[#1e1e3a] p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{platform.icon}</span>
                      <div>
                        <h4 className="font-semibold text-white text-sm">
                          {platform.name}
                        </h4>
                        <span
                          className={`text-xs ${getStatusColor(platform.status)}`}
                        >
                          {getStatusLabel(platform.status)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-white">
                        {platform.progress}%
                      </span>
                    </div>
                  </div>
                  <ProgressBar
                    progress={platform.progress}
                    size="sm"
                    showLabel={false}
                  />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {platform.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-1.5 py-0.5 rounded bg-blue-900/20 text-blue-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* IT Products Summary */}
      <div className="card-glow rounded-xl bg-[#111128] border border-[#1e1e3a] p-6 mt-8">
        <h3 className="text-lg font-bold text-white mb-4">
          ⚡ IT Proizvodi — Kompanija SPAJA ({itProducts.length} proizvoda)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {itProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-lg bg-[#0a0a1a] border border-[#1e1e3a] p-3"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{product.icon}</span>
                <span className="text-sm font-semibold text-white">
                  {product.name}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                {product.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Vercel Ready Check */}
      <div className="card-glow rounded-xl bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-800/30 p-6 mt-8">
        <h3 className="text-lg font-bold text-white mb-3">
          ▲ Vercel Deployment Status
        </h3>
        <div className="space-y-2">
          {[
            {
              check: "Next.js projekat konfigurisan",
              done: true,
            },
            {
              check: "TypeScript konfigurisan",
              done: true,
            },
            {
              check: "Tailwind CSS konfigurisan",
              done: true,
            },
            {
              check: "Vercel-kompatibilan build",
              done: true,
            },
            {
              check: "SEO metapodaci dodati",
              done: true,
            },
            {
              check: "Responsivan dizajn",
              done: true,
            },
            {
              check: "Sve platforme na 100%",
              done: overallProgress >= 100,
            },
          ].map((item) => (
            <div key={item.check} className="flex items-center gap-2 text-sm">
              <span>{item.done ? "✅" : "⬜"}</span>
              <span
                className={item.done ? "text-green-400" : "text-gray-400"}
              >
                {item.check}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
