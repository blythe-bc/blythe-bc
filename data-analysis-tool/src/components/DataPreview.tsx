"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart3, FileText, TrendingUp, Hash, Type, Calendar, CheckSquare } from 'lucide-react';
import { Dataset, DataColumn } from '@/types';
import ChartBuilder from './ChartBuilder';

interface DataPreviewProps {
  filename: string;
  onDataLoaded?: (dataset: Dataset) => void;
}

interface ColumnWithStats extends DataColumn {
  statistics: any;
}

export default function DataPreview({ filename, onDataLoaded }: DataPreviewProps) {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'preview' | 'statistics' | 'charts'>('preview');

  useEffect(() => {
    if (filename) {
      parseFile();
    }
  }, [filename]);

  const parseFile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename }),
      });

      const result = await response.json();

      if (result.success) {
        setDataset(result.dataset);
        onDataLoaded?.(result.dataset);
      } else {
        setError(result.error || '파일 파싱에 실패했습니다.');
      }
    } catch (err) {
      setError('파일 파싱 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'number': return <Hash className="h-4 w-4 text-blue-600" />;
      case 'string': return <Type className="h-4 w-4 text-green-600" />;
      case 'date': return <Calendar className="h-4 w-4 text-purple-600" />;
      case 'boolean': return <CheckSquare className="h-4 w-4 text-orange-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatStatValue = (value: any): string => {
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return String(value);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">파일을 분석하고 있습니다...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <div className="text-red-600 mb-4">
            <FileText className="h-12 w-12 mx-auto mb-2" />
            <p>{error}</p>
          </div>
          <Button variant="outline" onClick={parseFile}>
            다시 시도
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!dataset) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Dataset Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {dataset.name}
          </CardTitle>
          <div className="flex gap-4 text-sm text-gray-600">
            <span>{dataset.rowCount}개 행</span>
            <span>{dataset.columns.length}개 컬럼</span>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'preview'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setSelectedTab('preview')}
        >
          데이터 미리보기
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'statistics'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setSelectedTab('statistics')}
        >
          통계 정보
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'charts'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setSelectedTab('charts')}
        >
          차트 생성
        </button>
      </div>

      {/* Content */}
      {selectedTab === 'preview' && (
        <Card>
          <CardHeader>
            <CardTitle>데이터 미리보기</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {dataset.columns.map((column) => (
                      <TableHead key={column.name} className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(column.type)}
                          <span>{column.name}</span>
                          <span className="text-xs text-gray-500">({column.type})</span>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataset.columns[0]?.values.slice(0, 10).map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {dataset.columns.map((column) => (
                        <TableCell key={column.name} className="whitespace-nowrap">
                          {String(column.values[rowIndex] ?? '')}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {dataset.rowCount > 10 && (
              <div className="mt-4 text-sm text-gray-500 text-center">
                처음 10개 행만 표시됩니다. 전체 {dataset.rowCount}개 행
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {selectedTab === 'statistics' && (
        <div className="grid gap-4">
          {dataset.columns.map((column) => {
            const columnWithStats = column as ColumnWithStats;
            return (
              <Card key={column.name}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {getTypeIcon(column.type)}
                    {column.name}
                    <span className="text-sm font-normal text-gray-500">({column.type})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {columnWithStats.statistics && Object.entries(columnWithStats.statistics).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {formatStatValue(value)}
                        </div>
                        <div className="text-sm text-gray-600 capitalize">
                          {key.replace(/_/g, ' ')}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* 빈도 분석 결과 표시 (문자열 컬럼의 경우) */}
                  {column.type === 'string' && columnWithStats.statistics?.frequency_top_5 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">상위 빈도값</h4>
                      <div className="space-y-1">
                        {columnWithStats.statistics.frequency_top_5.map(([value, count]: [string, number], index: number) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="truncate">{value}</span>
                            <span className="text-gray-600">{count}회</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {selectedTab === 'charts' && (
        <ChartBuilder dataset={dataset} />
      )}
    </div>
  );
}