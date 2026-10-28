import { getDevelopmentNetworkMapping } from '@/lib/deploy/spaja-network-development';

export default function SpajaNetworkSummary() {
  const mapping = getDevelopmentNetworkMapping();
  return (
    <section aria-labelledby="spaja-network-title" className="mx-auto my-6 max-w-7xl rounded-xl border border-zinc-700 bg-zinc-950 p-6 text-zinc-100">
      <p className="text-sm text-cyan-300">SPAJA Deploy · razvojna mreža · Caddy</p>
      <h2 id="spaja-network-title" className="mt-2 text-2xl font-semibold">{mapping.networkId}</h2>
      <p className="mt-3 text-zinc-300">Interni SPAJA ID bira aplikaciju. Javni domen se unosi zasebno, nakon potvrde registracije i vlasništva.</p>
      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        <div><dt>Javni domen</dt><dd>{mapping.publicDomain.candidate ?? 'Nije podešen'}</dd></div>
        <div><dt>Registracija i vlasništvo</dt><dd>Nisu potvrđeni</dd></div>
        <div><dt>Javni DNS / aktivacija</dt><dd>Nepotvrđen / blokirana</dd></div>
      </dl>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Mapiranje internih ID-jeva, poddomena, proksi ruta i TLS statusa</caption>
          <thead><tr>{['Aplikacija / SPAJA ID', 'Poddomen', 'Javni host', 'Proksi ruta', 'TLS sertifikat'].map(label => <th key={label} className="border-b border-zinc-700 p-3">{label}</th>)}</tr></thead>
          <tbody>{mapping.applications.map(app => (
            <tr key={app.appId}>
              <td className="p-3">{app.name}<code className="block break-all text-cyan-200">{app.spajaId}</code></td>
              <td className="p-3">{app.subdomain || '(osnovni host)'}</td>
              <td className="p-3">{app.publicHost ?? 'Nije podešen'}</td>
              <td className="p-3">/ · putanja se čuva</td>
              <td className="p-3">{app.tls.status === 'unconfigured' ? 'Nije podešen' : 'Nije proveren'}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-zinc-400">Generisana konfiguracija nije dokaz dostupnosti ili važećeg HTTPS sertifikata. Postojeći Vercel statusi i komande prikazani su zasebno ispod.</p>
      <a className="mt-3 inline-block text-cyan-300 underline" href="/api/deploy-platforma/network">Pregledaj JSON mapiranje</a>
    </section>
  );
}
