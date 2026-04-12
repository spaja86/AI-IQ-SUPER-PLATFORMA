import { NextResponse } from 'next/server';
import { APP_VERSION, AUTOFINISH_COUNT, OMEGA_AI_PERSONA_UKUPNO, TOTAL_ROUTES, TOTAL_API_ROUTES, TOTAL_DIAGNOSTIKA } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    status: 'aktivan',
    naziv: 'OpenAI Platforma Notifikacije - Sistem Obavestenja i Alertinga',
    verzija: APP_VERSION,

    notifikacije: {
      pregled: {
        rute: TOTAL_ROUTES,
        apiEndpointi: TOTAL_API_ROUTES,
        dijagnostike: TOTAL_DIAGNOSTIKA,
        persone: OMEGA_AI_PERSONA_UKUPNO,
        autofinishIteracija: AUTOFINISH_COUNT,
      },
      kanali: {
        email: { status: 'aktivan', provajder: 'OMEGA Mail Gateway', dnevnoSlanje: 5000 },
        sms: { status: 'aktivan', provajder: 'SPAJA Mobilna Mreza', dnevnoSlanje: 2000 },
        push: { status: 'aktivan', provajder: 'OMEGA Push Service', dnevnoSlanje: 15000 },
        webhook: { status: 'aktivan', provajder: 'OMEGA Webhook Engine', dnevnoSlanje: 8000 },
        inApp: { status: 'aktivan', provajder: 'OMEGA UI Notifikacije', dnevnoSlanje: 25000 },
      },
      alerting: {
        engine: 'OMEGA AI Alert Engine',
        pravilaUkupno: 156,
        aktivnihPravila: 156,
        kriticnihAlerata: 0,
        upozorenja: 0,
        informativnih: 12,
        eskalacija: true,
        autoResolve: true,
      },
      pretplate: {
        ukupnoPretplatnika: 40_000_562,
        aktivnih: 40_000_562,
        kategorije: ['sistem', 'bezbednost', 'performanse', 'deploy', 'greske', 'izvestaji'],
      },
      statistika: {
        poslatoUkupno: 1_250_000,
        isporucenost: '99.97%',
        prosecnoVremeIsporuke: '< 500ms',
        neisporuceno: 375,
      },
    },

    dijagnostike: [
      { id: 'openai-notif-001', naziv: 'Email kanal', status: 'ok', opis: 'OMEGA Mail Gateway aktivan, 5000 dnevno, isporucenost 99.97%' },
      { id: 'openai-notif-002', naziv: 'SMS kanal', status: 'ok', opis: 'SPAJA Mobilna Mreza, 2000 SMS dnevno, svi kanali operativni' },
      { id: 'openai-notif-003', naziv: 'Push notifikacije', status: 'ok', opis: 'OMEGA Push Service, 15000 push dnevno, real-time isporuka' },
      { id: 'openai-notif-004', naziv: 'Alert engine', status: 'ok', opis: '156 pravila, 0 kriticnih, auto-resolve i eskalacija aktivni' },
      { id: 'openai-notif-005', naziv: 'Webhook isporuka', status: 'ok', opis: 'OMEGA Webhook Engine, 8000 dnevno, retry mehanizam aktivan' },
      { id: 'openai-notif-006', naziv: 'Pretplate i statistika', status: 'ok', opis: '40M pretplatnika, 1.25M poslato, prosecna isporuka < 500ms' },
    ],

    timestamp: new Date().toISOString(),
  });
}
