"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { formatFileSize } from '@/lib/utils';

interface FileUploadProps {
  onFileUploaded?: (fileInfo: any) => void;
}

export default function FileUpload({ onFileUploaded }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setUploadStatus({ type: null, message: '' });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setUploadStatus({
          type: 'success',
          message: `파일 "${result.originalName}"이 성공적으로 업로드되었습니다.`,
        });
        onFileUploaded?.(result);
      } else {
        setUploadStatus({
          type: 'error',
          message: result.error || '파일 업로드에 실패했습니다.',
        });
      }
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: '파일 업로드 중 오류가 발생했습니다.',
      });
    } finally {
      setUploading(false);
    }
  }, [onFileUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/plain': ['.txt'],
      'text/tab-separated-values': ['.tsv'],
    },
    multiple: false,
    disabled: uploading,
  });

  return (
    <Card>
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
            ${uploading ? 'cursor-not-allowed opacity-50' : 'hover:border-blue-400 hover:bg-gray-50'}
          `}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-4">
            <div className="flex justify-center">
              {uploading ? (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              ) : (
                <Upload className={`h-12 w-12 ${isDragActive ? 'text-blue-600' : 'text-gray-400'}`} />
              )}
            </div>

            <div>
              <p className="text-lg font-medium text-gray-700">
                {uploading ? '파일 업로드 중...' : '파일을 드래그하거나 클릭하여 업로드'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                CSV, Excel, JSON, TXT 파일을 지원합니다 (최대 10MB)
              </p>
            </div>

            {!uploading && (
              <Button variant="outline" className="mt-4">
                <FileText className="h-4 w-4 mr-2" />
                파일 선택
              </Button>
            )}
          </div>
        </div>

        {/* Upload Status */}
        {uploadStatus.type && (
          <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
            uploadStatus.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {uploadStatus.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span className="text-sm">{uploadStatus.message}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}