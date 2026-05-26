'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { igrice } from '@/lib/igrice';
import { dimenzije, type DimenzijaNivo } from '@/lib/dimenzije';
import {
  spajaDigitalniProzor,
  getProzorSnagu,
  getStimulacioneKanale,
  kalkulisiEksponencijalniOdraz,
} from '@/lib/digitalni-prozor';
import Button from '@/components/Button';

const GamingEndzin = dynamic(() => import('./gaming/GamingEndzin'), { ssr: false });

interface Props {
  igricaId: string;
  dimenzija?: string;
  onNazadUBrouvzer?: () => void;
}

const DIMENZIJE: DimenzijaNivo[] = ['360D', '720D', '1440D', '2880D', '5760D'];

function parseDimenzija(value?: string): DimenzijaNivo | null {
  if (!value) return null;
  return DIMENZIJE.includes(value as DimenzijaNivo) ? (value as DimenzijaNivo) : null;
}

export default function ProzorViewer({ igricaId, dimenzija, onNazadUBrouvzer }: Props) {
  const router = useRouter();
  const igrica = useMemo(() => igrice.find((item) => item.id === igricaId), [igricaId]);
  const kanali = useMemo(() => getStimulacioneKanale(), []);
  const snaga = useMemo(() => getProzorSnagu(), []);

  const initialDimenzija = useMemo<DimenzijaNivo | null>(() => {
    const parsed = parseDimenzija(dimenzija);
    if (!igrica) return parsed;
    if (parsed && igrica.podrzaneDimenzije.includes(parsed)) return parsed;
    return null;
  }, [dimenzija, igrica]);

  const [izabranaDimenzija, setIzabranaDimenzija] = useState<DimenzijaNivo | null>(initialDimenzija);
  const [startupAktivan, setStartupAktivan] = useState(Boolean(initialDimenzija));
  const [aktivniKanalCount, setAktivniKanalCount] = useState(0);
  const [odrazPrikaz, setOdrazPrikaz] = useState(0);
  const [startupToken, setStartupToken] = useState(initialDimenzija ? 1 : 0);

  const startStartup = useCallback((nivo: DimenzijaNivo) => {
    setIzabranaDimenzija(nivo);
    setStartupAktivan(true);
    setAktivniKanalCount(0);
    setOdrazPrikaz(0);
    setStartupToken((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!izabranaDimenzija || !startupAktivan) return;

    const target = kalkulisiEksponencijalniOdraz(izabranaDimenzija);
    const kanalInterval = setInterval(() => {
      setAktivniKanalCount((prev) => {
        if (prev >= kanali.length) return prev;
        return prev + 1;
      });
    }, 250);

    const odrazInterval = setInterval(() => {
      setOdrazPrikaz((prev) => {
        if (prev >= target) return target;
        return Number(Math.min(target, prev + target / 14).toFixed(2));
      });
    }, 120);

    const startupTimeout = setTimeout(() => {
      clearInterval(kanalInterval);
      clearInterval(odrazInterval);
      setAktivniKanalCount(kanali.length);
      setOdrazPrikaz(target);
      setStartupAktivan(false);
    }, 3200);

    return () => {
      clearInterval(kanalInterval);
      clearInterval(odrazInterval);
      clearTimeout(startupTimeout);
    };
  }, [izabranaDimenzija, kanali, startupAktivan, startupToken]);

  const handleNazad = useCallback(() => {
    if (onNazadUBrouvzer) {
      onNazadUBrouvzer();
      return;
    }
    router.push('/spaja-digitalni-brouvzer');
  }, [onNazadUBrouvzer, router]);

  if (!igrica) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-950 p-6 text-center">
        <div>
          <p className="mb-2 text-3xl">⚠️</p>
          <h2 className="text-xl font-bold text-white">Igrica nije pronađena</h2>
          <p className="mt-2 text-sm text-gray-400">ID: {igricaId}</p>
          <Button
            type="button"
            onClick={handleNazad}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            Nazad u BROUVZER
          </Button>
        </div>
      </div>
    );
  }

  if (!izabranaDimenzija) {
    return (
      <div className="flex h-full flex-col bg-gray-950">
        <div className="border-b border-gray-800 bg-gray-900 px-4 py-2 text-xs text-gray-300">
          🪟 DIGITALNI PROZOR — Izaberi dimenziju za startup
        </div>
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="w-full max-w-xl rounded-2xl border border-gray-800 bg-gray-900/70 p-6">
            <div className="mb-6 text-center">
              <div className="text-5xl">{igrica.ikona}</div>
              <h1 className="mt-2 text-2xl font-bold text-white">{igrica.naziv}</h1>
              <p className="mt-1 text-sm text-gray-400">Koju dimenziju želiš (D)?</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {igrica.podrzaneDimenzije.map((nivo) => (
                <Button
                  key={nivo}
                  type="button"
                  onClick={() => startStartup(nivo)}
                  className="rounded-xl border border-gray-700 bg-gray-800 px-3 py-3 text-left text-sm text-gray-200 transition hover:border-blue-500 hover:bg-gray-700"
                >
                  <span className="font-bold text-white">{nivo}</span>
                  <p className="mt-1 text-xs text-gray-400">Eksponencijalni odraz: {kalkulisiEksponencijalniOdraz(nivo)}</p>
                </Button>
              ))}
            </div>
            <Button
              type="button"
              onClick={handleNazad}
              className="mt-5 text-xs text-gray-500 hover:text-gray-300"
            >
              ← Nazad u BROUVZER
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const dimenzijaObj = dimenzije.find((item) => item.nivo === izabranaDimenzija);
  if (!dimenzijaObj) return null;

  if (startupAktivan) {
    return (
      <div className="flex h-full flex-col bg-gray-950">
        <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900 px-4 py-2">
          <span className="text-sm font-semibold text-white">🪟 DIGITALNI PROZOR</span>
          <span className="text-xs text-green-400">Startup: aktivan</span>
        </div>
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="w-full max-w-2xl rounded-2xl border border-blue-500/30 bg-gray-900/80 p-6">
            <div className="mb-5 text-center">
              <p className="text-5xl">{igrica.ikona}</p>
              <h2 className="mt-2 text-2xl font-bold text-white">{igrica.naziv}</h2>
              <p className="text-sm text-gray-400">Dimenzija: {izabranaDimenzija}</p>
            </div>

            <div className="mb-5 rounded-xl border border-gray-700 bg-gray-800 p-4">
              <p className="text-xs text-gray-400">Kompijuter snaga</p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-700">
                <div className="h-full animate-pulse bg-cyan-400" style={{ width: '100%' }} />
              </div>
              <p className="mt-2 text-xs text-gray-300">
                GPU {(snaga.gpuJezgra / 1_000_000).toFixed(1)}M • RAM {snaga.ramGB.toLocaleString('sr-RS')} GB • CPU×{snaga.cpuKanali} CIP×{snaga.cipKanali}
              </p>
            </div>

            <div className="mb-5 grid gap-2 sm:grid-cols-2">
              {kanali.map((kanal, index) => {
                const aktivan = index < aktivniKanalCount;
                return (
                  <div
                    key={kanal.id}
                    className={`rounded-lg border px-3 py-2 text-xs ${
                      aktivan ? 'border-green-500/50 bg-green-900/20 text-green-300' : 'border-gray-700 bg-gray-800 text-gray-500'
                    }`}
                  >
                    {aktivan ? '✅' : '⏳'} {kanal.naziv}
                  </div>
                );
              })}
            </div>

            <div className="rounded-xl border border-purple-500/30 bg-purple-900/10 p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-purple-300">Eksponencijalni odraz</p>
              <p className="mt-1 text-3xl font-extrabold text-white">{odrazPrikaz.toLocaleString('sr-RS')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-gray-950">
      <div className="flex shrink-0 items-center gap-2 border-b border-gray-800 bg-gray-900 px-4 py-2 text-xs">
        <span className="font-semibold text-white">🪟 DIGITALNI PROZOR</span>
        <span className="rounded-full bg-blue-600/30 px-2 py-0.5 text-blue-300">BROUVZER bridge</span>
        <span className="rounded-full bg-purple-600/20 px-2 py-0.5 text-purple-300">{izabranaDimenzija}</span>
        <span className="rounded-full bg-green-700/20 px-2 py-0.5 text-green-300">
          Snaga {spajaDigitalniProzor.statistika.snagaProzora}
        </span>
        <Button
          type="button"
          onClick={handleNazad}
          className="ml-auto rounded-md border border-gray-700 px-2 py-1 text-gray-300 hover:border-gray-500 hover:text-white"
        >
          Nazad u BROUVZER
        </Button>
      </div>

      <div className="min-h-0 flex-1">
        <GamingEndzin
          igrica={igrica}
          dimenzija={dimenzijaObj}
          onPromeniDimenziju={() => setIzabranaDimenzija(null)}
          onIzlaz={handleNazad}
        />
      </div>
    </div>
  );
}
