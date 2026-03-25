import {
  platforms,
  categoryLabels,
  categoryIcons,
  getPlatformsByCategory,
  type PlatformCategory,
} from "@/lib/platforms";
import PlatformCard from "@/components/PlatformCard";

export const metadata = {
  title: "Platforme — Kompanija SPAJA",
  description: "Sve platforme u ekosistemu AI IQ SUPER PLATFORMA.",
};

export default function PlatformePage() {
  const categories: PlatformCategory[] = [
    "core",
    "finance",
    "ai",
    "social",
    "tools",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">
          🌐 Sve Platforme
        </h1>
        <p className="text-gray-400">
          Kompanija SPAJA upravlja sa {platforms.length} platformi u svom
          ekosistemu
        </p>
      </div>

      {categories.map((cat) => {
        const categoryPlatforms = getPlatformsByCategory(cat);
        if (categoryPlatforms.length === 0) return null;

        return (
          <div key={cat} className="mb-12">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span>{categoryIcons[cat]}</span>
              {categoryLabels[cat]}
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({categoryPlatforms.length}{" "}
                {categoryPlatforms.length === 1
                  ? "platforma"
                  : "platformi"})
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryPlatforms.map((platform) => (
                <PlatformCard key={platform.id} platform={platform} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
