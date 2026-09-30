export interface B2BPlatformCatalogEntry {
  id: string;
  naziv: string;
  url: string;
  opis: string;
  kategorija: 'core' | 'organization' | 'public-site' | 'external-ai';
}

/**
 * Ručno održavan read-only katalog Vercel platformi.
 * Ne predstavlja runtime integraciju, dokaz dostupnosti, niti dozvolu za razmenu podataka.
 */
export const B2B_PLATFORM_CATALOG: readonly B2BPlatformCatalogEntry[] = [
  {
    id: 'ai-iq-super-platforma',
    naziv: 'AI IQ SUPER PLATFORMA',
    url: 'https://ai-iq-super-platforma-nikolas-projects-b8a8458f.vercel.app',
    opis: 'Centralni portal i B2B Control Center.',
    kategorija: 'core',
  },
  {
    id: 'io-openui-ao',
    naziv: 'IO/OPENUI/AO',
    url: 'https://io-openui-ao-nikolas-projects-b8a8458f.vercel.app',
    opis: 'Povezana digitalna platforma.',
    kategorija: 'core',
  },
  {
    id: 'ai-iq-menjacnica',
    naziv: 'AI IQ Menjačnica',
    url: 'https://ai-iq-menja-nica-6cnf-nikolas-projects-b8a8458f.vercel.app',
    opis: 'Povezan javni projekat; katalog ne aktivira razmenu, novčanike niti transakcije.',
    kategorija: 'public-site',
  },
  {
    id: 'kompanija-spaja',
    naziv: 'Kompanija SPAJA',
    url: 'https://kompanija-spaja.com',
    opis: 'Javni sajt organizacije.',
    kategorija: 'organization',
  },
  {
    id: 'svetska-organizacija',
    naziv: 'Svetska Organizacija',
    url: 'https://svetska-organizacija.vercel.app',
    opis: 'Povezan javni projekat.',
    kategorija: 'organization',
  },
  {
    id: 'openai',
    naziv: 'OpenAI',
    url: 'https://platform.openai.com',
    opis: 'Spoljni AI provajder za odabrane funkcije kada je zasebno konfigurisan. Katalog ne deli naloge, razgovore ni podatke sa OpenAI.',
    kategorija: 'external-ai',
  },
  {
    id: 'ai-iq-world-bank',
    naziv: 'AI IQ World Bank',
    url: 'https://ai-iq-world-bank.vercel.app',
    opis: 'Javni sajt digitalnih alata i razvojnih inicijativa.',
    kategorija: 'public-site',
  },
] as const;
