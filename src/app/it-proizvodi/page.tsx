import {
  itProducts,
  productCategoryLabels,
  productCategoryIcons,
  type ITProductCategory,
} from "@/lib/it-products";

export const metadata = {
  title: "IT Proizvodi — Kompanija SPAJA",
  description:
    "IT proizvodi koji ubrzavaju sve procese i nadograđuju sve platforme na 100%.",
};

export default function ITProizvodiPage() {
  const categories: ITProductCategory[] = [
    "integration",
    "acceleration",
    "data",
    "monitoring",
    "security",
    "ai",
    "deployment",
    "communication",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">
          ⚡ IT Proizvodi — Kompanija SPAJA
        </h1>
        <p className="text-gray-400">
          IT proizvodi koji ubrzavaju sve procese i nadograđuju sve platforme
          u svakom smislu da sve ode na 100%
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {categories.map((cat) => {
          const count = itProducts.filter((p) => p.category === cat).length;
          return (
            <div
              key={cat}
              className="card-glow rounded-xl bg-[#111128] border border-[#1e1e3a] p-4 text-center"
            >
              <span className="text-2xl">{productCategoryIcons[cat]}</span>
              <p className="text-lg font-bold text-white mt-1">{count}</p>
              <p className="text-xs text-gray-400">
                {productCategoryLabels[cat]}
              </p>
            </div>
          );
        })}
      </div>

      {/* Products by Category */}
      {categories.map((cat) => {
        const categoryProducts = itProducts.filter(
          (p) => p.category === cat
        );
        if (categoryProducts.length === 0) return null;

        return (
          <div key={cat} className="mb-12">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span>{productCategoryIcons[cat]}</span>
              {productCategoryLabels[cat]}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoryProducts.map((product) => (
                <div
                  key={product.id}
                  className="card-glow rounded-xl bg-[#111128] border border-[#1e1e3a] p-6"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{product.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white">
                          {product.name}
                        </h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            product.impact === "high"
                              ? "bg-green-900/30 text-green-400 border border-green-800/30"
                              : product.impact === "medium"
                                ? "bg-yellow-900/30 text-yellow-400 border border-yellow-800/30"
                                : "bg-gray-900/30 text-gray-400 border border-gray-800/30"
                          }`}
                        >
                          {product.impact === "high"
                            ? "Visok uticaj"
                            : product.impact === "medium"
                              ? "Srednji uticaj"
                              : "Nizak uticaj"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">
                        {product.description}
                      </p>

                      <div className="mt-4">
                        <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                          Funkcionalnosti
                        </h4>
                        <div className="grid grid-cols-2 gap-1">
                          {product.features.map((feature) => (
                            <div
                              key={feature}
                              className="flex items-center gap-1.5 text-xs text-gray-400"
                            >
                              <span className="text-green-400">✓</span>
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-800">
                        <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                          Ciljne platforme
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {product.targetPlatforms.map((tp) => (
                            <span
                              key={tp}
                              className="text-xs px-2 py-0.5 rounded-full bg-blue-900/20 text-blue-300 border border-blue-800/20"
                            >
                              {tp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Summary */}
      <div className="card-glow rounded-xl bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-800/30 p-8 mt-8">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          🎯 Misija: Sve na 100%
        </h2>
        <p className="text-gray-300 text-center max-w-2xl mx-auto">
          Svi IT proizvodi Kompanije SPAJA rade zajedno da ubrzaju razvoj,
          obezbede sigurnost, omoguće monitoring i automatizuju deployment
          svih platformi. Kada sve dostignu 100%, celokupan ekosistem se
          plasira na Vercel ▲ za globalnu produkciju.
        </p>
      </div>
    </div>
  );
}
