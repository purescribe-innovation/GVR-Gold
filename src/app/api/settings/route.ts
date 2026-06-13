// ============================================================
// GVR Gold & Silver — Store Settings API
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getSettings, saveSettings } from '@/lib/s3';
import { verifyToken } from '@/lib/auth';
import type { StoreSettings } from '@/lib/types';

export const dynamic = 'force-dynamic';

const FALLBACK_SETTINGS: StoreSettings = {
  storeName: 'GVR Gold & Silver',
  tagline: 'Crafted for Generations. Designed to Shine.',
  logoUrl: '',
  phone: '9704223288',
  whatsapp: '919704223288',
  email: 'yaswanthgedela27@gmail.com',
  address: '',
  city: 'Hyderabad',
  state: 'Telangana',
  pincode: '500001',
  businessHours: '',
  mapEmbedUrl: '',
  socialLinks: {
    instagram: 'https://instagram.com/gvrgoldsilver',
    facebook: 'https://facebook.com/gvrgoldsilver',
    youtube: '',
    twitter: '',
  },
  aboutContent: 'For over three decades, GVR Gold & Silver has been a trusted name in fine jewelry.',
  heroHeadline: 'Crafted for Generations. Designed to Shine.',
  heroSubheadline: 'Discover exquisite gold and silver ornaments, handcrafted with precision and passion.',
};

// GET /api/settings — Get store settings
export async function GET() {
  try {
    let settings: StoreSettings;
    try {
      settings = await getSettings();
    } catch {
      settings = FALLBACK_SETTINGS;
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({
      success: true,
      data: FALLBACK_SETTINGS,
      fallback: true,
    });
  }
}

// PUT /api/settings — Update store settings
export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('gvr_admin_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const updatedSettings: StoreSettings = {
      storeName: body.storeName || FALLBACK_SETTINGS.storeName,
      tagline: body.tagline || FALLBACK_SETTINGS.tagline,
      logoUrl: body.logoUrl || '',
      phone: body.phone || '',
      whatsapp: body.whatsapp || '',
      email: body.email || '',
      address: body.address || '',
      city: body.city || '',
      state: body.state || '',
      pincode: body.pincode || '',
      businessHours: body.businessHours || '',
      mapEmbedUrl: body.mapEmbedUrl || '',
      socialLinks: {
        instagram: body.socialLinks?.instagram || '',
        facebook: body.socialLinks?.facebook || '',
        youtube: body.socialLinks?.youtube || '',
        twitter: body.socialLinks?.twitter || '',
      },
      aboutContent: body.aboutContent || '',
      heroHeadline: body.heroHeadline || '',
      heroSubheadline: body.heroSubheadline || '',
      showLiveRates: body.showLiveRates !== undefined ? body.showLiveRates : true,
    };

    try {
      await saveSettings(updatedSettings);
    } catch (s3Error) {
      console.error('S3 save error:', s3Error);
      return NextResponse.json(
        { error: 'Failed to save settings. S3 may not be configured.' },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedSettings,
      message: 'Settings updated successfully',
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
