"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, HardDrive, RefreshCw } from 'lucide-react';
import { formatFileSize, formatDate } from '@/lib/utils';
import { FileInfo } from '@/types';

interface FileListProps {
  onFileSelect?: (file: FileInfo) => void;
  selectedFile?: FileInfo | null;
  refresh?: boolean;
}

export default function FileList({ onFileSelect, selectedFile, refresh }: FileListProps) {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/files');
      const result = await response.json();

      if (result.success) {
        setFiles(result.files);
        setError(null);
      } else {
        setError(result.error || 'Failed to load files');
      }
    } catch (err) {
      setError('Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [refresh]);

  const getFileIcon = (extension: string) => {
    switch (extension.toLowerCase()) {
      case 'csv':
        return '📊';
      case 'json':
        return '📋';
      case 'xlsx':
      case 'xls':
        return '📈';
      case 'txt':
        return '📄';
      default:
        return '📁';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          업로드된 파일
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={fetchFiles}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">파일 목록 로딩 중...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            <p>{error}</p>
            <Button variant="outline" size="sm" onClick={fetchFiles} className="mt-2">
              다시 시도
            </Button>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>업로드된 파일이 없습니다.</p>
            <p className="text-sm">파일을 업로드해서 분석을 시작하세요.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file, index) => (
              <div
                key={file.name}
                className={`
                  p-4 border rounded-lg cursor-pointer transition-colors
                  ${selectedFile?.name === file.name 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
                onClick={() => onFileSelect?.(file)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getFileIcon(file.extension)}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {file.originalName || file.name}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <HardDrive className="h-3 w-3" />
                          {formatFileSize(file.size)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(new Date(file.lastModified))}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs uppercase">
                          {file.extension}
                        </span>
                      </div>
                    </div>
                  </div>
                  {selectedFile?.name === file.name && (
                    <div className="text-blue-600 font-medium text-sm">
                      선택됨
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}