// ============================================================
// GVR Gold & Silver — Rates API
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getRates, saveRates } from '@/lib/s3';
import { verifyToken } from '@/lib/auth';
import type { RatesConfig } from '@/lib/types';

export const dynamic = 'force-dynamic';

const FALLBACK_RATES: RatesConfig = {
  currentRates: {
    gold24k: 7250,
    gold22k: 6645,
    silver: 92,
    lastUpdated: new Date().toISOString(),
    source: 'manual',
  },
  useApiRates: true,
  gstPercentage: 3,
};

// GET /api/rates — Get current rates config
export async function GET(request: NextRequest) {
  try {
    let rates: RatesConfig;
    try {
      rates = await getRates();
    } catch {
      rates = FALLBACK_RATES;
    }

    const force = request.nextUrl.searchParams.get('force') === 'true';

    // Always attempt to fetch live rates if useApiRates is enabled
    if (rates.useApiRates) {
      try {
        const apiKey = rates.apiKey || 'V7IOEMMRHUHZBTC9ROAS620C9ROAS'; // Prioritize the working API key provided by user
        const url = `https://api.metals.dev/v1/latest?api_key=${apiKey}&currency=INR&unit=g`;
        
        // Use no-store if forced, otherwise cache for 1 hour
        const fetchOptions: RequestInit = force 
          ? { cache: 'no-store' } 
          : { next: { revalidate: 3600 } };

        const res = await fetch(url, fetchOptions);
        const data = await res.json();
        
        if (data && data.status === 'success' && data.metals) {
          const gold24k = data.metals.gold;
          const silver = data.metals.silver;
          const gold22k = gold24k * (22 / 24); // standard 91.6% purity calculation
          
          rates.currentRates = {
            gold24k: Math.round(gold24k * 100) / 100,
            gold22k: Math.round(gold22k * 100) / 100,
            silver: Math.round(silver * 100) / 100,
            lastUpdated: new Date().toISOString(),
            source: 'api'
          };
        }
      } catch (apiErr) {
        console.error('Failed to fetch live API rates:', apiErr);
        rates.currentRates.source = 'manual';
      }
    }

    return NextResponse.json({ success: true, data: rates });
  } catch (error) {
    console.error('Error fetching rates:', error);
    return NextResponse.json({
      success: true,
      data: FALLBACK_RATES,
      fallback: true,
    });
  }
}

// PUT /api/rates — Update rates config
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

    const updatedRates: RatesConfig = {
      currentRates: {
        gold24k: parseFloat(body.currentRates?.gold24k) || 0,
        gold22k: parseFloat(body.currentRates?.gold22k) || 0,
        silver: parseFloat(body.currentRates?.silver) || 0,
        lastUpdated: new Date().toISOString(),
        source: body.currentRates?.source || 'manual',
      },
      useApiRates: body.useApiRates || false,
      gstPercentage: parseFloat(body.gstPercentage) || 3,
      apiKey: body.apiKey,
    };

    try {
      await saveRates(updatedRates);
    } catch (s3Error) {
      console.error('S3 save error:', s3Error);
      return NextResponse.json(
        { error: 'Failed to save rates. S3 may not be configured.' },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedRates,
      message: 'Rates updated successfully',
    });
  } catch (error) {
    console.error('Error updating rates:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
