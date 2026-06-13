'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Sharma',
    location: 'Hyderabad',
    rating: 5,
    text: 'The bridal set I purchased from GVR was absolutely stunning. The craftsmanship is unparalleled and every detail was perfect. My family was thrilled with the quality.',
  },
  {
    name: 'Rajesh Kumar',
    location: 'Secunderabad',
    rating: 5,
    text: 'I have been a loyal customer for over 15 years. The purity of their gold is always guaranteed and the designs are unique. Truly the finest jewelry store in the city.',
  },
  {
    name: 'Ananya Reddy',
    location: 'Jubilee Hills',
    rating: 5,
    text: 'Bought a beautiful silver gift collection for my mother. The presentation was exquisite and the quality surpassed all expectations. Will definitely return.',
  },
  {
    name: 'Mohammed Irfan',
    location: 'Banjara Hills',
    rating: 5,
    text: 'The team at GVR helped me find the perfect engagement ring. Their expertise and patience made the entire experience memorable. Highly recommended.',
  },
  {
    name: 'Lakshmi Devi',
    location: 'Kukatpally',
    rating: 5,
    text: 'Three generations of my family have trusted GVR for our wedding jewelry. The tradition of excellence continues. Their gold bangles are simply the best.',
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning]);

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [current, goTo]);

  const t = testimonials[current];

  return (
    <div className="testimonials">
      <div className={`testimonial-card ${isTransitioning ? 'fading' : ''}`}>
        <div className="testimonial-quote" aria-hidden="true">
          <Quote size={48} />
        </div>
        <p className="testimonial-text">&ldquo;{t.text}&rdquo;</p>
        <div className="testimonial-stars">
          {Array.from({ length: t.rating }).map((_, i) => (
            <Star key={i} size={16} fill="#d4af37" color="#d4af37" />
          ))}
        </div>
        <div className="testimonial-author">
          <span className="testimonial-name">{t.name}</span>
          <span className="testimonial-location">{t.location}</span>
        </div>
      </div>
      <div className="testimonial-dots">
        {testimonials.map((_, i) => (
          <button
            key={i}
            className={`testimonial-dot ${i === current ? 'active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`View testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
