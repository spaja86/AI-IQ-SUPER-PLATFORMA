// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI Motion Visual
// Kompanija SPAJA — Digitalna Industrija

'use client';

import Image from 'next/image';
import { getExtrimliVisualAsset, type ExtrimliVisualDomain } from './visual-assets';
import {
  resolveExtrimliMotion,
  type ExtrimliMotionIntensity,
  type ExtrimliMotionMode,
  type ExtrimliMotionType,
} from './motion-contract';

interface MotionVisualProps {
  domain: ExtrimliVisualDomain;
  type: ExtrimliMotionType;
  intensity?: ExtrimliMotionIntensity;
  mode?: ExtrimliMotionMode;
  itemIndex?: number;
  className?: string;
}

export function MotionVisual({
  domain,
  type,
  intensity = 'medium',
  mode = 'full',
  itemIndex = 0,
  className = '',
}: MotionVisualProps) {
  const asset = getExtrimliVisualAsset(domain);
  const motion = resolveExtrimliMotion({ type, intensity, mode, itemIndex });

  if (!motion.animate) {
    return (
      <span className={`inline-flex items-center justify-center ${className}`} aria-hidden="true">
        <Image src={asset.imageDataUri} alt={asset.alt} width={asset.width} height={asset.height} unoptimized className="h-5 w-5 rounded-full" />
      </span>
    );
  }

  if (motion.type === 'orbital') {
    return (
      <span
        className={`inline-flex items-center justify-center will-change-transform transform-gpu animate-spin ${className}`}
        style={{
          animationDuration: `${motion.durationSec}s`,
          animationDirection: motion.direction,
          animationPlayState: motion.playState,
        }}
        aria-hidden="true"
      >
        <span
          className="inline-flex items-center justify-center will-change-transform transform-gpu"
          style={{ transform: `translateY(-${motion.amplitudePx}px)` }}
        >
          <Image src={asset.imageDataUri} alt={asset.alt} width={asset.width} height={asset.height} unoptimized className="h-5 w-5 rounded-full" />
        </span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center will-change-transform transform-gpu animate-spin ${className}`}
      style={{
        animationDuration: `${motion.durationSec}s`,
        animationDirection: motion.direction,
        animationPlayState: motion.playState,
      }}
      aria-hidden="true"
    >
      <Image src={asset.imageDataUri} alt={asset.alt} width={asset.width} height={asset.height} unoptimized className="h-5 w-5 rounded-full" />
    </span>
  );
}
