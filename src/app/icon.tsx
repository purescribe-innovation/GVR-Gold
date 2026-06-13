import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 48,
  height: 48,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          borderRadius: '12px',
        }}
      >
        <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Diamond Frame */}
          <path d="M 24 4 L 44 24 L 24 44 L 4 24 Z" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.8" fill="none" />
          {/* G */}
          <path d="M 26 14 C 16 12, 10 18, 10 26 C 10 34, 16 40, 26 38 C 30 37, 32 34, 32 30 H 24" stroke="#d4af37" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* V */}
          <path d="M 16 16 L 24 34 L 32 16" stroke="#f5e6a3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* R */}
          <path d="M 32 16 C 38 16, 38 24, 32 24 L 38 36" stroke="#b8860b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
