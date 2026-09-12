import { APP_VERSION } from './constants';
import { PDF_EXPORT_CONTRACT_VERSION } from './export-pdf';

export interface EditorialFormat {
  id: string;
  naziv: string;
  opis: string;
}

export interface EditorialSerijal {
  id: string;
  naziv: string;
  formatId: string;
  autor: string;
  status: 'aktivan' | 'u-pripremi';
}

export interface EditorialMediji {
  naziv: string;
  verzija: string;
  exportModelVersion: string;
  formati: EditorialFormat[];
  autori: string[];
  serijali: EditorialSerijal[];
  arhiva: string[];
}

export function getEditorialMediji(): EditorialMediji {
  return {
    naziv: 'Editorial / Media Vertikala',
    verzija: APP_VERSION,
    exportModelVersion: PDF_EXPORT_CONTRACT_VERSION,
    formati: [
      { id: 'ljubavni-romani', naziv: 'Ljubavni romani', opis: 'Duža forma sa serijalima, likovima i emotivnim lukovima.' },
      { id: 'romani', naziv: 'Romani', opis: 'Opšti književni format za duže narative i izdavačke edicije.' },
      { id: 'stripovi', naziv: 'Stripovi', opis: 'Vizuelno-serijalni format za epizode, table i junake.' },
      { id: 'zabavnik', naziv: 'Politikin zabavnik', opis: 'Magazinski miks kulture, znanja i zabave.' },
      { id: 'novine', naziv: 'Novine', opis: 'Kratke i pregledne novinske forme sa arhivom izdanja.' },
    ],
    autori: ['SPAJA Editorial', 'OMEGA Narativni Tim', 'EXTRIMLI Kreativni Studio'],
    serijali: [
      { id: 'srce-gradova', naziv: 'Srce Gradova', formatId: 'ljubavni-romani', autor: 'SPAJA Editorial', status: 'aktivan' },
      { id: 'nova-industrija', naziv: 'Nova Industrija', formatId: 'romani', autor: 'OMEGA Narativni Tim', status: 'u-pripremi' },
      { id: 'diktar-chronicles', naziv: 'Diktar Chronicles', formatId: 'stripovi', autor: 'EXTRIMLI Kreativni Studio', status: 'aktivan' },
      { id: 'signal-zabavnik', naziv: 'Signal Zabavnik', formatId: 'zabavnik', autor: 'SPAJA Editorial', status: 'aktivan' },
      { id: 'industrija-daily', naziv: 'Industrija Daily', formatId: 'novine', autor: 'OMEGA Narativni Tim', status: 'aktivan' },
    ],
    arhiva: ['izdanje-001', 'izdanje-002', 'izdanje-003', 'arhiva-strip-tabli', 'novinski-brief-archive'],
  };
}
