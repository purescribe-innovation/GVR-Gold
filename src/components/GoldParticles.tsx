'use client';

import { useMemo } from 'react';
import Particles, { ParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { ISourceOptions, Engine } from '@tsparticles/engine';

export default function GoldParticles() {
  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: false,
      fpsLimit: 60,
      particles: {
        number: {
          value: 40,
          density: {
            enable: true,
          },
        },
        color: {
          value: ['#d4af37', '#f5e6a3', '#c9a84c', '#b8860b'],
        },
        shape: {
          type: 'circle',
        },
        opacity: {
          value: { min: 0.1, max: 0.4 },
          animation: {
            enable: true,
            speed: 0.5,
            sync: false,
          },
        },
        size: {
          value: { min: 1, max: 3 },
          animation: {
            enable: true,
            speed: 1,
            sync: false,
          },
        },
        move: {
          enable: true,
          speed: { min: 0.3, max: 0.8 },
          direction: 'top' as const,
          random: true,
          straight: false,
          outModes: {
            default: 'out' as const,
          },
          drift: 0,
        },
        wobble: {
          enable: true,
          distance: 10,
          speed: 3,
        },
      },
      detectRetina: true,
    }),
    []
  );

  return (
    <ParticlesProvider init={async (engine: Engine) => await loadSlim(engine)}>
      <Particles
        id="gold-particles"
        options={options}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
    </ParticlesProvider>
  );
}
