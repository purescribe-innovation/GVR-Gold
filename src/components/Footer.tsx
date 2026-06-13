'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

import { useState, useEffect } from 'react';

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) {
          setSettings(data.data);
        }
      })
      .catch(err => console.error("Failed to load settings in footer", err));
  }, []);

  const phone = settings?.phone || '9704223288';
  const email = settings?.email || 'yaswanthgedela27@gmail.com';

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-name">{settings?.storeName || 'GVR Gold & Silver'}</div>
            <p className="footer-brand-desc" style={{ whiteSpace: 'pre-line' }}>
              {settings?.aboutContent || 'Crafting timeless jewelry since generations. Each piece tells a story of heritage, artistry, and uncompromising quality. Discover the perfect piece that speaks to your soul.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <Link href="/" className="footer-link">Home</Link>
            <Link href="/about" className="footer-link">About Us</Link>
            <Link href="/contact" className="footer-link">Contact</Link>
          </div>

          {/* Collections */}
          <div>
            <h4 className="footer-heading">Collections</h4>
            <Link href="/collections/gold" className="footer-link">Gold Collection</Link>
            <Link href="/collections/silver" className="footer-link">Silver Collection</Link>
          </div>

          {/* Contact */}
          <div>
            <h4 className="footer-heading">Contact Us</h4>
            <div className="footer-contact-item">
              <Phone size={16} />
              <span>+91 {phone}</span>
            </div>
            <div className="footer-contact-item">
              <Mail size={16} />
              <span>{email}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <span>&copy; {currentYear} GVR Gold &amp; Silver. All rights reserved.</span>
          <span>Crafted with excellence in India</span>
        </div>
      </div>
    </footer>
  );
}
