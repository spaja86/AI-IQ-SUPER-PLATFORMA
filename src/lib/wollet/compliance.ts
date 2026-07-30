export interface WolletComplianceRequirement {
  code: string;
  title: string;
  status: 'planned' | 'in_progress' | 'implemented';
  scope: string;
  organ?: string;
}

/**
 * AI IQ World Bank — specifični compliance zahtevi.
 * Uključuje NBS regulativu, SWIFT/SEPA standarde i Polygon blockchain zahteve.
 */
export const wolletComplianceRequirements: WolletComplianceRequirement[] = [
  {
    code: 'NBS-REG',
    title: 'NBS regulativa — Zakon o platnim uslugama',
    status: 'in_progress',
    scope: 'Sve platne transakcije u RSD na teritoriji Srbije',
    organ: 'Narodna Banka Srbije',
  },
  {
    code: 'AML-FATF',
    title: 'AML/CFT — FATF preporuke i Zakon o sprečavanju pranja novca',
    status: 'planned',
    scope: 'Transakcioni monitoring, KYC/KYB, izveštavanje suspektnih transakcija',
    organ: 'FATF / NBS Uprava za kontrolu',
  },
  {
    code: 'KYC-KYB',
    title: 'KYC/KYB identifikacija klijenata',
    status: 'planned',
    scope: 'Onboarding korisnika i poslovnih subjekata',
    organ: 'NBS',
  },
  {
    code: 'SEPA',
    title: 'SEPA — Single Euro Payments Area',
    status: 'planned',
    scope: 'EUR transakcije unutar SEPA zone',
    organ: 'EPC / ECB',
  },
  {
    code: 'SWIFT',
    title: 'SWIFT — međunarodni prenos sredstava',
    status: 'planned',
    scope: 'USD i devizne transakcije van SEPA zone',
    organ: 'SWIFT',
  },
  {
    code: 'POLYGON-VERIFY',
    title: 'Polygon blockchain javna verifikacija',
    status: 'implemented',
    scope: 'Sve transakcije su upisane na blockchain i javno proverljive na polygonscan.com',
    organ: 'Polygon Network',
  },
  {
    code: 'GDPR',
    title: 'GDPR — Zaštita ličnih podataka',
    status: 'implemented',
    scope: 'Lični podaci klijenata, audit trail, retention politika',
    organ: 'Poverenik za informacije od javnog značaja',
  },
  {
    code: 'PCI-DSS',
    title: 'PCI DSS — Standardizacija platnih kartica',
    status: 'in_progress',
    scope: 'Kartični podaci, tokenizacija, obrada plaćanja',
    organ: 'PCI Security Standards Council',
  },
];

export const wolletDataClassification = {
  secret: ['on_chain_private_key', 'vlasnik_adresa', 'transakcija_potpisani_payload'],
  restricted: ['racun_stanje_minor', 'kyc_status', 'aml_flags'],
  internal: ['blockchain_routing_config', 'polygon_rpc_url', 'transakcija_metadata'],
  public: ['transakcija_hash', 'polygonscan_url', 'ukupno_potroseno_usd', 'racun_list'],
};
