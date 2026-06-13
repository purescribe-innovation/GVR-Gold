'use client';

import { useState, useEffect } from 'react';
import RevealOnScroll from '@/components/RevealOnScroll';
import { Shield, Award, Heart, Clock, CheckCircle } from 'lucide-react';

export default function AboutPage() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) {
          setSettings(data.data);
        }
      })
      .catch(err => console.error("Failed to load settings in about", err));
  }, []);
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="container">
          <RevealOnScroll>
            <div className="hero-badge">
              <span>Our Heritage</span>
            </div>
            <h1 className="hero-title">
              The Legacy of <span className="text-gold-gradient">GVR</span>
            </h1>
            <p className="hero-subtitle">
              For over three decades, we have been crafting more than just jewelry; we have been crafting memories.
            </p>
          </RevealOnScroll>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="about-section">
            <RevealOnScroll animation="fadeRight">
              <div className="about-image-box" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--gold-dark)', height: '100%', minHeight: '400px' }}>
                <img 
                  src="/images/tradition.png" 
                  alt="A Tradition of Trust - Heirloom Jewelry" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </RevealOnScroll>
            <RevealOnScroll animation="fadeLeft">
              <div>
                <h2 className="section-title" style={{ marginBottom: '24px', fontSize: '2.5rem' }}>A Tradition of <span className="text-gold-gradient">Trust</span></h2>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.9, whiteSpace: 'pre-line' }}>
                  {settings?.aboutContent || 'Founded in 1990, GVR Gold & Silver began with a simple mission: to provide our community with the finest quality jewelry crafted with absolute integrity. What started as a small family business has grown into one of the most trusted jewelry brands.\n\nOur journey is woven with the stories of countless families who have trusted us with their most precious moments—from birth celebrations to weddings, and golden anniversaries. We don\'t just sell ornaments; we preserve your legacy.'}
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>

      <div className="section section-dark">
        <div className="container">
          <RevealOnScroll>
            <div className="section-header">
              <h2>Our Core <span className="text-gold-gradient">Pillars</span></h2>
              <p>The values that guide every piece we create and every customer we serve.</p>
              <div className="section-accent-line" />
            </div>
          </RevealOnScroll>

          <div className="values-grid">
            <RevealOnScroll delay={100}>
              <div className="value-card">
                <Shield size={40} color="var(--gold-primary)" style={{ margin: '0 auto 24px' }} />
                <h3 style={{ marginBottom: '16px' }}>Uncompromising Purity</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                  Every piece of gold and silver goes through rigorous testing. We guarantee the exact purity we promise, hallmarked and certified for your peace of mind.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={200}>
              <div className="value-card">
                <Award size={40} color="var(--gold-primary)" style={{ margin: '0 auto 24px' }} />
                <h3 style={{ marginBottom: '16px' }}>Master Craftsmanship</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                  Our artisans carry generations of skill. Whether it's intricate antique designs or modern minimal pieces, the attention to detail is flawless.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={300}>
              <div className="value-card">
                <Heart size={40} color="var(--gold-primary)" style={{ margin: '0 auto 24px' }} />
                <h3 style={{ marginBottom: '16px' }}>Customer Devotion</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                  You are at the center of everything we do. We offer personalized attention to help you find or create the perfect piece that fits your vision.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={400}>
              <div className="value-card">
                <Clock size={40} color="var(--gold-primary)" style={{ margin: '0 auto 24px' }} />
                <h3 style={{ marginBottom: '16px' }}>Timeless Elegance</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                  Trends fade, but true style endures. We focus on creating designs that remain beautiful and relevant across generations.
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="about-section reverse">
            <RevealOnScroll animation="fadeLeft">
              <div className="about-image-box" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--gold-dark)', height: '100%', minHeight: '400px' }}>
                <img 
                  src="/images/promise.png" 
                  alt="The GVR Promise - Professional Jeweler" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </RevealOnScroll>
            <RevealOnScroll animation="fadeRight">
              <div>
                <h2 className="section-title" style={{ marginBottom: '24px', fontSize: '2.5rem' }}>The <span className="text-gold-gradient">GVR Promise</span></h2>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <li style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <CheckCircle color="var(--gold-primary)" size={24} style={{ flexShrink: 0, marginTop: '4px' }} />
                    <div>
                      <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Transparent Pricing</h4>
                      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>No hidden charges. Our pricing breakdown shows exactly what you pay for metal weight, making charges, and taxes.</p>
                    </div>
                  </li>
                  <li style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <CheckCircle color="var(--gold-primary)" size={24} style={{ flexShrink: 0, marginTop: '4px' }} />
                    <div>
                      <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Lifetime Maintenance</h4>
                      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>We offer complimentary cleaning and polishing services for all jewelry purchased from us to keep them shining forever.</p>
                    </div>
                  </li>
                  <li style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <CheckCircle color="var(--gold-primary)" size={24} style={{ flexShrink: 0, marginTop: '4px' }} />
                    <div>
                      <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Best Exchange Value</h4>
                      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>Our gold upgrade policy guarantees maximum value when you choose to exchange your old GVR jewelry for new designs.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </div>
  );
}
