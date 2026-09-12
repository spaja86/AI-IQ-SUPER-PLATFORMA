import { ImageResponse } from 'next/og';

export const size = {
  width: 512,
  height: 512,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #050913 0%, #0a2254 55%, #02040a 100%)',
          borderRadius: 88,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 24,
            borderRadius: 72,
            border: '10px solid rgba(255, 199, 74, 0.85)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 340,
            height: 200,
            borderRadius: '50%',
            border: '18px solid rgba(59, 130, 246, 0.95)',
            boxShadow: '0 0 32px rgba(96, 165, 250, 0.55)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 388,
            height: 228,
            borderRadius: '50%',
            border: '8px solid rgba(255, 199, 74, 0.8)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 112,
            display: 'flex',
            width: 250,
            height: 170,
            background: 'linear-gradient(135deg, #fff0a8 0%, #ffc84a 50%, #b97812 100%)',
            clipPath: 'polygon(5% 100%, 16% 35%, 32% 56%, 50% 8%, 68% 56%, 84% 35%, 95% 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 184,
            width: 86,
            height: 86,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8bd1ff 0%, #3b82f6 55%, #1d4ed8 100%)',
            border: '5px solid rgba(219, 234, 254, 0.95)',
            boxShadow: '0 0 28px rgba(96, 165, 250, 0.75)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: '#fff8db',
            fontFamily: 'Georgia, serif',
            fontWeight: 700,
          }}
        >
          <span style={{ fontSize: 76, lineHeight: 1 }}>DI</span>
          <span style={{ fontSize: 28, color: '#bfdbfe', fontFamily: 'Inter, sans-serif' }}>SPAJA</span>
        </div>
      </div>
    ),
    size,
  );
}
