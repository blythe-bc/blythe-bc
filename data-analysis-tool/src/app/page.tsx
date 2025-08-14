"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, FileText, BarChart3, Brain, Upload } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import FileList from "@/components/FileList";
import DataPreview from "@/components/DataPreview";
import { FileInfo, Dataset } from "@/types";

export default function Home() {
  const [currentStep, setCurrentStep] = useState<'connect' | 'files' | 'analyze'>('connect');
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const [refreshFiles, setRefreshFiles] = useState(0);
  const [currentDataset, setCurrentDataset] = useState<Dataset | null>(null);

  const handleFileUploaded = (fileInfo: any) => {
    // Refresh file list when a new file is uploaded
    setRefreshFiles(prev => prev + 1);
    setCurrentStep('files');
  };

  const handleFileSelect = (file: FileInfo) => {
    setSelectedFile(file);
    setCurrentStep('analyze');
  };

  const handleDataLoaded = (dataset: Dataset) => {
    setCurrentDataset(dataset);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            데이터 분석 웹 툴
          </h1>
          <p className="text-gray-600 mt-1">네트워크 폴더 기반 데이터 분석 및 시각화 도구</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                currentStep === 'connect' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setCurrentStep('connect')}
            >
              <FolderOpen className="h-5 w-5" />
              <span>1. 파일 업로드</span>
            </div>
            <div className="h-px w-8 bg-gray-300"></div>
            <div 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                currentStep === 'files' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => selectedFile && setCurrentStep('files')}
            >
              <FileText className="h-5 w-5" />
              <span>2. 파일 선택</span>
            </div>
            <div className="h-px w-8 bg-gray-300"></div>
            <div 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                currentStep === 'analyze' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => selectedFile && setCurrentStep('analyze')}
            >
              <Brain className="h-5 w-5" />
              <span>3. 데이터 분석</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - File Management */}
          <div className="lg:col-span-1 space-y-6">
            {currentStep === 'connect' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      파일 업로드
                    </CardTitle>
                    <CardDescription>
                      분석할 데이터 파일을 업로드하세요
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FileUpload onFileUploaded={handleFileUploaded} />
                  </CardContent>
                </Card>
              </>
            )}
            
            <FileList 
              onFileSelect={handleFileSelect} 
              selectedFile={selectedFile}
              refresh={refreshFiles}
            />

            {selectedFile && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">선택된 파일</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>파일명:</strong> {selectedFile.originalName || selectedFile.name}</p>
                    <p><strong>크기:</strong> {selectedFile.size} bytes</p>
                    <p><strong>형식:</strong> {selectedFile.extension.toUpperCase()}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {currentStep === 'connect' && (
              <div className="grid gap-6">
                {/* Quick Start Cards */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BarChart3 className="h-5 w-5 text-green-600" />
                        데이터 시각화
                      </CardTitle>
                      <CardDescription>
                        ECharts를 이용한 인터랙티브 그래프 생성
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• 라인, 바, 파이 차트</li>
                        <li>• 스캐터 플롯</li>
                        <li>• 히스토그램</li>
                        <li>• 실시간 데이터 업데이트</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Brain className="h-5 w-5 text-purple-600" />
                        머신러닝 분석
                      </CardTitle>
                      <CardDescription>
                        자동화된 패턴 분석 및 예측
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• 선형/다항 회귀 분석</li>
                        <li>• 분류 알고리즘</li>
                        <li>• 클러스터링</li>
                        <li>• 이상치 탐지</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Feature Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>주요 기능</CardTitle>
                    <CardDescription>
                      강력한 데이터 분석 도구를 통해 인사이트를 얻으세요
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">데이터 처리</h4>
                        <p className="text-sm text-gray-600">
                          CSV, Excel, JSON 파일 자동 파싱 및 데이터 정제
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">실시간 협업</h4>
                        <p className="text-sm text-gray-600">
                          네트워크 폴더를 통한 팀 단위 데이터 공유
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">AI 인사이트</h4>
                        <p className="text-sm text-gray-600">
                          AI API를 활용한 자동 데이터 분석 및 추천
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">커스텀 대시보드</h4>
                        <p className="text-sm text-gray-600">
                          사용자 맞춤형 데이터 시각화 대시보드
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 'files' && !selectedFile && (
              <Card>
                <CardHeader>
                  <CardTitle>파일을 선택하세요</CardTitle>
                  <CardDescription>
                    왼쪽 목록에서 분석할 파일을 선택해주세요.
                  </CardDescription>
                </CardHeader>
                <CardContent className="py-16 text-center">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">업로드된 파일 중 하나를 선택하여 분석을 시작하세요.</p>
                </CardContent>
              </Card>
            )}

            {currentStep === 'analyze' && selectedFile && (
              <DataPreview 
                filename={selectedFile.name} 
                onDataLoaded={handleDataLoaded}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
