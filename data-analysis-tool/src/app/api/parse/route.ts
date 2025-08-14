import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { DataParser } from '@/lib/dataParser';

export async function POST(request: NextRequest) {
  try {
    const { filename } = await request.json();

    if (!filename) {
      return NextResponse.json({ success: false, error: 'Filename is required' });
    }

    // 업로드된 파일 경로
    const filepath = path.join(process.cwd(), 'uploads', filename);
    
    try {
      // 파일을 읽어서 File 객체로 변환
      const buffer = await readFile(filepath);
      const file = new File([buffer], filename);
      
      // 파일 파싱
      const dataset = await DataParser.parseFile(file);
      
      // 각 컬럼의 통계 정보 계산
      const columnsWithStats = dataset.columns.map(column => ({
        ...column,
        statistics: DataParser.getStatistics(column)
      }));

      return NextResponse.json({ 
        success: true, 
        dataset: {
          ...dataset,
          columns: columnsWithStats
        }
      });
    } catch (fileError) {
      return NextResponse.json({ 
        success: false, 
        error: `파일을 찾을 수 없습니다: ${filename}` 
      });
    }
  } catch (error) {
    console.error('Parse error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : '파일 파싱에 실패했습니다' 
    });
  }
}