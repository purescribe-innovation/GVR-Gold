// ============================================================
// GVR Gold & Silver — Admin Login API
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, verifyPassword, createToken } from '@/lib/auth';
import { getAdmin, saveAdmin } from '@/lib/s3';

const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'admin123';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    let admin;
    let isFirstLogin = false;

    try {
      admin = await getAdmin();
      // Check if this is using the placeholder hash (first-time setup)
      if (admin.passwordHash === '$2a$10$defaulthashplaceholder') {
        isFirstLogin = true;
      }
    } catch {
      // S3 not configured or admin.json doesn't exist — treat as first login
      isFirstLogin = true;
      admin = { username: DEFAULT_USERNAME, passwordHash: '' };
    }

    if (isFirstLogin) {
      // First time login: accept default credentials
      if (username !== DEFAULT_USERNAME || password !== DEFAULT_PASSWORD) {
        return NextResponse.json(
          { error: 'Invalid credentials. Default: admin / admin123' },
          { status: 401 }
        );
      }

      // Hash the default password and save to S3
      const passwordHash = await hashPassword(DEFAULT_PASSWORD);
      const newAdmin = { username: DEFAULT_USERNAME, passwordHash };

      try {
        await saveAdmin(newAdmin);
      } catch (saveError) {
        console.error('Could not save admin credentials to S3:', saveError);
        // Continue — still allow login even if S3 save fails
      }

      const token = await createToken(DEFAULT_USERNAME);

      const response = NextResponse.json({
        success: true,
        message: 'First-time login successful. Please change your password.',
        username: DEFAULT_USERNAME,
      });

      response.cookies.set('gvr_admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return response;
    }

    // Subsequent logins: verify against stored hash
    if (username !== admin.username) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = await createToken(admin.username);

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      username: admin.username,
    });

    response.cookies.set('gvr_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
