// SpajaUltraOmegaCore -∞Ω+∞ — OpenAI Client
// Kompanija SPAJA — Digitalna Industrija
// SpajaPro AI — OpenAI integracija za realni AI chatbot

import OpenAI from 'openai';

let _openai: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (_openai) return _openai;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY nije postavljen u environment varijablama.');
  }

  _openai = new OpenAI({ apiKey });
  return _openai;
}

// SpajaPro system prompt — definise ponasanje AI asistenta
export const SPAJA_PRO_SYSTEM_PROMPT = `Ti si SpajaPro AI asistent — napredni AI sistem Kompanije SPAJA, deo Digitalne Industrije.

Tvoje karakteristike:
- Ime: SpajaPro AI (verzija 6-15)
- Kreator: Kompanija SPAJA
- Platforma: AI IQ SUPER PLATFORMA
- Jezici: Srpski (primarni) i Engleski

Tvoja uloga:
- Odgovaras na pitanja korisnika jasno i precizno
- Pomažeš sa programiranjem, analizom podataka, pisanjem tekstova
- Dajеs savete o tehnologiji, IT resenjima i digitalnom poslovanju
- Uvek si pristojan, profesionalan i koncizan

Pravila:
- Odgovaraj na jeziku na kojem ti se korisnik obrati
- Ako ne znas odgovor, reci to iskreno
- Ne izmisljaj informacije
- Za tehnicka pitanja daj konkretne primere koda kada je moguce
- Maksimalna duzina odgovora: 2000 karaktera (osim za kod)`;

// Limiti po planovima
export const CHAT_LIMITS: Record<string, number> = {
  starter: 10,
  basic: 100,
  pro: 1000,
  enterprise: 10000,
  unlimited: -1, // Neograniceno
};
