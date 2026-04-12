import { ImageResponse } from 'next/og';
import { APP_NAME, KOMPANIJA, APP_VERSION } from '@/lib/constants';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') ?? APP_NAME;
  const description = searchParams.get('description') ?? `Digitalna Industrija - ${KOMPANIJA}`;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a1a',
          backgroundImage: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a2a 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 60px',
            maxWidth: '90%',
          }}
        >
          <div
            style={{
              fontSize: 28,
              color: '#818cf8',
              marginBottom: 8,
              display: 'flex',
            }}
          >
            {KOMPANIJA} - Digitalna Industrija
          </div>
          <div
            style={{
              fontSize: 52,
              fontWeight: 'bold',
              color: '#ffffff',
              textAlign: 'center',
              marginBottom: 16,
              lineHeight: 1.2,
              display: 'flex',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 22,
              color: '#a1a1aa',
              textAlign: 'center',
              maxWidth: '80%',
              display: 'flex',
            }}
          >
            {description}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 32,
              gap: 16,
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontSize: 16,
                color: '#6366f1',
                padding: '6px 16px',
                borderRadius: 8,
                border: '1px solid #6366f1',
                display: 'flex',
              }}
            >
              v{APP_VERSION}
            </div>
            <div
              style={{
                fontSize: 16,
                color: '#22c55e',
                padding: '6px 16px',
                borderRadius: 8,
                border: '1px solid #22c55e',
                display: 'flex',
              }}
            >
              OMEGA AI
            </div>
            <div
              style={{
                fontSize: 16,
                color: '#f59e0b',
                padding: '6px 16px',
                borderRadius: 8,
                border: '1px solid #f59e0b',
                display: 'flex',
              }}
            >
              SpajaPro
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
