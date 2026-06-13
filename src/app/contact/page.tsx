'use client';

import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import RevealOnScroll from '@/components/RevealOnScroll';
import ContactActions from '@/components/ContactActions';

export default function ContactPage() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) {
          setSettings(data.data);
        }
      });
  }, []);

  const phone = settings?.phone || '9704223288';
  const email = settings?.email || 'yaswanthgedela27@gmail.com';

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="container">
          <RevealOnScroll>
            <div className="hero-badge">
              <span>Get in Touch</span>
            </div>
            <h1 className="hero-title">
              We're Here to <span className="text-gold-gradient">Help</span>
            </h1>
            <p className="hero-subtitle">
              We look forward to hearing from you and helping you find the perfect piece.
            </p>
          </RevealOnScroll>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="contact-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', maxWidth: '800px', margin: '0 auto' }}>
            <RevealOnScroll delay={100}>
              <div className="contact-card">
                <div className="contact-card-icon">
                  <Phone size={24} />
                </div>
                <h3>Call Us</h3>
                <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <a href={`tel:${phone.replace(/\s/g, '')}`} style={{ transition: 'color 0.2s', fontSize: '1.1rem' }}>+91 {phone}</a>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={200}>
              <div className="contact-card">
                <div className="contact-card-icon">
                  <Mail size={24} />
                </div>
                <h3>Email Us</h3>
                <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <a href={`mailto:${email}`} style={{ transition: 'color 0.2s', fontSize: '1.1rem' }}>{email}</a>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          <RevealOnScroll>
            <div className="section-cta" style={{ marginTop: '80px' }}>
              <h2 style={{ marginBottom: '24px' }}>Have a question?</h2>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ContactActions productId="General Inquiry" productName="Website Visitor" />
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </div>
  );
}
