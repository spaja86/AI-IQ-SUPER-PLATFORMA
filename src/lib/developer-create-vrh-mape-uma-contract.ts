export const DEVELOPER_CREATE_VRH_MAPE_UMA_SCOPE_LOCK =
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == MAPE UMA' as const;

export const DEVELOPER_CREATE_VRH_MAPE_UMA_EXPLANATION_TITLE =
  'DEVELOPER AND CREATE + VRH PROGRAMSKOG EKVILADENTA + MAPE UMA' as const;

export const DEVELOPER_CREATE_VRH_MAPE_UMA_INTERPRETATIVE_ALIASES = [
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == MAPE UMA',
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == MAPA UMA',
  'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == ŽIVOPIS U DIGITALIZMU',
] as const;

export const DEVELOPER_CREATE_VRH_MAPE_UMA_READINESS_MODEL = [
  'READY',
  'WATCH',
  'BLOCKED',
] as const;

export const DEVELOPER_CREATE_VRH_MAPE_UMA_THEMATIC_SIGNALS = [
  'mape-uma',
  'slike-plus-znacenje',
  'ucenje',
  'znanje',
  'kreativnost',
  'saradnja',
  'odrzivost',
  'mir',
] as const;

export const DEVELOPER_CREATE_VRH_MAPE_UMA_OWNERSHIP_LOCK = {
  dokDikFor: 'EXTREM',
  dakDuk: 'EXTRONDOL',
  spajaKod: 'audit-safe-summary-only',
} as const;

export const DEVELOPER_CREATE_VRH_MAPE_UMA_GLOBAL_CONTEXT =
  `${DEVELOPER_CREATE_VRH_MAPE_UMA_SCOPE_LOCK}. Additive-only aliasi MAPA UMA i ŽIVOPIS U DIGITALIZMU ostaju u istom lock-u. Objašnjenje mora biti dostupno na svakoj stranici kroz isti READY/WATCH/BLOCKED model i bounded signal paket.` as const;
