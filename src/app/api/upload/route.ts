// ============================================================
// GVR Gold & Silver — Image Upload API
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/s3';
import { verifyToken } from '@/lib/auth';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
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

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const productId = formData.get('productId') as string | null;
    const uploadType = formData.get('type') as string | null; // 'product' or 'logo'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size: 5MB' },
        { status: 400 }
      );
    }

    // Determine S3 key
    const ext = file.name.split('.').pop() || 'jpg';
    const timestamp = Date.now();
    let key: string;

    if (uploadType === 'logo') {
      key = `images/logo/logo.${ext}`;
    } else {
      const pid = productId || 'uncategorized';
      key = `images/products/${pid}/${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    try {
      let url: string;
      try {
        // Try S3 first
        url = await uploadImage(buffer, key, file.type);
      } catch (s3Error) {
        console.log('S3 upload failed. Reason:', s3Error);
        console.log('Falling back to local upload...');
        // Fallback to local upload
        const fs = require('fs');
        const path = require('path');
        
        const localPath = path.join(process.cwd(), 'public', 'uploads', file.name.replace(/[^a-zA-Z0-9.-]/g, '_'));
        fs.writeFileSync(localPath, buffer);
        url = `/uploads/${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      }

      return NextResponse.json({
        success: true,
        data: {
          url,
          key,
          filename: file.name,
          size: file.size,
          contentType: file.type,
        },
        message: 'File uploaded successfully',
      });
    } catch (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file. Both S3 and local fallback failed.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
