'use client';

import { useState, useEffect } from 'react';
import { Phone, MessageCircle } from 'lucide-react';

interface ContactActionsProps {
  productId: string;
  productName: string;
}

export default function ContactActions({ productId, productName }: ContactActionsProps) {
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

  const phone = settings?.phone || '+91 9704223288';
  const whatsapp = settings?.whatsapp || '919704223288';

  const whatsappMessage = encodeURIComponent(
    `Hello, I am interested in Product ID ${productId} (${productName}). Please share availability and pricing details.`
  );

  return (
    <div className="contact-actions">
      <a href={`tel:${phone.replace(/\s/g, '')}`} className="btn btn-outline contact-btn">
        <Phone size={18} />
        Call Us
      </a>
      <a
        href={`https://wa.me/${whatsapp}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-gold contact-btn"
      >
        <MessageCircle size={18} />
        WhatsApp Inquiry
      </a>
    </div>
  );
}
