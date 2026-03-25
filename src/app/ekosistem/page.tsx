import Link from "next/link";

export const metadata = {
  title: "SPAJA Ekosistem Hub — IO OPENUI AO Softver",
  description:
    "Analiza IO OPENUI AO softvera — unified frontend koji spaja sve platforme Kompanije SPAJA na jednom mestu. Spremno za primenu na sve platforme.",
};

const readyItems = [
  {
    name: "Unified Frontend Landing Page",
    detail:
      'Profesionalni dark-theme landing sa 4 kartice servisa: Banka, Menjačnica, Kompanija, AI. Tagline: "Platforma koju svet još nije video".',
    status: "ready" as const,
  },
  {
    name: "AI IQ World Bank modul (/bank/)",
    detail:
      "Kompletan bankarski frontend sa hero sekcijom, opisom servisa, Omega AI tehnologijom. Stilizovan sa sopstvenim CSS.",
    status: "ready" as const,
  },
  {
    name: "AI IQ Menjačnica modul (/exchange/)",
    detail:
      "Kripto menjačnica sa BUY/SELL interfejsom, podrškom za BTC, ETH, USDT, EUR, RSD. Fee: 2%.",
    status: "ready" as const,
  },
  {
    name: "IO OpenUI AO AI modul (/ai/)",
    detail:
      "AI platforma stranica sa opisom WebRTC glasovnog chata, Socket.IO, status panelom servisa. Linkovi ka .env.example.",
    status: "ready" as const,
  },
  {
    name: "Vercel konfiguracija (vercel.json)",
    detail:
      'Routing za /bank/*, /exchange/*, /company/*, /ai/* i catch-all. Output directory: "public". Version 2.',
    status: "ready" as const,
  },
  {
    name: "WebRTC klijent (put-a-realtime-webrtc/web/)",
    detail:
      "TypeScript WebRTC klijent sa RTCPeerConnection, DataChannel, createOffer/handleOffer metodama.",
    status: "ready" as const,
  },
  {
    name: "Socket.IO chat server (put-b-chat-socketio/)",
    detail:
      "Express + Socket.IO server sa event handler-ima za connection, chat message, disconnect.",
    status: "ready" as const,
  },
  {
    name: "WebRTC server (put-a-realtime-webrtc/server/)",
    detail:
      "Express server sa /api/webrtc/key endpoint za efemerne ključeve.",
    status: "ready" as const,
  },
  {
    name: "Vite build konfiguracija",
    detail:
      "vite.config.ts sa React pluginom, @ alias, output u public/, port 3000.",
    status: "ready" as const,
  },
  {
    name: "Environment varijable (.env.example)",
    detail:
      "OPENAI_API_KEY, VITE_APP_NAME, VITE_APP_URL, VERCEL_URL, feature flagovi, logging.",
    status: "ready" as const,
  },
  {
    name: "Dokumentacija",
    detail:
      "README.md, SETUP.md, DEPLOYMENT.md, CONTRIBUTING.md, SECURITY.md — kompletna dokumentacija.",
    status: "ready" as const,
  },
  {
    name: "Statistike na landing-u",
    detail:
      "4 integrisana servisa, ∞ AI mogućnosti, 1 ekosistem, 2026 godina lansiranja.",
    status: "ready" as const,
  },
];

