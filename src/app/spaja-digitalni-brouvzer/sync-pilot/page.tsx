import Link from 'next/link';

export const metadata = { title: 'SPAJA Brouvzer — probna sinhronizacija' };

export default function SyncPilotPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6 text-gray-100">
      <Link href="/spaja-digitalni-brouvzer" className="text-teal-300 underline">Nazad u pregledač</Link>
      <h1 className="text-3xl font-bold">Probna sinhronizacija bookmarkova</h1>
      <p>Lokalni razvojni pilot za dva učesnika. Zasebna probna kolekcija koristi CRDT i WebRTC DataChannel sa obaveznom nezavisnom proverom otiska na oba uređaja.</p>
      <p className="rounded border border-amber-500 p-4">Samo izmišljeni bookmarkovi. Lokalna probna baza nije šifrovana na disku. Postojeća istorija i bookmarkovi pregledača se ne uvoze. Produkcioni rad, TURN i fizički uređaji zahtevaju dodatne provere.</p>
      <h2 className="text-xl font-semibold">Pokretanje iz izvornog koda</h2>
      <pre className="overflow-x-auto rounded bg-gray-900 p-4">{'cd pilot/brouvzer\nnpm ci --ignore-scripts\nnpm run build\nnpm start'}</pre>
      <p>Otvorite <code>http://127.0.0.1:4320</code> na računaru gde pilot radi. Stranica sa uputstvom ne pokreće servis.</p>
      <p>Detalji, granice zaštite i postupak provere nalaze se u <code>docs/BROUVZER-SYNC-PILOT.md</code>. Inkognito pilot isključuje trajno skladište i mrežno uparivanje. Posle prekida veze potrebno je novo uparivanje.</p>
    </main>
  );
}
