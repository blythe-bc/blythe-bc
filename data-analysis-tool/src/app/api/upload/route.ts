import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Save file with timestamp to avoid conflicts
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name}`;
    const filepath = path.join(uploadsDir, filename);

    await writeFile(filepath, buffer);

    return NextResponse.json({ 
      success: true, 
      filename,
      originalName: file.name,
      size: file.size,
      type: file.type,
      path: filepath
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to upload file' 
    });
  }
}