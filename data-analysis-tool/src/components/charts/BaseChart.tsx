"use client";

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface BaseChartProps {
  option: echarts.EChartsOption;
  height?: string | number;
  className?: string;
}

export default function BaseChart({ option, height = 400, className = '' }: BaseChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Initialize chart
      chartInstance.current = echarts.init(chartRef.current);
      
      // Handle resize
      const handleResize = () => {
        chartInstance.current?.resize();
      };

      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        chartInstance.current?.dispose();
      };
    }
  }, []);

  useEffect(() => {
    if (chartInstance.current && option) {
      chartInstance.current.setOption(option, true);
    }
  }, [option]);

  return (
    <div 
      ref={chartRef} 
      className={className}
      style={{ height }}
    />
  );
}