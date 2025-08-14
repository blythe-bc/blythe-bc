"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, Scatter } from 'lucide-react';
import { Dataset, ChartConfig } from '@/types';
import LineChart from './charts/LineChart';
import BarChart from './charts/BarChart';
import PieChart from './charts/PieChart';
import ScatterChart from './charts/ScatterChart';

interface ChartBuilderProps {
  dataset: Dataset;
}

export default function ChartBuilder({ dataset }: ChartBuilderProps) {
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    type: 'bar',
    title: '',
    xAxis: '',
    yAxis: [],
    groupBy: '',
    aggregation: 'sum'
  });

  const numericColumns = dataset.columns.filter(col => col.type === 'number');
  const categoricalColumns = dataset.columns.filter(col => col.type === 'string');
  const allColumns = dataset.columns;

  const updateConfig = (key: keyof ChartConfig, value: any) => {
    setChartConfig(prev => ({ ...prev, [key]: value }));
  };

  const prepareChartData = () => {
    if (!chartConfig.xAxis || !chartConfig.yAxis?.length) {
      return null;
    }

    const xColumn = dataset.columns.find(col => col.name === chartConfig.xAxis);
    const yColumn = dataset.columns.find(col => col.name === chartConfig.yAxis[0]);

    if (!xColumn || !yColumn) return null;

    switch (chartConfig.type) {
      case 'line':
      case 'bar':
        if (xColumn.type === 'string') {
          // 카테고리별 집계
          const aggregatedData = new Map<string, number[]>();
          
          xColumn.values.forEach((xVal, index) => {
            const yVal = Number(yColumn.values[index]);
            if (!isNaN(yVal)) {
              const key = String(xVal);
              if (!aggregatedData.has(key)) {
                aggregatedData.set(key, []);
              }
              aggregatedData.get(key)!.push(yVal);
            }
          });

          const xData: string[] = [];
          const yData: number[] = [];

          aggregatedData.forEach((values, key) => {
            let aggregatedValue: number;
            switch (chartConfig.aggregation) {
              case 'mean':
                aggregatedValue = values.reduce((a, b) => a + b, 0) / values.length;
                break;
              case 'count':
                aggregatedValue = values.length;
                break;
              case 'max':
                aggregatedValue = Math.max(...values);
                break;
              case 'min':
                aggregatedValue = Math.min(...values);
                break;
              default: // sum
                aggregatedValue = values.reduce((a, b) => a + b, 0);
            }
            
            xData.push(key);
            yData.push(aggregatedValue);
          });

          return { xData, yData };
        } else {
          // 숫자 데이터는 그대로 사용
          const xData = xColumn.values.map(val => Number(val)).filter(val => !isNaN(val));
          const yData = yColumn.values.map(val => Number(val)).filter(val => !isNaN(val));
          return { xData, yData };
        }

      case 'pie':
        if (xColumn.type === 'string') {
          const frequencyMap = new Map<string, number>();
          xColumn.values.forEach(val => {
            const key = String(val);
            frequencyMap.set(key, (frequencyMap.get(key) || 0) + 1);
          });

          const data = Array.from(frequencyMap.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10); // 상위 10개만

          return { data };
        }
        break;

      case 'scatter':
        if (xColumn.type === 'number' && yColumn.type === 'number') {
          const data: [number, number][] = [];
          for (let i = 0; i < Math.min(xColumn.values.length, yColumn.values.length); i++) {
            const x = Number(xColumn.values[i]);
            const y = Number(yColumn.values[i]);
            if (!isNaN(x) && !isNaN(y)) {
              data.push([x, y]);
            }
          }
          return { data };
        }
        break;
    }

    return null;
  };

  const renderChart = () => {
    const data = prepareChartData();
    if (!data) return null;

    const title = chartConfig.title || `${chartConfig.type} Chart`;
    const xAxisName = chartConfig.xAxis;
    const yAxisName = chartConfig.yAxis[0];

    switch (chartConfig.type) {
      case 'line':
        return (
          <LineChart
            xData={data.xData}
            yData={data.yData}
            title={title}
            xAxisName={xAxisName}
            yAxisName={yAxisName}
            height={500}
          />
        );
      case 'bar':
        return (
          <BarChart
            xData={data.xData as string[]}
            yData={data.yData}
            title={title}
            xAxisName={xAxisName}
            yAxisName={yAxisName}
            height={500}
          />
        );
      case 'pie':
        return (
          <PieChart
            data={data.data}
            title={title}
            height={500}
          />
        );
      case 'scatter':
        return (
          <ScatterChart
            data={data.data}
            title={title}
            xAxisName={xAxisName}
            yAxisName={yAxisName}
            height={500}
          />
        );
    }
    return null;
  };

  const getChartIcon = (type: string) => {
    switch (type) {
      case 'line': return <LineChartIcon className="h-4 w-4" />;
      case 'bar': return <BarChart3 className="h-4 w-4" />;
      case 'pie': return <PieChartIcon className="h-4 w-4" />;
      case 'scatter': return <Scatter className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Chart Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getChartIcon(chartConfig.type)}
            차트 생성기
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Chart Type */}
            <div className="space-y-2">
              <Label>차트 타입</Label>
              <Select value={chartConfig.type} onValueChange={(value: any) => updateConfig('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">막대 차트</SelectItem>
                  <SelectItem value="line">라인 차트</SelectItem>
                  <SelectItem value="pie">파이 차트</SelectItem>
                  <SelectItem value="scatter">스캐터 차트</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label>차트 제목</Label>
              <Input
                value={chartConfig.title}
                onChange={(e) => updateConfig('title', e.target.value)}
                placeholder="차트 제목을 입력하세요"
              />
            </div>

            {/* X Axis */}
            <div className="space-y-2">
              <Label>X축 (카테고리)</Label>
              <Select value={chartConfig.xAxis} onValueChange={(value) => updateConfig('xAxis', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="컬럼을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {allColumns.map(col => (
                    <SelectItem key={col.name} value={col.name}>
                      {col.name} ({col.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Y Axis */}
            {chartConfig.type !== 'pie' && (
              <div className="space-y-2">
                <Label>Y축 (값)</Label>
                <Select value={chartConfig.yAxis[0]} onValueChange={(value) => updateConfig('yAxis', [value])}>
                  <SelectTrigger>
                    <SelectValue placeholder="컬럼을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {numericColumns.map(col => (
                      <SelectItem key={col.name} value={col.name}>
                        {col.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Aggregation */}
            {chartConfig.type !== 'scatter' && chartConfig.type !== 'pie' && (
              <div className="space-y-2">
                <Label>집계 방법</Label>
                <Select value={chartConfig.aggregation} onValueChange={(value: any) => updateConfig('aggregation', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sum">합계</SelectItem>
                    <SelectItem value="mean">평균</SelectItem>
                    <SelectItem value="count">개수</SelectItem>
                    <SelectItem value="max">최댓값</SelectItem>
                    <SelectItem value="min">최솟값</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chart Preview */}
      <Card>
        <CardHeader>
          <CardTitle>차트 미리보기</CardTitle>
        </CardHeader>
        <CardContent>
          {chartConfig.xAxis && (chartConfig.yAxis?.length || chartConfig.type === 'pie') ? (
            <div className="w-full">
              {renderChart()}
            </div>
          ) : (
            <div className="py-16 text-center text-gray-500">
              <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p>차트를 생성하려면 필수 설정을 완료해주세요.</p>
              <ul className="mt-2 text-sm space-y-1">
                <li>• X축 컬럼 선택</li>
                {chartConfig.type !== 'pie' && <li>• Y축 컬럼 선택</li>}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}