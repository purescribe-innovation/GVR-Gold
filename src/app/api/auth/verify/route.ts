// ============================================================
// GVR Gold & Silver — Token Verification API
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('gvr_admin_token')?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false, username: null },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { authenticated: false, username: null },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      username: payload.username,
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { authenticated: false, username: null },
      { status: 401 }
    );
  }
}
