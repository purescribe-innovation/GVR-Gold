'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  productName: string;
  metalType: 'gold' | 'silver';
}

export default function ImageGallery({ images, productName, metalType }: ImageGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStart = useRef(0);
  const isGold = metalType === 'gold';

  useEffect(() => {
    setMounted(true);
  }, []);

  const prev = useCallback(() => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1)), [images.length]);
  const next = useCallback(() => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1)), [images.length]);

  const openFullscreen = () => {
    setFullscreen(true);
    dialogRef.current?.showModal();
  };

  const closeFullscreen = () => {
    setFullscreen(false);
    dialogRef.current?.close();
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape' && fullscreen) closeFullscreen();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [prev, next, fullscreen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
  };

  const gradientBg = isGold
    ? 'linear-gradient(145deg, #1a1500, #2a2000 30%, #3d2e00 60%, #1a1500)'
    : 'linear-gradient(145deg, #151515, #1e1e1e 30%, #282828 60%, #151515)';

  return (
    <>
      <div className="gallery">
        {/* Main Image */}
        <div
          className="gallery-main"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="gallery-main-image" style={{ background: gradientBg }}>
            <img 
              src={images[current]} 
              alt={`${productName} image ${current + 1}`} 
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="gallery-placeholder-icon hidden" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                <circle cx="60" cy="60" r="45" stroke={isGold ? '#d4af37' : '#c0c0c0'} strokeWidth="1" fill="none" opacity="0.3"/>
                <path d="M60 25 L72 52 L60 95 L48 52 Z" fill={isGold ? '#d4af37' : '#c0c0c0'} opacity="0.15"/>
                <circle cx="60" cy="60" r="15" stroke={isGold ? '#d4af37' : '#c0c0c0'} strokeWidth="0.8" fill="none" opacity="0.25"/>
                <text x="60" y="64" textAnchor="middle" fill={isGold ? '#d4af37' : '#c0c0c0'} fontSize="10" opacity="0.5" fontFamily="Inter, sans-serif">{productName.substring(0, 12)}</text>
              </svg>
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button className="gallery-nav gallery-nav-prev" onClick={prev} aria-label="Previous image">
                  <ChevronLeft size={24} />
                </button>
                <button className="gallery-nav gallery-nav-next" onClick={next} aria-label="Next image">
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Fullscreen Button */}
            <button className="gallery-fullscreen-btn" onClick={openFullscreen} aria-label="View fullscreen">
              <Maximize2 size={18} />
            </button>

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="gallery-counter">
                {current + 1} / {images.length}
              </div>
            )}
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="gallery-thumbs">
            {images.map((imgUrl, i) => (
              <button
                key={i}
                className={`gallery-thumb ${i === current ? 'active' : ''}`}
                onClick={() => setCurrent(i)}
                aria-label={`View image ${i + 1}`}
                style={{ background: gradientBg, overflow: 'hidden', position: 'relative' }}
              >
                <img 
                  src={imgUrl} 
                  alt={`Thumbnail ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <span className="gallery-thumb-number" style={{ zIndex: 1, position: 'absolute' }}>{i + 1}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {mounted && fullscreen && createPortal(
        <div 
          className="gallery-dialog" 
          onClick={(e) => { 
            // Close if clicking the backdrop
            if (e.target === e.currentTarget) closeFullscreen(); 
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999999, // Ensure it's above everything
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="gallery-dialog-content" style={{ position: 'relative', width: '90vw', height: '90vh', maxWidth: '1200px' }}>
            <button 
              className="gallery-dialog-close" 
              onClick={closeFullscreen} 
              aria-label="Close fullscreen"
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: 'white',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <X size={24} />
            </button>
            <div className="gallery-dialog-image" style={{ background: gradientBg, width: '100%', height: '100%', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TransformWrapper centerOnInit={true} minScale={1} maxScale={4} wheel={{ step: 0.1 }}>
                <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img 
                    src={images[current]} 
                    alt={`${productName} fullscreen`}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="gallery-placeholder-icon large hidden" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                      <circle cx="100" cy="100" r="75" stroke={isGold ? '#d4af37' : '#c0c0c0'} strokeWidth="1.5" fill="none" opacity="0.3"/>
                      <path d="M100 35 L118 85 L100 165 L82 85 Z" fill={isGold ? '#d4af37' : '#c0c0c0'} opacity="0.15"/>
                      <circle cx="100" cy="100" r="25" stroke={isGold ? '#d4af37' : '#c0c0c0'} strokeWidth="1" fill="none" opacity="0.25"/>
                    </svg>
                  </div>
                </TransformComponent>
              </TransformWrapper>
            </div>
            {images.length > 1 && (
              <>
                <button className="gallery-nav gallery-nav-prev" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous image"><ChevronLeft size={32} /></button>
                <button className="gallery-nav gallery-nav-next" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next image"><ChevronRight size={32} /></button>
              </>
            )}
            <div className="gallery-counter">{current + 1} / {images.length}</div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
