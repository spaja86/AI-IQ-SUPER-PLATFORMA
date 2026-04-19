import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { pocetnaSekvence } from '@/lib/sekvence/pocetna';
import { KOMPANIJA, SPAJA_PRO_RANGE, OMEGA_AI_PERSONA_COUNT, OMEGA_AI_PERSONA_UKUPNO, TOTAL_IGRICA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Početna — AI IQ SUPER PLATFORMA',
  description: `${KOMPANIJA} — Digitalna Industrija. SpajaPro Prompt Engine v${SPAJA_PRO_RANGE}, ${OMEGA_AI_PERSONA_COUNT} OMEGA AI persona (${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn')} ukupno), ${TOTAL_IGRICA} igrica, Proksi mreža, SPAJA Mobilna Mreža. Unified platforma za upravljanje svim AI i IT projektima.`,
};

export default function Home() {
  return <StranicaRenderer sekvence={pocetnaSekvence} />;
}
