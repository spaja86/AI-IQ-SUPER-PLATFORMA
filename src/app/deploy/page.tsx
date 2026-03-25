import {
  platforms,
  getDeployStatusLabel,
  getDeployStatusColor,
  getDeployStats,
  getStatusLabel,
  getStatusColor,
  type DeployStatus,
} from "@/lib/platforms";
import ProgressBar from "@/components/ProgressBar";

export const metadata = {
  title: "Deploy Status — Kompanija SPAJA",
  description:
    "Vercel deployment status, domen upravljanje i deploy vodič za sve platforme.",
};

function DeployBadge({ status }: { status: DeployStatus }) {
  const colorMap: Record<DeployStatus, string> = {
    deployed: "bg-green-900/30 text-green-400 border-green-800/30",
    failing: "bg-red-900/30 text-red-400 border-red-800/30",
    "not-deployed": "bg-gray-900/30 text-gray-400 border-gray-800/30",
    "no-domain": "bg-orange-900/30 text-orange-400 border-orange-800/30",
  };
  return (
    <span
      className={`text-xs px-2.5 py-1 rounded-full border ${colorMap[status]}`}
    >
      {getDeployStatusLabel(status)}
    </span>
  );
}

export default function DeployPage() {
  const stats = getDeployStats();
  const failingPlatforms = platforms.filter(
    (p) => p.deploy.status === "failing"
  );
  const needDomainPlatforms = platforms.filter(
    (p) => p.deploy.status === "no-domain"
  );
  const deployedPlatforms = platforms.filter(
    (p) => p.deploy.status === "deployed"
  );
  const notDeployedPlatforms = platforms.filter(
    (p) => p.deploy.status === "not-deployed"
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">
          🚀 Deploy Status & Vodič
        </h1>
        <p className="text-gray-400">
          Vercel deployment status, domeni i korak-po-korak vodič za svaku
          platformu
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl bg-green-900/20 border border-green-800/30 p-4 text-center">
          <p className="text-3xl font-bold text-green-400">{stats.deployed}</p>
          <p className="text-xs text-green-400/70 mt-1">Deployano ✅</p>
        </div>
        <div className="rounded-xl bg-red-900/20 border border-red-800/30 p-4 text-center">
          <p className="text-3xl font-bold text-red-400">{stats.failing}</p>
          <p className="text-xs text-red-400/70 mt-1">Deploy FAIL ❌</p>
        </div>
        <div className="rounded-xl bg-orange-900/20 border border-orange-800/30 p-4 text-center">
          <p className="text-3xl font-bold text-orange-400">
            {stats.noDomain}
          </p>
          <p className="text-xs text-orange-400/70 mt-1">Treba domen 🔴</p>
        </div>
        <div className="rounded-xl bg-gray-900/40 border border-gray-800/30 p-4 text-center">
          <p className="text-3xl font-bold text-gray-400">
            {stats.notDeployed}
          </p>
          <p className="text-xs text-gray-400/70 mt-1">Nije deployano ⬜</p>
        </div>
      </div>

      {/* Domain Summary */}
      <div className="card-glow rounded-xl bg-[#111128] border border-[#1e1e3a] p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">
          🌐 Pregled Domena
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-green-400 mb-3">
              ✅ Zakupljeni domeni ({stats.withDomain})
            </h3>
            <div className="space-y-2">
              {platforms
                .filter((p) => p.deploy.domain)
                .map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between bg-[#0a0a1a] rounded-lg px-4 py-2 border border-[#1e1e3a]"
                  >
                    <div className="flex items-center gap-2">
                      <span>{p.icon}</span>
                      <span className="text-sm text-white">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-blue-300 bg-blue-900/20 px-2 py-0.5 rounded">
                        {p.deploy.domain}
                      </code>
                      <DeployBadge status={p.deploy.status} />
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-orange-400 mb-3">
              🔴 Treba kupiti domen ({stats.needDomain})
            </h3>
            <div className="space-y-2">
              {platforms
                .filter(
                  (p) =>
                    !p.deploy.domain && p.deploy.status !== "not-deployed"
                )
                .map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between bg-[#0a0a1a] rounded-lg px-4 py-2 border border-[#1e1e3a]"
                  >
                    <div className="flex items-center gap-2">
                      <span>{p.icon}</span>
                      <span className="text-sm text-white">{p.name}</span>
                    </div>
                    <span className="text-xs text-orange-400">
                      Treba domen
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAILING DEPLOYS - Priority Fix */}
      {failingPlatforms.length > 0 && (
        <div className="card-glow rounded-xl bg-gradient-to-r from-red-900/30 to-orange-900/20 border border-red-800/30 p-6 mb-8">
          <h2 className="text-xl font-bold text-red-400 mb-2">
            🔥 HITNO: Deploy-ovi koji ne rade ({failingPlatforms.length})
          </h2>
          <p className="text-sm text-gray-300 mb-6">
            Ovi projekti imaju zakupljen domen ali deploy pada na Vercel-u. Evo
            tačno šta treba proveriti i podesiti:
          </p>

          {failingPlatforms.map((platform) => (
            <div
              key={platform.id}
              className="bg-[#0a0a1a]/80 rounded-xl border border-red-900/30 p-6 mb-4"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{platform.icon}</span>
                  <div>
                    <h3 className="font-bold text-white text-lg">
                      {platform.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-xs text-blue-300 bg-blue-900/20 px-2 py-0.5 rounded">
                        {platform.deploy.domain}
                      </code>
                      <span className={`text-xs ${getStatusColor(platform.status)}`}>
                        {getStatusLabel(platform.status)}
                      </span>
                    </div>
                  </div>
                </div>
                <DeployBadge status={platform.deploy.status} />
              </div>

              {/* Fix Instructions */}
              <div className="bg-[#111128] rounded-lg p-4 border border-[#1e1e3a]">
                <h4 className="text-sm font-bold text-yellow-400 mb-3">
                  🔧 Kako popraviti na Vercel-u:
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-400 font-bold">1.</span>
                    <div>
                      <p className="text-white">
                        Idi na{" "}
                        <code className="text-blue-300 bg-blue-900/20 px-1.5 py-0.5 rounded text-xs">
                          vercel.com → Projects →{" "}
                          {platform.deploy.vercelProject}
                        </code>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-400 font-bold">2.</span>
                    <div>
                      <p className="text-white">
                        Otvori{" "}
                        <code className="text-blue-300 bg-blue-900/20 px-1.5 py-0.5 rounded text-xs">
                          Settings → General
                        </code>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-400 font-bold">3.</span>
                    <div>
                      <p className="text-white">Podesi ova polja:</p>
                      <div className="mt-2 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-xs w-36">
                            Framework Preset:
                          </span>
                          <code className="text-green-300 bg-green-900/20 px-2 py-0.5 rounded text-xs">
                            {platform.deploy.framework}
                          </code>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-xs w-36">
                            Build Command:
                          </span>
                          <code className="text-green-300 bg-green-900/20 px-2 py-0.5 rounded text-xs">
                            {platform.deploy.buildCommand || "(prazan — ostavi prazno)"}
                          </code>
                        </div>
                        {platform.deploy.outputDir && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-xs w-36">
                              Output Directory:
                            </span>
                            <code className="text-green-300 bg-green-900/20 px-2 py-0.5 rounded text-xs">
                              {platform.deploy.outputDir}
                            </code>
                          </div>
                        )}
                        {platform.deploy.rootDir && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-xs w-36">
                              Root Directory:
                            </span>
                            <code className="text-green-300 bg-green-900/20 px-2 py-0.5 rounded text-xs">
                              {platform.deploy.rootDir}
                            </code>
                          </div>
                        )}
                        {platform.deploy.nodeVersion && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-xs w-36">
                              Node.js Version:
                            </span>
                            <code className="text-green-300 bg-green-900/20 px-2 py-0.5 rounded text-xs">
                              {platform.deploy.nodeVersion}
                            </code>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-400 font-bold">4.</span>
                    <p className="text-white">
                      Klikni{" "}
                      <code className="text-blue-300 bg-blue-900/20 px-1.5 py-0.5 rounded text-xs">
                        Save
                      </code>{" "}
                      pa idi na{" "}
                      <code className="text-blue-300 bg-blue-900/20 px-1.5 py-0.5 rounded text-xs">
                        Deployments → Redeploy
                      </code>
                    </p>
                  </div>
                </div>
                {platform.deploy.notes && (
                  <div className="mt-4 p-3 bg-yellow-900/10 border border-yellow-800/20 rounded-lg">
                    <p className="text-xs text-yellow-300">
                      💡 {platform.deploy.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <a
                  href={platform.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1 bg-[#111128] px-3 py-1.5 rounded-lg border border-[#1e1e3a]"
                >
                  🐙 GitHub Repo
                </a>
                <a
                  href={`https://vercel.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1 bg-[#111128] px-3 py-1.5 rounded-lg border border-[#1e1e3a]"
                >
                  ▲ Vercel Dashboard
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NEED DOMAIN */}
      {needDomainPlatforms.length > 0 && (
        <div className="card-glow rounded-xl bg-[#111128] border border-orange-800/30 p-6 mb-8">
          <h2 className="text-xl font-bold text-orange-400 mb-2">
            🌐 Treba kupiti domen ({needDomainPlatforms.length})
          </h2>
          <p className="text-sm text-gray-300 mb-6">
            Ove platforme su spremne za deploy ali im treba custom domen na
            Vercel-u.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">
                    Platforma
                  </th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">
                    Preporučeni domen
                  </th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">
                    Framework
                  </th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">
                    Napomena
                  </th>
                </tr>
              </thead>
              <tbody>
                {needDomainPlatforms.map((p) => (
                  <tr key={p.id} className="border-b border-gray-800/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span>{p.icon}</span>
                        <span className="text-white font-medium">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <code className="text-xs text-cyan-300 bg-cyan-900/20 px-2 py-0.5 rounded">
                        {p.id}.com
                      </code>
                    </td>
                    <td className="py-3 px-4">
                      <code className="text-xs text-blue-300">
                        {p.deploy.framework}
                      </code>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-400">
                      {p.deploy.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-[#0a0a1a] rounded-lg border border-[#1e1e3a]">
            <h4 className="text-sm font-bold text-white mb-2">
              📋 Kako kupiti domen na Vercel-u:
            </h4>
            <ol className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">1.</span>
                <span>
                  Idi na{" "}
                  <code className="text-blue-300 bg-blue-900/20 px-1 rounded text-xs">
                    vercel.com/domains
                  </code>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">2.</span>
                <span>Unesi željeni domen i kupi ga</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">3.</span>
                <span>
                  U projektu: Settings → Domains → dodaj kupljeni domen
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">4.</span>
                <span>Vercel automatski podesi SSL i DNS</span>
              </li>
            </ol>
          </div>
        </div>
      )}

      {/* DEPLOYED */}
      {deployedPlatforms.length > 0 && (
        <div className="card-glow rounded-xl bg-[#111128] border border-green-800/30 p-6 mb-8">
          <h2 className="text-xl font-bold text-green-400 mb-4">
            ✅ Uspešno deployano ({deployedPlatforms.length})
          </h2>
          <div className="space-y-3">
            {deployedPlatforms.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between bg-[#0a0a1a] rounded-lg px-4 py-3 border border-[#1e1e3a]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{p.icon}</span>
                  <div>
                    <span className="text-sm font-medium text-white">
                      {p.name}
                    </span>
                    <p className="text-xs text-gray-400">
                      {p.deploy.framework} •{" "}
                      {p.deploy.domain || "Vercel subdomen"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ProgressBar
                    progress={p.progress}
                    size="sm"
                    showLabel={false}
                  />
                  <span className="text-xs text-gray-400 w-10 text-right">
                    {p.progress}%
                  </span>
                  <DeployBadge status={p.deploy.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NOT DEPLOYED (planning) */}
      {notDeployedPlatforms.length > 0 && (
        <div className="card-glow rounded-xl bg-[#111128] border border-[#1e1e3a] p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-400 mb-4">
            ⬜ Još nije spremno za deploy ({notDeployedPlatforms.length})
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Ovi projekti su u fazi planiranja ili ranog razvoja. Deploy će biti
            moguć kada dostignu dovoljnu zrelost.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {notDeployedPlatforms.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between bg-[#0a0a1a] rounded-lg px-4 py-3 border border-[#1e1e3a]"
              >
                <div className="flex items-center gap-2">
                  <span>{p.icon}</span>
                  <div>
                    <span className="text-sm text-white">{p.name}</span>
                    <p className="text-xs text-gray-500">{p.deploy.notes}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{p.progress}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Platforms Table */}
      <div className="card-glow rounded-xl bg-[#111128] border border-[#1e1e3a] p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">
          📋 Kompletna tabela svih platformi
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-3 text-gray-400 font-medium">
                  Platforma
                </th>
                <th className="text-left py-3 px-3 text-gray-400 font-medium">
                  Progres
                </th>
                <th className="text-left py-3 px-3 text-gray-400 font-medium">
                  Status
                </th>
                <th className="text-left py-3 px-3 text-gray-400 font-medium">
                  Deploy
                </th>
                <th className="text-left py-3 px-3 text-gray-400 font-medium">
                  Domen
                </th>
                <th className="text-left py-3 px-3 text-gray-400 font-medium">
                  Framework
                </th>
              </tr>
            </thead>
            <tbody>
              {platforms.map((p) => (
                <tr key={p.id} className="border-b border-gray-800/50">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span>{p.icon}</span>
                      <span className="text-white font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16">
                        <ProgressBar
                          progress={p.progress}
                          size="sm"
                          showLabel={false}
                        />
                      </div>
                      <span className="text-xs text-gray-400">
                        {p.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-xs ${getStatusColor(p.status)}`}
                    >
                      {getStatusLabel(p.status)}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-xs ${getDeployStatusColor(p.deploy.status)}`}
                    >
                      {getDeployStatusLabel(p.deploy.status)}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {p.deploy.domain ? (
                      <code className="text-xs text-blue-300 bg-blue-900/20 px-1.5 py-0.5 rounded">
                        {p.deploy.domain}
                      </code>
                    ) : (
                      <span className="text-xs text-gray-500">—</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <code className="text-xs text-gray-400">
                      {p.deploy.framework}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Overall Deploy Readiness */}
      <div className="card-glow rounded-xl bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-800/30 p-6">
        <h3 className="text-lg font-bold text-white mb-3">
          🎯 Kada ćemo biti svuda na 100%?
        </h3>
        <div className="space-y-3 text-sm text-gray-300">
          <p>
            📌 <span className="text-white font-semibold">Korak 1</span> — Popravi deploy za{" "}
            <span className="text-red-400">
              {failingPlatforms.map((p) => p.name).join(" i ")}
            </span>{" "}
            (podesi Framework Preset i Build Command na Vercel-u)
          </p>
          <p>
            📌 <span className="text-white font-semibold">Korak 2</span> — Kupi domene za{" "}
            <span className="text-orange-400">
              {needDomainPlatforms.map((p) => p.name).join(", ")}
            </span>
          </p>
          <p>
            📌 <span className="text-white font-semibold">Korak 3</span> — Nastavi razvoj platformi koje su u ranoj fazi
            (OpenAI Platform, OMEGA AI sistemi)
          </p>
          <p>
            📌 <span className="text-white font-semibold">Korak 4</span> — Završi IO OPENUI AO integraciju (/company
            modul, WebRTC, OpenAI ključ)
          </p>
          <p className="mt-4 text-white font-semibold">
            ✨ Kada sve bude na 100% → automatski deploy svih platformi sa
            custom domenima na Vercel ▲
          </p>
        </div>
      </div>
    </div>
  );
}
