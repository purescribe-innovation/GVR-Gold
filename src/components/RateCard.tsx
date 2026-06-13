'use client';

interface RateCardProps {
  label: string;
  rate: number;
  unit?: string;
  metalType: 'gold' | 'silver';
  purity?: string;
}

export default function RateCard({ label, rate, unit = '/gram', metalType, purity }: RateCardProps) {
  const formatRate = (r: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(r);

  const isGold = metalType === 'gold';

  return (
    <div className={`rate-card ${isGold ? 'card-gold' : 'card-silver'}`}>
      <div className="rate-card-icon" aria-hidden="true">
        {isGold ? (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect x="5" y="16" width="30" height="14" rx="2" fill="url(#rg1)" stroke="#b8860b" strokeWidth="1"/>
            <rect x="8" y="10" width="24" height="14" rx="2" fill="url(#rg2)" stroke="#b8860b" strokeWidth="1"/>
            <defs>
              <linearGradient id="rg1" x1="5" y1="16" x2="35" y2="30"><stop stopColor="#b8860b"/><stop offset="1" stopColor="#f5e6a3"/></linearGradient>
              <linearGradient id="rg2" x1="8" y1="10" x2="32" y2="24"><stop stopColor="#d4af37"/><stop offset="1" stopColor="#f5e6a3"/></linearGradient>
            </defs>
          </svg>
        ) : (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect x="5" y="16" width="30" height="14" rx="2" fill="url(#rs1)" stroke="#a8a8a8" strokeWidth="1"/>
            <rect x="8" y="10" width="24" height="14" rx="2" fill="url(#rs2)" stroke="#a8a8a8" strokeWidth="1"/>
            <defs>
              <linearGradient id="rs1" x1="5" y1="16" x2="35" y2="30"><stop stopColor="#a8a8a8"/><stop offset="1" stopColor="#e8e8e8"/></linearGradient>
              <linearGradient id="rs2" x1="8" y1="10" x2="32" y2="24"><stop stopColor="#c0c0c0"/><stop offset="1" stopColor="#e8e8e8"/></linearGradient>
            </defs>
          </svg>
        )}
      </div>
      <div className="rate-card-label">
        {label}
        {purity && <span className="rate-card-purity">{purity}</span>}
      </div>
      <div className={`rate-card-value ${isGold ? 'text-gold-gradient' : 'text-silver-gradient'}`}>
        {formatRate(rate)}
      </div>
      <div className="rate-card-unit">{unit}</div>
    </div>
  );
}
