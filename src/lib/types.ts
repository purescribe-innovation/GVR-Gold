// ============================================================
// GVR Gold & Silver — Core Type Definitions
// ============================================================

export interface Product {
  id: string;
  name: string;
  category: string;
  metalType: 'gold' | 'silver';
  purity: string;
  weight: number;
  makingCharges: number;
  makingChargeType: 'flat' | 'percentage';
  description: string;
  images: string[];
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GoldRate {
  gold24k: number;
  gold22k: number;
  silver: number;
  lastUpdated: string;
  source: 'manual' | 'api';
}

export interface RatesConfig {
  currentRates: GoldRate;
  useApiRates: boolean;
  gstPercentage: number;
  apiKey?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  logoUrl: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  businessHours: string;
  mapEmbedUrl: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    twitter?: string;
  };
  aboutContent: string;
  heroHeadline: string;
  heroSubheadline: string;
  showLiveRates?: boolean;
}

export interface AdminCredentials {
  name?: string;
  email?: string;
  username: string;
  passwordHash: string;
}