const missingItems = [
  {
    name: 'Kompanija SPAJA modul (/company/) — fali folder',
    detail:
      'Navigacija linkuje na /company/ ali public/company/ direktorijum NE POSTOJI u repozitorijumu. Potrebno kreirati public/company/index.html sa sadržajem o Kompaniji SPAJA.',
    priority: "high" as const,
  },
  {
    name: "WebRTC — placeholder za generisanje ključeva",
    detail:
      'Server endpoint /api/webrtc/key vraća hardkodovani string "your-generated-key". Potrebno implementirati pravu OpenAI Realtime API integraciju za efemerne ključeve.',
    priority: "high" as const,
  },
  {
    name: "OpenAI API integracija u WebRTC server",
    detail:
      "Server koristi .env.example sa OPENAI_API_KEY ali ne importuje dotenv niti koristi ključ. Potrebno dodati: dotenv.config() + OpenAI SDK poziv za generisanje sesije.",
    priority: "high" as const,
  },
  {
    name: "WebRTC signaling server — nedostaje",
    detail:
      "WebRTC klijent ima createOffer/handleOffer ali nema signaling mehanizam (WebSocket ili HTTP) za razmenu SDP-a između peerova. Potrebno dodati signaling.",
    priority: "high" as const,
  },
  {
    name: "CORS middleware na serverima",
    detail:
      'Oba servera (WebRTC i Socket.IO) nemaju app.use(cors()) iako je cors dependency instaliran. Potrebno za cross-origin pozive sa Vercel frontend-a.',
    priority: "medium" as const,
  },
  {
    name: "React source fajlovi — nedostaju",
    detail:
      'package.json deklariše react i react-dom dependencies ali src/ direktorijum na root nivou ne postoji. Vite config očekuje React plugin ali nema JSX/TSX fajlova.',
    priority: "medium" as const,
  },
  {
    name: "Socket.IO klijentski interfejs",
    detail:
      "Socket.IO server radi ali nema odgovarajući frontend chat UI. Potreban chat widget ili stranica u public/ folderu.",
    priority: "medium" as const,
  },
  {
    name: "ICE candidate handling u WebRTC klijentu",
    detail:
      'Komentar kaže "Additional methods for handling ICE candidates can be added here" — ali nisu implementirani. Bez toga, WebRTC konekcija ne može da se uspostavi.',
    priority: "high" as const,
  },
  {
    name: "Testovi — ne postoje",
    detail:
      'README navodi "npm test" ali nema test fajlova niti test framework konfiguracije.',
    priority: "low" as const,
  },
  {
    name: "Serverless API rute za Vercel",
    detail:
      "WebRTC i Socket.IO serveri su standalone Express aplikacije. Za Vercel deployment trebaju serverless functions u /api direktorijumu ili separate hosting.",
    priority: "medium" as const,
  },
];

