import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import path from 'path';
import { getFileExtension, isDataFile } from '@/lib/utils';

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    
    try {
      const files = await readdir(uploadsDir);
      const fileInfos = await Promise.all(
        files.map(async (filename) => {
          const filepath = path.join(uploadsDir, filename);
          const stats = await stat(filepath);
          const extension = getFileExtension(filename);
          
          return {
            name: filename,
            originalName: filename.split('_').slice(1).join('_'), // Remove timestamp prefix
            path: filepath,
            extension,
            size: stats.size,
            lastModified: stats.mtime,
            isDataFile: isDataFile(extension)
          };
        })
      );

      // Filter only data files and sort by modification date
      const dataFiles = fileInfos
        .filter(file => file.isDataFile)
        .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());

      return NextResponse.json({ success: true, files: dataFiles });
    } catch (error) {
      // Directory doesn't exist or is empty
      return NextResponse.json({ success: true, files: [] });
    }
  } catch (error) {
    console.error('Files list error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to list files' 
    });
  }
}