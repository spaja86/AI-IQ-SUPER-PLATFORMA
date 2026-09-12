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
          backgroundImage: 'linear-gradient(135deg, #030712 0%, #071a33 48%, #040814 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 24,
            borderRadius: 28,
            border: '3px solid rgba(255, 196, 74, 0.75)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: -120,
            top: 110,
            width: 760,
            height: 320,
            borderRadius: '50%',
            border: '14px solid rgba(59, 130, 246, 0.85)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: -160,
            top: 84,
            width: 840,
            height: 370,
            borderRadius: '50%',
            border: '5px solid rgba(255, 196, 74, 0.78)',
            display: 'flex',
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '40px 88px',
            width: '100%',
            zIndex: 2,
          }}
        >
          <div
            style={{
              fontSize: 28,
              color: '#93c5fd',
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
              textAlign: 'left',
              marginBottom: 16,
              lineHeight: 1.2,
              display: 'flex',
              maxWidth: '70%',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 22,
              color: '#a1a1aa',
              textAlign: 'left',
              maxWidth: '62%',
              display: 'flex',
            }}
          >
            {description}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 32,
              fontSize: 26,
              color: '#fff6cf',
            }}
          >
            Povezujemo ljude, kompanije i budućnost.
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
              <div
                style={{
                  fontSize: 16,
                  color: '#fde68a',
                  padding: '6px 16px',
                  borderRadius: 8,
                  border: '1px solid #fde68a',
                  display: 'flex',
                }}
              >
                Royal Brand
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
