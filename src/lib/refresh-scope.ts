export const REFRESH_V1_SCOPE = {
  version: 'v1',
  title: 'Refresh sajta i platforme za sve',
  definitionOfDone: [
    'Jedinstven vizuelni jezik kroz globalne tokene, shell i sekvence',
    'Uskladjen UX za sekvenca i non-sekvenca stranice',
    'Pouzdan PWA update flow za isporuku novih verzija svim korisnicima',
    'Odrzane postojece funkcionalnosti i bezbednosni standardi',
  ],
  mustHavePages: ['/', '/platforme', '/pricing', '/login', '/registracija', '/proizvodi', '/kompanije', '/organizacije'],
} as const;

