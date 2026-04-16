import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    naziv: 'AI IQ World Bank — Smederevo Ekspanzija',
    verzija: APP_VERSION,
    status: 'aktivan',
    lokacija: {
      grad: 'Smederevo',
      drzava: 'Srbija',
      tip: 'Sediste kompanije',
    },
    ekspanzija: {
      opis: 'AI IQ World Bank ima sediste u Smederevu, Srbija, odakle se siri globalno',
      aktivnosti: [
        'Sediste kompanije i centar razvoja svih platformi',
        'ERSTE Banka DOO Smederevo — zvanicni bankarski partner',
        'Globalna ekspanzija iz Smedereva ka celom svetu',
        'Tehnoloski hub za razvoj platformi i AI sistema',
        'Lokalna partnerstva sa institucijama i kompanijama',
        'Kontinuirano sirenje servisa i korisnicke baze',
      ],
    },
    partnerstva: [
      { naziv: 'ERSTE Banka DOO Smederevo', tip: 'bankarski', lokacija: 'Smederevo' },
      { naziv: 'Digitalna Industrija', tip: 'maticna', lokacija: 'Smederevo' },
    ],
    timestamp: new Date().toISOString(),
  });
}