export default function EkosistemPage() {
  const readyCount = readyItems.length;
  const missingCount = missingItems.length;
  const highPriority = missingItems.filter((i) => i.priority === "high").length;
  const mediumPriority = missingItems.filter((i) => i.priority === "medium").length;
  const lowPriority = missingItems.filter((i) => i.priority === "low").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-blue-400 mb-4">
          <Link href="/it-proizvodi" className="hover:underline">
            ⚡ IT Proizvodi
          </Link>
          <span className="text-gray-600">→</span>
          <span>SPAJA Ekosistem Hub</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          🌐 SPAJA Ekosistem Hub — IO OPENUI AO
        </h1>
        <p className="text-gray-400 max-w-3xl">
          Softver iz repozitorijuma{" "}
          <a
            href="https://github.com/spaja86/IO-OPENUI-AO"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            IO-OPENUI-AO
          </a>{" "}
          koji može da se primeni na sve platforme. Analiza spremnosti i
          detalji koji fale.
        </p>
      </div>

      {/* Promotion Banner */}
      <div className="card-glow rounded-xl bg-gradient-to-r from-purple-900/40 via-blue-900/40 to-cyan-900/40 border border-purple-800/30 p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="text-6xl animate-float">🌐</div>
          <div className="flex-1">
            <div className="inline-block bg-purple-600/30 text-purple-300 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
              ⭐ Ključni IT Proizvod
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              &ldquo;Platforma koju svet još nije video&rdquo;
            </h2>
            <p className="text-gray-300">
              IO OPENUI AO je <strong>unified frontend</strong> koji spaja 4
              servisa Kompanije SPAJA na jednom URL-u: Banka, Menjačnica,
              Kompanija i AI platforma. WebRTC glasovni AI chat, Socket.IO
              messaging, Vercel routing — sve već postoji i može da se primeni
              na ceo ekosistem.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href="https://github.com/spaja86/IO-OPENUI-AO"
              target="_blank"
              rel="noopener noreferrer"
              className="gradient-bg px-6 py-2.5 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity text-sm text-center"
            >
              🐙 GitHub Repo
            </a>
            <Link
              href="/platforme"
              className="border border-gray-600 px-6 py-2.5 rounded-lg font-semibold text-gray-300 hover:bg-white/5 transition-colors text-sm text-center"
            >
              📊 Sve Platforme
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="rounded-xl bg-green-900/20 border border-green-800/30 p-4 text-center">
          <p className="text-3xl font-bold text-green-400">{readyCount}</p>
          <p className="text-xs text-green-400/70 mt-1">Spremno ✅</p>
        </div>
        <div className="rounded-xl bg-red-900/20 border border-red-800/30 p-4 text-center">
          <p className="text-3xl font-bold text-red-400">{missingCount}</p>
          <p className="text-xs text-red-400/70 mt-1">Fali detalja ⚠️</p>
        </div>
        <div className="rounded-xl bg-red-900/20 border border-red-800/30 p-4 text-center">
          <p className="text-3xl font-bold text-red-400">{highPriority}</p>
          <p className="text-xs text-red-400/70 mt-1">Visok prioritet 🔴</p>
        </div>
        <div className="rounded-xl bg-yellow-900/20 border border-yellow-800/30 p-4 text-center">
          <p className="text-3xl font-bold text-yellow-400">{mediumPriority}</p>
          <p className="text-xs text-yellow-400/70 mt-1">Srednji prioritet 🟡</p>
        </div>
        <div className="rounded-xl bg-gray-900/40 border border-gray-800/30 p-4 text-center">
          <p className="text-3xl font-bold text-gray-400">{lowPriority}</p>
          <p className="text-xs text-gray-400/70 mt-1">Nizak prioritet ⚪</p>
        </div>
      </div>

      {/* Architecture */}
      <div className="card-glow rounded-xl bg-[#111128] border border-[#1e1e3a] p-6 mb-8">
        <h2 className="text-lg font-bold text-white mb-4">
          🏗️ Arhitektura IO OPENUI AO ekosistema
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              icon: "🏦",
              name: "AI IQ World Bank",
              path: "/bank/",
              desc: "Bankarski servis — finansije, transferi, Omega AI",
              color: "border-purple-800/30 bg-purple-900/10",
            },
            {
              icon: "💱",
              name: "AI IQ Menjačnica",
              path: "/exchange/",
              desc: "Kripto trading — BTC, ETH, USDT, EUR, RSD",
              color: "border-blue-800/30 bg-blue-900/10",
            },
            {
              icon: "🏢",
              name: "Kompanija SPAJA",
              path: "/company/",
              desc: "IT usluge, web razvoj, AI integracije",
              color: "border-green-800/30 bg-green-900/10",
            },
            {
              icon: "🤖",
              name: "IO OpenUI AO",
              path: "/ai/",
              desc: "WebRTC AI chat, Socket.IO, real-time",
              color: "border-yellow-800/30 bg-yellow-900/10",
            },
          ].map((module) => (
            <div
              key={module.path}
              className={`rounded-lg border p-4 ${module.color}`}
            >
              <span className="text-2xl">{module.icon}</span>
              <h3 className="font-semibold text-white text-sm mt-2">
                {module.name}
              </h3>
              <code className="text-xs text-blue-300 bg-blue-900/20 px-1.5 py-0.5 rounded mt-1 inline-block">
                {module.path}
              </code>
              <p className="text-xs text-gray-400 mt-2">{module.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-lg bg-[#0a0a1a] border border-[#1e1e3a]">
          <p className="text-xs text-gray-400">
            <span className="text-blue-400 font-semibold">vercel.json routing:</span>{" "}
            <code className="text-green-400">
              /bank/* → /bank/$1 | /exchange/* → /exchange/$1 | /company/* → /company/$1 | /ai/* → /ai/$1 | /* → /$1
            </code>
          </p>
        </div>
      </div>

      {/* What's Ready */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">
          ✅ Šta je spremno ({readyCount} stavki)
        </h2>
        <div className="space-y-2">
          {readyItems.map((item) => (
            <div
              key={item.name}
              className="card-glow rounded-lg bg-[#111128] border border-[#1e1e3a] p-4"
            >
              <div className="flex items-start gap-3">
                <span className="text-green-400 mt-0.5">✅</span>
                <div>
                  <h3 className="font-semibold text-white text-sm">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">{item.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What's Missing */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">
          ⚠️ Detalji koji fale ({missingCount} stavki)
        </h2>
        <div className="space-y-2">
          {missingItems.map((item) => (
            <div
              key={item.name}
              className={`card-glow rounded-lg bg-[#111128] border p-4 ${
                item.priority === "high"
                  ? "border-red-800/40"
                  : item.priority === "medium"
                    ? "border-yellow-800/40"
                    : "border-gray-800/40"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 ${
                    item.priority === "high"
                      ? "text-red-400"
                      : item.priority === "medium"
                        ? "text-yellow-400"
                        : "text-gray-400"
                  }`}
                >
                  {item.priority === "high"
                    ? "🔴"
                    : item.priority === "medium"
                      ? "🟡"
                      : "⚪"}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white text-sm">
                      {item.name}
                    </h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        item.priority === "high"
                          ? "bg-red-900/30 text-red-400 border border-red-800/30"
                          : item.priority === "medium"
                            ? "bg-yellow-900/30 text-yellow-400 border border-yellow-800/30"
                            : "bg-gray-900/30 text-gray-400 border border-gray-800/30"
                      }`}
                    >
                      {item.priority === "high"
                        ? "Visok"
                        : item.priority === "medium"
                          ? "Srednji"
                          : "Nizak"}{" "}
                      prioritet
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{item.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How to Apply to All Platforms */}
      <div className="card-glow rounded-xl bg-[#111128] border border-[#1e1e3a] p-6 mb-8">
        <h2 className="text-lg font-bold text-white mb-4">
          🔧 Kako primeniti na sve platforme
        </h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-blue-400 font-bold text-sm mt-0.5">1.</span>
            <div>
              <h3 className="font-semibold text-white text-sm">
                Kreirati /company/ modul
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Dodati public/company/index.html i styles.css po uzoru na
                /bank/ i /exchange/ module. Ovo popunjava poslednji prazan
                slot u ekosistemu.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-blue-400 font-bold text-sm mt-0.5">2.</span>
            <div>
              <h3 className="font-semibold text-white text-sm">
                Implementirati OpenAI Realtime API
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Zameniti placeholder ključ u WebRTC serveru sa pravim OpenAI
                API pozivom. Dodati dotenv.config() i openai SDK.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-blue-400 font-bold text-sm mt-0.5">3.</span>
            <div>
              <h3 className="font-semibold text-white text-sm">
                Dodati WebRTC signaling + ICE candidates
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Implementirati signaling server (WebSocket) za razmenu SDP
                offer/answer i ICE candidates između peerova.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-blue-400 font-bold text-sm mt-0.5">4.</span>
            <div>
              <h3 className="font-semibold text-white text-sm">
                Dodati CORS i Socket.IO chat UI
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Aktivirati CORS middleware na oba servera. Kreirati chat widget
                UI u public/ folderu koji koristi Socket.IO klijent.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-blue-400 font-bold text-sm mt-0.5">5.</span>
            <div>
              <h3 className="font-semibold text-white text-sm">
                Deploy na Vercel
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Static frontend deploy na Vercel (vercel.json je spreman).
                WebRTC i Socket.IO serveri zahtevaju serverless functions ili
                separate Node.js hosting.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary CTA */}
      <div className="card-glow rounded-xl bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-800/30 p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">
          📊 Zaključak: {readyCount} od {readyCount + missingCount} stavki spremno
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto mb-4">
          IO OPENUI AO softver je <strong className="text-green-400">većinski spreman</strong> za
          primenu na sve platforme. Samo{" "}
          <strong className="text-yellow-400">{highPriority} kritičnih</strong> i{" "}
          <strong className="text-yellow-400">{mediumPriority} srednjih</strong> detalja
          fali za potpunu integraciju. Nakon rešavanja, ceo SPAJA ekosistem
          može ići na Vercel ▲.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://github.com/spaja86/IO-OPENUI-AO"
            target="_blank"
            rel="noopener noreferrer"
            className="gradient-bg px-6 py-2.5 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity text-sm"
          >
            🐙 Otvori IO-OPENUI-AO
          </a>
          <Link
            href="/dashboard"
            className="border border-gray-600 px-6 py-2.5 rounded-lg font-semibold text-gray-300 hover:bg-white/5 transition-colors text-sm"
          >
            📊 Nazad na Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
