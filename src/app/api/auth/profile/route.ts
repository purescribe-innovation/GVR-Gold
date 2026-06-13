import { NextResponse } from 'next/server';
import { getAdmin, saveAdmin } from '@/lib/s3';
import { verifyToken, hashPassword, verifyPassword } from '@/lib/auth';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('gvr_admin_token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    const data = await request.json();
    const { name, email, username, currentPassword, newPassword } = data;

    const admin = await getAdmin();

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ success: false, error: 'Current password is required to set a new password' }, { status: 400 });
      }
      
      const isValid = await verifyPassword(currentPassword, admin.passwordHash);
      if (!isValid) {
        return NextResponse.json({ success: false, error: 'Incorrect current password' }, { status: 400 });
      }
      
      admin.passwordHash = await hashPassword(newPassword);
    }

    // Update other fields
    if (name) admin.name = name;
    if (email) admin.email = email;
    if (username) admin.username = username;

    await saveAdmin(admin);

    return NextResponse.json({ 
      success: true, 
      message: 'Profile updated successfully',
      data: {
        name: admin.name,
        email: admin.email,
        username: admin.username
      }
    });

  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}
