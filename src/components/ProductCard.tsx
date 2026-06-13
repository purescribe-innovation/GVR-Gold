'use client';

import Link from 'next/link';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isGold = product.metalType === 'gold';

  return (
    <Link href={`/product/${product.id}`} className="product-card-link">
      <div className={`product-card card shimmer-hover ${isGold ? 'card-gold' : 'card-silver'}`}>
        {/* Image */}
        <div className="product-card-image">
          {product.images && product.images.length > 0 ? (
            <>
              {/* Note: We use a standard img with onError to handle missing files gracefully */}
              <img 
                src={product.images[0]} 
                alt={product.name} 
                className="product-card-image-actual"
                loading="lazy"
                decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div
                className="product-card-image-placeholder hidden"
                style={{
                  background: isGold
                    ? 'linear-gradient(145deg, #1a1500, #2a2000 30%, #3d2e00 60%, #1a1500)'
                    : 'linear-gradient(145deg, #151515, #1e1e1e 30%, #282828 60%, #151515)',
                  width: '100%', height: '100%', position: 'absolute', top: 0, left: 0
                }}
              >
                <div className="product-card-image-icon">
                  {isGold ? (
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="32" cy="32" r="24" stroke="url(#pcg)" strokeWidth="1.5" fill="none" opacity="0.5"/>
                      <path d="M32 16 L38 28 L32 48 L26 28 Z" fill="url(#pcg)" opacity="0.3"/>
                      <circle cx="32" cy="32" r="8" stroke="url(#pcg)" strokeWidth="1" fill="none" opacity="0.4"/>
                      <defs><linearGradient id="pcg" x1="8" y1="8" x2="56" y2="56"><stop stopColor="#b8860b"/><stop offset="0.5" stopColor="#d4af37"/><stop offset="1" stopColor="#f5e6a3"/></linearGradient></defs>
                    </svg>
                  ) : (
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="32" cy="32" r="24" stroke="url(#pcs)" strokeWidth="1.5" fill="none" opacity="0.5"/>
                      <path d="M32 16 L38 28 L32 48 L26 28 Z" fill="url(#pcs)" opacity="0.3"/>
                      <circle cx="32" cy="32" r="8" stroke="url(#pcs)" strokeWidth="1" fill="none" opacity="0.4"/>
                      <defs><linearGradient id="pcs" x1="8" y1="8" x2="56" y2="56"><stop stopColor="#a8a8a8"/><stop offset="0.5" stopColor="#c0c0c0"/><stop offset="1" stopColor="#e8e8e8"/></linearGradient></defs>
                    </svg>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div
              className="product-card-image-placeholder"
              style={{
                background: isGold
                  ? 'linear-gradient(145deg, #1a1500, #2a2000 30%, #3d2e00 60%, #1a1500)'
                  : 'linear-gradient(145deg, #151515, #1e1e1e 30%, #282828 60%, #151515)',
                width: '100%', height: '100%', position: 'absolute', top: 0, left: 0
              }}
            >
              <div className="product-card-image-icon">
                {isGold ? (
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="32" cy="32" r="24" stroke="url(#pcg)" strokeWidth="1.5" fill="none" opacity="0.5"/>
                    <path d="M32 16 L38 28 L32 48 L26 28 Z" fill="url(#pcg)" opacity="0.3"/>
                    <circle cx="32" cy="32" r="8" stroke="url(#pcg)" strokeWidth="1" fill="none" opacity="0.4"/>
                    <defs><linearGradient id="pcg" x1="8" y1="8" x2="56" y2="56"><stop stopColor="#b8860b"/><stop offset="0.5" stopColor="#d4af37"/><stop offset="1" stopColor="#f5e6a3"/></linearGradient></defs>
                  </svg>
                ) : (
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="32" cy="32" r="24" stroke="url(#pcs)" strokeWidth="1.5" fill="none" opacity="0.5"/>
                    <path d="M32 16 L38 28 L32 48 L26 28 Z" fill="url(#pcs)" opacity="0.3"/>
                    <circle cx="32" cy="32" r="8" stroke="url(#pcs)" strokeWidth="1" fill="none" opacity="0.4"/>
                    <defs><linearGradient id="pcs" x1="8" y1="8" x2="56" y2="56"><stop stopColor="#a8a8a8"/><stop offset="0.5" stopColor="#c0c0c0"/><stop offset="1" stopColor="#e8e8e8"/></linearGradient></defs>
                  </svg>
                )}
              </div>
            </div>
          )}
          {/* Badges */}
          <div className="product-card-badges">
            <span className={`badge ${isGold ? 'badge-gold' : 'badge-silver'}`}>
              {product.purity}
            </span>
            {product.featured && <span className="badge badge-featured">★ Featured</span>}
          </div>
        </div>

        {/* Info */}
        <div className="product-card-info">
          <span className="product-card-category">{product.category.replace('-', ' ')}</span>
          <h3 className="product-card-name">{product.name}</h3>
          <div className="product-card-meta">
            <span className="product-card-weight">{product.weight}g</span>
            <span className="product-card-metal">{isGold ? 'Gold' : 'Silver'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
