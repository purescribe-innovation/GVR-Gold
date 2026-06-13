'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface RevealOnScrollProps {
  children: ReactNode;
  animation?: 'fadeUp' | 'fadeLeft' | 'fadeRight' | 'scaleIn';
  delay?: number;
  threshold?: number;
  className?: string;
}

export default function RevealOnScroll({
  children,
  animation = 'fadeUp',
  delay = 0,
  threshold = 0.15,
  className = '',
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add('revealed');
          }, delay);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold]);

  const animClass =
    animation === 'fadeLeft'
      ? 'reveal-left'
      : animation === 'fadeRight'
      ? 'reveal-right'
      : animation === 'scaleIn'
      ? 'reveal-scale'
      : 'reveal';

  return (
    <div ref={ref} className={`${animClass} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
